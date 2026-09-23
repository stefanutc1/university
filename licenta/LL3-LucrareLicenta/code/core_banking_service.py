"""
Sistem Central Core-Banking (Inspirat de Apache Fineract / Mifos X)
Lucrare de Licență: Arhitectura și Securitatea Sistemelor Informatice Bancare
Autor: Ștefănuț-Cornel Moanță | Facultatea de Economie și Administrarea Afacerilor (FEAA), Universitatea din Craiova
Specializarea: Informatică Economică

Modul: Core-Banking Engine (VM 310)
Rol: Gestionarea conturilor, a registrelor contabile în partidă dublă (Double-Entry General Ledger),
     a soldurilor și a controlului de acces bazat pe roluri (RBAC) și segmentare de rețea (VLAN 20).
     Accesul este restricționat strict la casierii autorizați (Tellers) și terminalul Kiosk (VM 205).
"""

from datetime import datetime, timezone
import hashlib
import json
import logging
import sys
import time
from typing import Any, Dict, List, Optional, Tuple
import uuid

# Configurare Logging conform standardelor bancare de audit
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] [AuditID:%(process)d] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("CoreBanking")

# Reguli de Rețea și Politici Firewall (VLAN 20 - Services)
# Doar IP-urile din rețeaua internă autorizată au permisiuni de interogare
AUTHORIZED_TELLER_IPS = {"192.168.20.10", "192.168.20.11", "127.0.0.1"}
AUTHORIZED_KIOSK_IPS = {"192.168.20.100", "192.168.1.205", "127.0.0.1"}

# Chei API și Token-uri de autentificare
VALID_TELLER_TOKENS = {"TELLER_JWT_SECRET_FEAA_2026", "OPERATOR_SECRET_KEY_99"}
VALID_KIOSK_KEYS = {"KIOSK_DEVICE_CERT_HW_TOKEN_2026", "KIOSK_API_KEY_001"}

# Baza de date în memorie pentru Core-Banking
CLIENTS_DB: Dict[str, Dict[str, Any]] = {}
ACCOUNTS_DB: Dict[str, Dict[str, Any]] = {}
LEDGER_ENTRIES: List[Dict[str, Any]] = []
AUDIT_TRAIL: List[Dict[str, Any]] = []


def calculate_hash(prev_hash: str, entry_data: str) -> str:
    """Calculează hash SHA-256 pentru asigurarea integrității lanțului contabil."""
    record = f"{prev_hash}|{entry_data}"
    return hashlib.sha256(record.encode("utf-8")).hexdigest()


class CoreBankingSecurityGuard:
    """Verificator de securitate pentru controlul accesului conform politicilor OPNsense și RBAC."""

    @staticmethod
    def verify_request(client_ip: str, role: str, auth_token: str) -> Tuple[bool, str]:
        """
        Verifică dacă cererea provine dintr-o zonă de rețea autorizată și deține token valid.
        Simulează aplicarea filtrelor firewall OPNsense (VLAN 20) combinate cu RBAC-ul aplicației.
        """
        # Verificare segment rețea (VLAN 30 / Attacker Subnet este respins)
        if client_ip.startswith("192.168.30.") or client_ip.startswith("10."):
            logger.error("INCIDENT SECURITATE: Încercare acces neautorizat din VLAN nepermis | Sursă: %s | Rol: %s",
                         client_ip, role)
            AUDIT_TRAIL.append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event": "FIREWALL_POLICY_VIOLATION",
                "source_ip": client_ip,
                "role_attempted": role,
                "action": "DROPPED"
            })
            return False, "FIREWALL_POLICY_VIOLATION_UNTRUSTED_SUBNET"

        # Verificare drepturi operator casierie (Teller)
        if role == "TELLER":
            if client_ip not in AUTHORIZED_TELLER_IPS:
                logger.warning("Acces Respins Casierie: IP neautorizat | IP: %s", client_ip)
                return False, "UNAUTHORIZED_TELLER_LOCATION"
            if auth_token not in VALID_TELLER_TOKENS:
                logger.warning("Autentificare Eșuată Casierie: Token invalid | IP: %s", client_ip)
                return False, "INVALID_TELLER_CREDENTIALS"
            return True, "AUTHORIZED_TELLER"

        # Verificare drepturi terminal Kiosk (Client Self-Service VM)
        elif role == "KIOSK":
            if client_ip not in AUTHORIZED_KIOSK_IPS:
                logger.warning("Acces Respins Kiosk: IP nespecificat în lista albă | IP: %s", client_ip)
                return False, "UNAUTHORIZED_KIOSK_LOCATION"
            if auth_token not in VALID_KIOSK_KEYS:
                logger.warning("Autentificare Eșuată Kiosk: Certificat/Cheie invalidă | IP: %s", client_ip)
                return False, "INVALID_KIOSK_KEY"
            return True, "AUTHORIZED_KIOSK"

        # Orice alt rol neverificat
        return False, "UNKNOWN_OR_FORBIDDEN_ROLE"


class CoreBankingEngine:
    """Motorul central de contabilitate bancară în partidă dublă (Apache Fineract model)."""

    @classmethod
    def reset_state(cls):
        """Resetează colecțiile în memorie pentru un mediu de testare izolat."""
        global CLIENTS_DB, ACCOUNTS_DB, LEDGER_ENTRIES
        CLIENTS_DB.clear()
        ACCOUNTS_DB.clear()
        LEDGER_ENTRIES.clear()

    def __init__(self):
        self.last_ledger_hash = LEDGER_ENTRIES[-1]["entry_hash"] if LEDGER_ENTRIES else "0" * 64
        self._initialize_master_accounts()

    def _initialize_master_accounts(self):
        """Inițializează conturile generale de casierie și depozit (General Ledger)."""
        # Contul de tezaur/casierie centrală a băncii (Activ)
        ACCOUNTS_DB["RO00FEAA0000000000000001"] = {
            "account_id": "ACC-GL-CASH-VAULT",
            "iban": "RO00FEAA0000000000000001",
            "client_id": "CLIENT-BANK-TREASURY",
            "currency": "RON",
            "balance": 10000000.00,  # 10 milioane RON lichiditate
            "type": "GL_ASSET_VAULT",
            "status": "ACTIVE"
        }
        # Contul de decontare interbancară (Pasiv/Activ)
        ACCOUNTS_DB["RO00FEAA0000000000000002"] = {
            "account_id": "ACC-GL-SETTLEMENT",
            "iban": "RO00FEAA0000000000000002",
            "client_id": "CLIENT-BANK-TREASURY",
            "currency": "RON",
            "balance": 5000000.00,
            "type": "GL_CLEARING",
            "status": "ACTIVE"
        }

    def create_client(self, cnp_cui: str, full_name: str, client_type: str = "INDIVIDUAL") -> Dict[str, Any]:
        """Înregistrează un client nou în evidențele băncii (KYC)."""
        client_id = f"CL-{uuid.uuid4().hex[:6].upper()}"
        client_data = {
            "client_id": client_id,
            "cnp_cui": cnp_cui,
            "full_name": full_name,
            "client_type": client_type,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "KYC_VERIFIED"
        }
        CLIENTS_DB[client_id] = client_data
        logger.info("Client nou înregistrat: %s (%s) | ID: %s", full_name, cnp_cui, client_id)
        return client_data

    def open_account(self, client_id: str, currency: str = "RON", initial_deposit: float = 0.0) -> Dict[str, Any]:
        """Deschide un cont curent sau de economii și generează codul IBAN."""
        if client_id not in CLIENTS_DB:
            raise ValueError("Clientul specificat nu există în sistem")

        iban = f"RO29FEAA{str(uuid.uuid4().int)[:16]}"
        account_id = f"ACC-{uuid.uuid4().hex[:8].upper()}"
        account_data = {
            "account_id": account_id,
            "iban": iban,
            "client_id": client_id,
            "currency": currency,
            "balance": 0.0,
            "type": "SAVINGS_CHECKING",
            "status": "ACTIVE",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        ACCOUNTS_DB[iban] = account_data
        logger.info("Cont bancar deschis: IBAN %s | Moneda: %s | ClientID: %s", iban, currency, client_id)

        if initial_deposit > 0:
            self.post_double_entry_transaction(
                source_iban="RO00FEAA0000000000000001",
                dest_iban=iban,
                amount=initial_deposit,
                narrative=f"Alimentare cont deschidere client {client_id}",
                operator_id="SYSTEM_INIT"
            )

        return account_data

    def get_account_balance(self, iban: str, client_ip: str, role: str, auth_token: str) -> Dict[str, Any]:
        """Interogare protejată a soldului contului conform politicilor de securitate."""
        allowed, reason = CoreBankingSecurityGuard.verify_request(client_ip, role, auth_token)
        if not allowed:
            logger.warning("Interogare Sold REFUZATĂ: %s | IBAN: %s | IP: %s", reason, iban, client_ip)
            return {
                "status": "FORBIDDEN",
                "error": reason,
                "iban": iban
            }

        acc = ACCOUNTS_DB.get(iban)
        if not acc:
            return {"status": "NOT_FOUND", "iban": iban}

        return {
            "status": "SUCCESS",
            "account_id": acc["account_id"],
            "iban": acc["iban"],
            "currency": acc["currency"],
            "balance": acc["balance"],
            "status_account": acc["status"]
        }

    def post_double_entry_transaction(
        self,
        source_iban: str,
        dest_iban: str,
        amount: float,
        narrative: str,
        operator_id: str,
        client_ip: str = "127.0.0.1"
    ) -> Dict[str, Any]:
        """
        Execută o înregistrare în partidă dublă (Double-Entry Bookkeeping).
        Principiul fundamental: Debit = Credit.
        Debitează contul sursă și creditează contul destinație în mod atomic.
        """
        if amount <= 0:
            raise ValueError("Suma tranzacției trebuie să fie strict pozitivă")

        src_acc = ACCOUNTS_DB.get(source_iban)
        dst_acc = ACCOUNTS_DB.get(dest_iban)

        if not src_acc or not dst_acc:
            raise ValueError("Unul dintre conturile implicate nu există")

        if src_acc["status"] != "ACTIVE" or dst_acc["status"] != "ACTIVE":
            raise ValueError("Contul sursă sau destinație este blocat/inactiv")

        # Verificare sold disponibil (cu excepția conturilor de trezorerie bancară)
        if not src_acc["type"].startswith("GL_") and src_acc["balance"] < amount:
            raise ValueError(f"Fonduri insuficiente în contul sursă (Disponibil: {src_acc['balance']} {src_acc['currency']})")

        tx_id = f"TX-{uuid.uuid4().hex[:10].upper()}"
        timestamp = datetime.now(timezone.utc).isoformat()

        # Actualizare solduri în mod atomic
        src_acc["balance"] -= amount
        dst_acc["balance"] += amount

        # Înregistrare în Cartea Mare (General Ledger) cu lanț de integritate criptografic
        entry_payload = f"{tx_id}|{source_iban}|{dest_iban}|{amount:.2f}|{src_acc['currency']}|{timestamp}"
        entry_hash = calculate_hash(self.last_ledger_hash, entry_payload)

        ledger_record = {
            "status": "SUCCESS",
            "entry_index": len(LEDGER_ENTRIES) + 1,
            "tx_id": tx_id,
            "source_debit_iban": source_iban,
            "dest_credit_iban": dest_iban,
            "amount": amount,
            "currency": src_acc["currency"],
            "narrative": narrative,
            "operator_id": operator_id,
            "client_ip": client_ip,
            "timestamp": timestamp,
            "prev_hash": self.last_ledger_hash,
            "entry_hash": entry_hash
        }
        LEDGER_ENTRIES.append(ledger_record)
        self.last_ledger_hash = entry_hash

        logger.info("Înregistrare Partidă Dublă Reușită | TxID: %s | Debit: %s | Credit: %s | %.2f %s | Hash: %s",
                    tx_id, source_iban, dest_iban, amount, src_acc["currency"], entry_hash[:12])

        return ledger_record

    def verify_ledger_integrity(self) -> Tuple[bool, int, str]:
        """Validează matematic integritatea întregului lanț contabil (Audit Contabil)."""
        current_hash = "0" * 64
        for idx, entry in enumerate(LEDGER_ENTRIES):
            if entry["prev_hash"] != current_hash:
                return False, idx, f"Rupere de lanț hash la indexul {idx+1}"
            payload = f"{entry['tx_id']}|{entry['source_debit_iban']}|{entry['dest_credit_iban']}|{entry['amount']:.2f}|{entry['currency']}|{entry['timestamp']}"
            computed = calculate_hash(current_hash, payload)
            if computed != entry["entry_hash"]:
                return False, idx, f"Semnătură coruptă la tranzacția {entry['tx_id']}"
            current_hash = computed
        return True, len(LEDGER_ENTRIES), "Integritate contabilă 100% verificată"


# ==============================================================================
# FASTAPI MICROSERVICE EXPOSURE
# ==============================================================================
try:
    from fastapi import FastAPI, Header, HTTPException, Request
    from pydantic import BaseModel, Field

    engine = CoreBankingEngine()
    app = FastAPI(
        title="Core-Banking System (Apache Fineract / Mifos X Inspired)",
        description="Sistemul Central Bancar pentru gestiunea conturilor și partidei duble",
        version="1.0.0"
    )

    class ClientCreateReq(BaseModel):
        cnp_cui: str
        full_name: str
        client_type: str = "INDIVIDUAL"

    class AccountOpenReq(BaseModel):
        client_id: str
        currency: str = "RON"
        initial_deposit: float = 0.0

    class TransferReq(BaseModel):
        source_iban: str
        dest_iban: str
        amount: float
        narrative: str

    @app.get("/api/v1/health")
    async def health():
        valid, count, msg = engine.verify_ledger_integrity()
        return {
            "status": "HEALTHY",
            "ledger_entries": count,
            "integrity": msg,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @app.post("/api/v1/clients")
    async def api_create_client(req: ClientCreateReq):
        return engine.create_client(req.cnp_cui, req.full_name, req.client_type)

    @app.post("/api/v1/accounts")
    async def api_open_account(req: AccountOpenReq):
        try:
            return engine.open_account(req.client_id, req.currency, req.initial_deposit)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @app.get("/api/v1/accounts/{iban}/balance")
    async def api_get_balance(
        iban: str,
        request: Request,
        x_auth_role: str = Header("TELLER"),
        x_auth_token: str = Header(...)
    ):
        client_ip = request.client.host if request.client else "127.0.0.1"
        res = engine.get_account_balance(iban, client_ip, x_auth_role, x_auth_token)
        if res.get("status") == "FORBIDDEN":
            raise HTTPException(status_code=403, detail=res)
        if res.get("status") == "NOT_FOUND":
            raise HTTPException(status_code=404, detail="Contul nu există")
        return res

    @app.post("/api/v1/ledger/transfer")
    async def api_transfer(
        req: TransferReq,
        request: Request,
        x_auth_role: str = Header("TELLER"),
        x_auth_token: str = Header(...)
    ):
        client_ip = request.client.host if request.client else "127.0.0.1"
        allowed, reason = CoreBankingSecurityGuard.verify_request(client_ip, x_auth_role, x_auth_token)
        if not allowed:
            raise HTTPException(status_code=403, detail=f"Acces respins: {reason}")
        try:
            return engine.post_double_entry_transaction(
                req.source_iban,
                req.dest_iban,
                req.amount,
                req.narrative,
                operator_id=f"{x_auth_role}_{client_ip}",
                client_ip=client_ip
            )
        except ValueError as err:
            raise HTTPException(status_code=400, detail=str(err))

except ImportError:
    app = None
    engine = CoreBankingEngine()


# ==============================================================================
# CLI VALIDATION SUITE (Autonomă)
# ==============================================================================
def run_cli_self_test():
    """Rulare suita de teste autonome pentru Core-Banking."""
    print("=" * 80)
    print("SUITA DE TESTARE: Core-Banking Central Engine & Double-Entry Ledger")
    print("Student: Ștefănuț-Cornel Moanță | Informatică Economică FEAA UCV")
    print("=" * 80)

    cb = CoreBankingEngine()

    # 1. Creare Client & Deschidere Cont
    print("\n[TEST 1] Înregistrare Client KYC și Deschidere Cont Curent...")
    client = cb.create_client("1980315160011", "Popescu Ion", "INDIVIDUAL")
    print(f"Client creat: {client['full_name']} | ID: {client['client_id']}")

    acc1 = cb.open_account(client["client_id"], "RON", initial_deposit=5000.00)
    print(f"Cont creat: IBAN {acc1['iban']} | Sold Inițial: {acc1['balance']} RON")
    assert acc1["balance"] == 5000.00, "Eșec alocare depozit inițial"

    client2 = cb.create_client("2950821160022", "Ionescu Maria", "INDIVIDUAL")
    acc2 = cb.open_account(client2["client_id"], "RON", initial_deposit=100.00)

    # 2. Interogare Sold Autorizată (Casier autorizat în VLAN 20)
    print("\n[TEST 2] Interogare Sold Autorizată (Casier autorizat IP: 192.168.20.10)...")
    res_auth = cb.get_account_balance(
        iban=acc1["iban"],
        client_ip="192.168.20.10",
        role="TELLER",
        auth_token="TELLER_JWT_SECRET_FEAA_2026"
    )
    print(f"Răspuns: {res_auth['status']} | Sold disponibil: {res_auth['balance']} RON")
    assert res_auth["status"] == "SUCCESS", "Eșec interogare sold autorizat"

    # 3. Interogare Sold Respinsă (Atacator din VLAN 30 / Lab IP 192.168.30.150)
    print("\n[TEST 3] Blocare Tentativă Acces din VLAN Neautorizat (192.168.30.150)...")
    res_blocked = cb.get_account_balance(
        iban=acc1["iban"],
        client_ip="192.168.30.150",
        role="TELLER",
        auth_token="TELLER_JWT_SECRET_FEAA_2026"
    )
    print(f"Răspuns: {res_blocked['status']} | Motiv blocare: {res_blocked['error']}")
    assert res_blocked["status"] == "FORBIDDEN", "Eșec blocare acces din subnet nepermis"

    # 4. Tranzacție în Partidă Dublă (Debit acc1, Credit acc2)
    print("\n[TEST 4] Execuție Înregistrare în Partidă Dublă (Transfer 1250 RON)...")
    tx = cb.post_double_entry_transaction(
        source_iban=acc1["iban"],
        dest_iban=acc2["iban"],
        amount=1250.00,
        narrative="Plată chirie lunară",
        operator_id="TELLER_01",
        client_ip="192.168.20.10"
    )
    print(f"TxID: {tx['tx_id']} | Suma: {tx['amount']} RON | EntryHash: {tx['entry_hash'][:16]}...")
    assert ACCOUNTS_DB[acc1["iban"]]["balance"] == 3750.00
    assert ACCOUNTS_DB[acc2["iban"]]["balance"] == 1350.00

    # 5. Verificare Integritate Lanț Criptografic (Audit Trail)
    print("\n[TEST 5] Audit Matematic al Integrității Cărții Mari (General Ledger)...")
    valid, entries_checked, msg = cb.verify_ledger_integrity()
    print(f"Rezultat Audit: {msg} | Tranzacții verificate: {entries_checked}")
    assert valid is True, "Eșec verificare integritate registru contabil"

    print("\n" + "=" * 80)
    print("TOATE TESTELE MOTORULUI DE CORE-BANKING AU FOST VALIDATE CU SUCCES.")
    print("=" * 80)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--serve":
        if app is not None:
            import uvicorn
            print("Pornire Core-Banking System pe 0.0.0.0:8080...")
            uvicorn.run(app, host="0.0.0.0", port=8080)
        else:
            print("FastAPI / Uvicorn nu sunt instalate. Rulați: pip install fastapi uvicorn")
            sys.exit(1)
    else:
        run_cli_self_test()

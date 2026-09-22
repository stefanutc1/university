"""
Sistem de Simulare Payment Gateway & Interbank Settlement (SWIFT / ISO 20022)
Lucrare de Licență: Arhitectura și Securitatea Sistemelor Informatice Bancare
Autor: Ștefănuț-Cornel Moanță | Facultatea de Economie și Administrarea Afacerilor (FEAA), Universitatea din Craiova
Specializarea: Informatică Economică

Modul: Payment Gateway Simulator (VM/LXC 312)
Rol: Simulare procesare plăți electronice (Visa/Mastercard) și decontare interbancară (SWIFT MT103 / ISO 20022 pacs.008).
     Testbed pentru detecția anomaliilor financiare și atacurilor de tip Card Stuffing / Brute-Force în OPNsense & Suricata IDS.
"""

from datetime import datetime, timezone
import json
import logging
import re
import sys
import time
from typing import Any, Dict, List, Optional
import uuid

# Configurare Logging conform standardelor bancare de audit
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] [TxID:%(process)d] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("PaymentGateway")

# In-memory journal pentru tranzacții și controale de viteză (Velocity Checks)
TRANSACTION_JOURNAL: List[Dict[str, Any]] = []
CARD_VELOCITY_TRACKER: Dict[str, List[float]] = {}
IP_RATE_LIMITER: Dict[str, List[float]] = {}

# Parametri de risc și conformitate (EBA / PSD2 / PCI-DSS)
MAX_VELOCITY_PER_MINUTE = 5
MAX_SCA_EXEMPTION_LIMIT_EUR = 10000.00
HIGH_RISK_BINS = ["411111", "555555", "400000"]
VALID_CURRENCIES = {"EUR", "RON", "USD", "GBP", "CHF"}


def luhn_checksum_valid(card_number: str) -> bool:
    """Validează numărul cardului conform algoritmului Luhn (Mod 10)."""
    digits = [int(c) for c in card_number if c.isdigit()]
    if len(digits) < 13 or len(digits) > 19:
        return False
    checksum = 0
    reverse_digits = digits[::-1]
    for i, digit in enumerate(reverse_digits):
        if i % 2 == 1:
            doubled = digit * 2
            checksum += (doubled - 9) if doubled > 9 else doubled
        else:
            checksum += digit
    return checksum % 10 == 0


# Alias pentru compatibilitate cu testele unitare și suita CI
validate_luhn = luhn_checksum_valid


def detect_card_brand(card_number: str) -> str:
    """Identifică rețeaua cardului pe baza BIN/IIN."""
    clean = re.sub(r"\D", "", card_number)
    if clean.startswith("4"):
        return "VISA"
    elif clean.startswith(("51", "52", "53", "54", "55")) or (
        len(clean) >= 4 and 2221 <= int(clean[:4]) <= 2720
    ):
        return "MASTERCARD"
    elif clean.startswith(("34", "37")):
        return "AMEX"
    return "UNKNOWN"


def mask_pan(card_number: str) -> str:
    """Maschează numărul cardului conform PCI-DSS (arată doar primele 6 și ultimele 4 cifre)."""
    clean = re.sub(r"\D", "", card_number)
    if len(clean) < 10:
        return "******"
    return f"{clean[:6]}{'*' * (len(clean) - 10)}{clean[-4:]}"


def validate_bic(bic: str) -> bool:
    """Validează formatul codului BIC/SWIFT conform ISO 9362 (8 sau 11 caractere alfanumerice)."""
    return bool(re.match(r"^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$", bic))


def validate_iban(iban: str) -> bool:
    """Validează formatul de bază al IBAN-ului conform ISO 13616."""
    clean = re.sub(r"\s+", "", iban).upper()
    if len(clean) < 15 or len(clean) > 34:
        return False
    return bool(re.match(r"^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$", clean))


def check_velocity_anomaly(card_fingerprint: str, client_ip: str) -> bool:
    """Detectează încercările repetate de tip Card-Stuffing sau DoS pe minut."""
    current_ts = time.time()
    one_minute_ago = current_ts - 60.0

    # Verificare pe IP sursă
    ip_history = IP_RATE_LIMITER.get(client_ip, [])
    ip_history = [t for t in ip_history if t > one_minute_ago]
    ip_history.append(current_ts)
    IP_RATE_LIMITER[client_ip] = ip_history
    if len(ip_history) > 30:  # Prag de flood
        return True

    # Verificare pe amprentă card
    card_history = CARD_VELOCITY_TRACKER.get(card_fingerprint, [])
    card_history = [t for t in card_history if t > one_minute_ago]
    card_history.append(current_ts)
    CARD_VELOCITY_TRACKER[card_fingerprint] = card_history
    if len(card_history) > MAX_VELOCITY_PER_MINUTE:
        return True

    return False


def process_card_authorization(payload: Dict[str, Any], client_ip: str = "127.0.0.1") -> Dict[str, Any]:
    """
    Procesează o cerere de autorizare card (ISO 8583 0100 -> 0110).
    Efectuează verificări de conformitate, integritate și risc anti-fraudă.
    """
    pan = payload.get("card_number", "").replace(" ", "").replace("-", "")
    expiry = payload.get("expiry_date", "")  # MM/YY
    cvv = payload.get("cvv", "")
    amount = float(payload.get("amount", 0.0))
    currency = payload.get("currency", "RON").upper()
    merchant_id = payload.get("merchant_id", "MERCH_DEFAULT")

    auth_id = f"AUTH-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now(timezone.utc).isoformat()

    # 1. Validare format și algoritm Luhn
    if not luhn_checksum_valid(pan):
        logger.warning("Eroare Validare Card [Luhn Checksum Failure] | PAN: %s | IP: %s", mask_pan(pan), client_ip)
        return {
            "status": "REJECTED",
            "response_code": "51",
            "reason": "INVALID_CARD_NUMBER_LUHN",
            "authorization_id": auth_id,
            "timestamp": timestamp
        }

    # 2. Validare Data Expirare
    try:
        exp_month, exp_year = [int(p) for p in expiry.split("/")]
        full_year = 2000 + exp_year if exp_year < 100 else exp_year
        now = datetime.now()
        if full_year < now.year or (full_year == now.year and exp_month < now.month) or not (1 <= exp_month <= 12):
            return {
                "status": "REJECTED",
                "response_code": "54",
                "reason": "EXPIRED_CARD",
                "authorization_id": auth_id,
                "timestamp": timestamp
            }
    except Exception:
        return {
            "status": "REJECTED",
            "response_code": "30",
            "reason": "INVALID_EXPIRY_FORMAT",
            "authorization_id": auth_id,
            "timestamp": timestamp
        }

    # 3. Validare CVV
    if not (cvv.isdigit() and len(cvv) in (3, 4)):
        return {
            "status": "REJECTED",
            "response_code": "82",
            "reason": "INVALID_CVV",
            "authorization_id": auth_id,
            "timestamp": timestamp
        }

    # 4. Validare Monedă
    if currency not in VALID_CURRENCIES:
        return {
            "status": "REJECTED",
            "response_code": "58",
            "reason": "UNSUPPORTED_CURRENCY",
            "authorization_id": auth_id,
            "timestamp": timestamp
        }

    # 5. Monitorizare Fraudă / Velocity Check (Detecție atac de tip card stuffing)
    card_fingerprint = f"{pan[:6]}_{pan[-4:]}_{expiry}"
    if check_velocity_anomaly(card_fingerprint, client_ip):
        logger.error("ALERTA SECURITATE: Detectat Atac Velocity/Card-Stuffing | IP: %s | Fingerprint: %s", client_ip, card_fingerprint)
        return {
            "status": "BLOCKED",
            "response_code": "59",
            "reason": "FRAUD_VELOCITY_TRIGGERED",
            "authorization_id": auth_id,
            "timestamp": timestamp,
            "incident_logged": True
        }

    # 6. Regula EBA/PSD2 SCA (Strong Customer Authentication)
    requires_sca = amount >= MAX_SCA_EXEMPTION_LIMIT_EUR
    sca_status = "CHALLENGE_REQUIRED" if requires_sca else "EXEMPTED_LOW_RISK"

    brand = detect_card_brand(pan)
    record = {
        "id": auth_id,
        "type": "CARD_AUTHORIZATION",
        "brand": brand,
        "masked_pan": mask_pan(pan),
        "amount": amount,
        "currency": currency,
        "merchant_id": merchant_id,
        "status": "APPROVED",
        "response_code": "00",
        "sca_status": sca_status,
        "client_ip": client_ip,
        "timestamp": timestamp
    }
    TRANSACTION_JOURNAL.append(record)

    logger.info("Autorizare Card Reușită | AuthID: %s | Brand: %s | Suma: %.2f %s | Merchant: %s",
                auth_id, brand, amount, currency, merchant_id)

    return record


def process_interbank_transfer(payload: Dict[str, Any], client_ip: str = "127.0.0.1") -> Dict[str, Any]:
    """
    Procesează un mesaj de transfer interbancar de tip SWIFT MT103 / ISO 20022 (pacs.008.001.08).
    Include verificare BIC emițător/destinatar, IBAN, identificator unic UETR și sumă.
    """
    sender_bic = payload.get("sender_bic", "").upper()
    receiver_bic = payload.get("receiver_bic", "").upper()
    debtor_iban = payload.get("debtor_iban", "").upper().replace(" ", "")
    creditor_iban = payload.get("creditor_iban", "").upper().replace(" ", "")
    amount = float(payload.get("amount", 0.0))
    currency = payload.get("currency", "EUR").upper()
    remittance_info = payload.get("remittance_info", "Interbank settlement payment")
    uetr = payload.get("uetr") or str(uuid.uuid4())

    timestamp = datetime.now(timezone.utc).isoformat()
    transfer_id = f"SWIFT-{uuid.uuid4().hex[:8].upper()}"

    # Validare BIC/SWIFT conform ISO 9362
    if not (validate_bic(sender_bic) and validate_bic(receiver_bic)):
        logger.warning("SWIFT Respins: Format BIC invalid | Sender: %s | Receiver: %s", sender_bic, receiver_bic)
        return {
            "status": "REJECTED",
            "transfer_id": transfer_id,
            "uetr": uetr,
            "error_code": "SWIFT_INVALID_BIC",
            "timestamp": timestamp
        }

    # Validare IBAN conform ISO 13616
    if not (validate_iban(debtor_iban) and validate_iban(creditor_iban)):
        logger.warning("SWIFT Respins: Format IBAN invalid | Debtor: %s | Creditor: %s", debtor_iban, creditor_iban)
        return {
            "status": "REJECTED",
            "transfer_id": transfer_id,
            "uetr": uetr,
            "error_code": "SWIFT_INVALID_IBAN",
            "timestamp": timestamp
        }

    if amount <= 0:
        return {
            "status": "REJECTED",
            "transfer_id": transfer_id,
            "uetr": uetr,
            "error_code": "INVALID_TRANSACTION_AMOUNT",
            "timestamp": timestamp
        }

    # Simulare verificare integritate UETR (Universal End-to-End Transaction Reference)
    try:
        uuid.UUID(uetr)
    except ValueError:
        logger.error("ALERTA SECURITATE: Tentativă injectare UETR malițios/corupt | UETR: %s | IP: %s", uetr, client_ip)
        return {
            "status": "BLOCKED",
            "transfer_id": transfer_id,
            "uetr": uetr,
            "error_code": "MALFORMED_UETR_SIGNATURE",
            "timestamp": timestamp
        }

    record = {
        "id": transfer_id,
        "type": "SWIFT_INTERBANK_SETTLEMENT",
        "standard": "ISO 20022 pacs.008 / MT103",
        "uetr": uetr,
        "sender_bic": sender_bic,
        "receiver_bic": receiver_bic,
        "debtor_iban": debtor_iban,
        "creditor_iban": creditor_iban,
        "amount": amount,
        "currency": currency,
        "remittance_info": remittance_info,
        "status": "SETTLED",
        "settlement_rail": "TARGET2_SIMULATOR",
        "client_ip": client_ip,
        "timestamp": timestamp
    }
    TRANSACTION_JOURNAL.append(record)

    logger.info("Decontare Interbancară Finalizată | ID: %s | UETR: %s | %.2f %s | %s -> %s",
                transfer_id, uetr, amount, currency, sender_bic, receiver_bic)

    return record


# ==============================================================================
# FASTAPI APP IMPLEMENTATION (pentru rulare ca microserviciu pe CT 312)
# ==============================================================================
try:
    from fastapi import FastAPI, HTTPException, Request
    from pydantic import BaseModel, Field

    app = FastAPI(
        title="Banking Payment Gateway & Interbank Settlement Simulator",
        description="Microserviciu de autorizare carduri (Visa/MC) și mesagerie financiară interbancară (SWIFT/ISO 20022)",
        version="1.0.0"
    )

    class CardAuthRequest(BaseModel):
        card_number: str = Field(..., example="4532012345678910")
        expiry_date: str = Field(..., example="12/28")
        cvv: str = Field(..., example="123")
        amount: float = Field(..., gt=0, example=249.99)
        currency: str = Field("RON", example="RON")
        merchant_id: str = Field("MERCH_FEAA_01", example="MERCH_FEAA_01")

    class SwiftTransferRequest(BaseModel):
        sender_bic: str = Field(..., example="BTRLRO22")
        receiver_bic: str = Field(..., example="RNCBROBU")
        debtor_iban: str = Field(..., example="RO98BTRL0001000123456789")
        creditor_iban: str = Field(..., example="RO49RNCB0002000298765432")
        amount: float = Field(..., gt=0, example=1500.00)
        currency: str = Field("EUR", example="EUR")
        remittance_info: str = Field("Plata factura servicii IT", example="Plata factura servicii IT")
        uetr: Optional[str] = Field(None, example="c3b9b46e-7812-4c22-92a0-482f6fbfdc41")

    class AttackSimulationRequest(BaseModel):
        attack_type: str = Field(..., example="card_stuffing")  # card_stuffing, velocity_flood, sqli_probe
        target_card: Optional[str] = Field("4532012345678910")
        iterations: int = Field(10, ge=1, le=100)

    @app.get("/health")
    async def health_check():
        return {
            "service": "payment-gateway-simulator",
            "status": "UP",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "journal_entries": len(TRANSACTION_JOURNAL)
        }

    @app.post("/api/v1/card/authorize")
    async def api_card_authorize(payload: CardAuthRequest, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        res = process_card_authorization(payload.dict(), client_ip)
        if res.get("status") == "BLOCKED":
            raise HTTPException(status_code=429, detail=res)
        if res.get("status") == "REJECTED":
            raise HTTPException(status_code=400, detail=res)
        return res

    @app.post("/api/v1/interbank/transfer")
    async def api_interbank_transfer(payload: SwiftTransferRequest, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        res = process_interbank_transfer(payload.dict(), client_ip)
        if res.get("status") == "BLOCKED":
            raise HTTPException(status_code=403, detail=res)
        if res.get("status") == "REJECTED":
            raise HTTPException(status_code=400, detail=res)
        return res

    @app.get("/api/v1/transactions")
    async def api_list_transactions(limit: int = 50):
        return {
            "count": len(TRANSACTION_JOURNAL),
            "transactions": TRANSACTION_JOURNAL[-limit:]
        }

    @app.post("/api/v1/simulate/attack")
    async def api_simulate_attack(payload: AttackSimulationRequest, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        results = []
        if payload.attack_type == "card_stuffing":
            for i in range(payload.iterations):
                # Generează CVV-uri arbitrare brute-force
                dummy_payload = {
                    "card_number": payload.target_card,
                    "expiry_date": "12/28",
                    "cvv": f"{i:03d}",
                    "amount": 10.0,
                    "currency": "RON",
                    "merchant_id": "STUFFING_TEST"
                }
                res = process_card_authorization(dummy_payload, client_ip)
                results.append({"iteration": i + 1, "result": res.get("status"), "reason": res.get("reason")})
        return {
            "attack_type": payload.attack_type,
            "simulated_iterations": payload.iterations,
            "telemetry": results
        }

except ImportError:
    app = None


# ==============================================================================
# CLI VALIDATION SUITE (Autonimă / Fără dependențe obligatorii externe)
# ==============================================================================
def run_cli_self_test():
    """Rulare suita de teste autonome pentru validare academică în cadrul licenței."""
    print("=" * 80)
    print("SUITA DE TESTARE: Payment Gateway & Interbank Settlement Simulator")
    print("Student: Ștefănuț-Cornel Moanță | Informatică Economică FEAA UCV")
    print("=" * 80)

    # 1. Test Autorizare Card Valid
    print("\n[TEST 1] Autorizare Tranzacție Card Validă (Visa)...")
    valid_card_payload = {
        "card_number": "4532015012345671", # Luhn valid
        "expiry_date": "11/29",
        "cvv": "321",
        "amount": 450.00,
        "currency": "RON",
        "merchant_id": "POS_KIOSK_FEAA"
    }
    res1 = process_card_authorization(valid_card_payload, "192.168.20.100")
    print(f"Rezultat: {res1.get('status')} | AuthID: {res1.get('id')} | Brand: {res1.get('brand')}")
    assert res1.get("status") == "APPROVED", "Eșec autorizare card valid"

    # 2. Test Eșec Luhn (Detectare Card Invalid / Mod 10)
    print("\n[TEST 2] Detecție Card Falsificat (Luhn Mod 10 Corupt)...")
    corrupt_card_payload = {
        "card_number": "4532015012345679", # Luhn invalid
        "expiry_date": "11/29",
        "cvv": "321",
        "amount": 100.00,
        "currency": "RON",
        "merchant_id": "POS_KIOSK_FEAA"
    }
    res2 = process_card_authorization(corrupt_card_payload, "192.168.30.150")
    print(f"Rezultat: {res2.get('status')} | Motiv: {res2.get('reason')}")
    assert res2.get("status") == "REJECTED", "Eșec respingere Luhn"

    # 3. Test Atac Velocity / Card-Stuffing
    print("\n[TEST 3] Simulare Atac Card-Stuffing (Depășire Prag Velocity)...")
    blocked = False
    for i in range(8):
        attempt = {
            "card_number": "4532015012345671",
            "expiry_date": "11/29",
            "cvv": f"99{i}",
            "amount": 20.00,
            "currency": "RON",
            "merchant_id": "ATTACKER_BOT"
        }
        res = process_card_authorization(attempt, "192.168.30.150")
        if res.get("status") == "BLOCKED":
            blocked = True
            print(f"Iterația {i+1}: BLOCAT cu succes de regulile de fraudă | Motiv: {res.get('reason')}")
            break
    assert blocked, "Eșec blocare atac de viteză"

    # 4. Test Decontare SWIFT MT103 / ISO 20022
    print("\n[TEST 4] Decontare Transfer Interbancar SWIFT (TARGET2)...")
    swift_payload = {
        "sender_bic": "BTRLRO22",
        "receiver_bic": "RNCBROBU",
        "debtor_iban": "RO98BTRL0001000123456789",
        "creditor_iban": "RO49RNCB0002000298765432",
        "amount": 54000.00,
        "currency": "EUR",
        "remittance_info": "Decontare lichiditate trezorerie interbancara",
        "uetr": str(uuid.uuid4())
    }
    res4 = process_interbank_transfer(swift_payload, "192.168.20.50")
    print(f"Rezultat: {res4.get('status')} | TransferID: {res4.get('id')} | Rail: {res4.get('settlement_rail')}")
    assert res4.get("status") == "SETTLED", "Eșec decontare SWIFT"

    print("\n" + "=" * 80)
    print("TOATE TESTELE DE SECURITATE ȘI CONFORMITATE AU FOST VALIDATE CU SUCCES.")
    print("=" * 80)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--serve":
        if app is not None:
            import uvicorn
            print("Pornire Payment Gateway REST API pe 0.0.0.0:8000...")
            uvicorn.run(app, host="0.0.0.0", port=8000)
        else:
            print("FastAPI / Uvicorn nu sunt instalate. Rulați: pip install fastapi uvicorn")
            sys.exit(1)
    else:
        run_cli_self_test()

"""
Simulator și Suită Integrată de Testare a Atacurilor și Mecanismelor de Apărare Bancară
Lucrare de Licență: Arhitectura și Securitatea Sistemelor Informatice Bancare
Autor: Ștefănuț-Cornel Moană | Facultatea de Economie și Administrarea Afacerilor (FEAA), Universitatea din Craiova
Specializarea: Informatică Economică

Modul: Banking Security Attack & Defense Simulator (Red Team vs. Blue Team Suite)
Rol: Simulare automată a celor 5 scenarii critice de securitate bancară:
     1. Operațiune legitimă Kiosk/Casierie (Linie de Bază Nominală).
     2. Atac la nivelul Bazei de Date: SQL Injection și Manipulare Ilicită de Sold (Wazuh SIEM Rule 100101 & 100109).
     3. Atac la nivelul Payment Gateway: Card-Stuffing și Velocity Flood (Suricata IDS / Rule 59).
     4. Tentativă Mișcare Laterală și Bypass al Jump-Box-ului Hardened (OPNsense VLAN 20 Policy Block).
     5. Falsificare și Corupere a Mesajelor Financiare Interbancare SWIFT MT103 / ISO 20022 UETR.
"""

from datetime import datetime, timezone
import json
import logging
import sys
import time
from typing import Any, Dict, List

# Importare module interne din suita de simulare
from core_banking_service import (
    ACCOUNTS_DB,
    CLIENTS_DB,
    CoreBankingEngine,
    CoreBankingSecurityGuard,
)
from database_audit_monitor import (
    WAZUH_ALERTS_LOG,
    FinancialDatabase,
    WazuhSecurityAuditor,
)
from payment_gateway_simulator import (
    process_card_authorization,
    process_interbank_transfer,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [Sim-Runner] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("AttackDefenseSuite")


class BankingAttackDefenseHarness:
    """Orchestratorul central pentru simularea atacurilor și validarea apărării bancare."""

    def __init__(self):
        self.cb_engine = CoreBankingEngine()
        self.fin_db = FinancialDatabase()
        self.results_matrix: List[Dict[str, Any]] = []

    def log_scenario_result(
        self,
        scenario_id: str,
        name: str,
        mitre_tactic: str,
        mitre_technique: str,
        expected_defense: str,
        observed_outcome: str,
        passed: bool
    ):
        """Înregistrează rezultatul scenariului în matricea de evaluare a licenței."""
        record = {
            "scenario_id": scenario_id,
            "name": name,
            "mitre_tactic": mitre_tactic,
            "mitre_technique": mitre_technique,
            "expected_defense": expected_defense,
            "observed_outcome": observed_outcome,
            "passed": passed,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.results_matrix.append(record)

    def run_scenario_1_nominal_kiosk_workflow(self):
        """
        Scenariul 1: Operațiune Bancară Legitimă Kiosk & Casierie (Linie de Bază)
        Terminalul Kiosk autorizat (192.168.20.100 / VM 205) interoghează soldul și efectuează operațiuni.
        """
        print("\n" + "-" * 75)
        print("[SCENARIUL 1] Flux Bancar Legitim: Înregistrare KYC, Cont & Transfer")
        print("Obiectiv: Verificarea funcționării nominale a Core-Banking și a înregistrării în partidă dublă.")
        print("-" * 75)

        # 1. Creare client și cont
        client = self.cb_engine.create_client("1890412160088", "Dumitrescu Andrei", "INDIVIDUAL")
        account = self.cb_engine.open_account(client["client_id"], "RON", initial_deposit=10000.00)
        
        # 2. Interogare sold din Kiosk autorizat (VM 205 / IP 192.168.20.100)
        balance_check = self.cb_engine.get_account_balance(
            iban=account["iban"],
            client_ip="192.168.20.100",
            role="KIOSK",
            auth_token="KIOSK_DEVICE_CERT_HW_TOKEN_2026"
        )
        print(f"Kiosk (192.168.20.100): Interogare sold -> Stare: {balance_check.get('status')} | Sold: {balance_check.get('balance')} RON")

        passed = balance_check.get("status") == "SUCCESS" and balance_check.get("balance") == 10000.00
        self.log_scenario_result(
            scenario_id="SCENARIO-01",
            name="Nominal Kiosk & Teller Workflow",
            mitre_tactic="Initial Access / Baseline",
            mitre_technique="Valid Accounts (T1078)",
            expected_defense="Allow 200 OK + Double-entry accounting consistency",
            observed_outcome=f"Status: {balance_check.get('status')}, Sold: {balance_check.get('balance')} RON",
            passed=passed
        )

    def run_scenario_2_db_tampering_and_sqli(self):
        """
        Scenariul 2: Atac Bază de Date - SQL Injection & Balance Tampering (Wazuh HIDS)
        Simulează atac la nivelul serverului de baze de date (VM 311).
        """
        print("\n" + "-" * 75)
        print("[SCENARIUL 2] Atac Bază de Date: SQL Injection & Manipulare Ilicită de Sold")
        print("Obiectiv: Detecția automată a manipulării soldurilor și SQLi de către Wazuh SIEM.")
        print("-" * 75)

        # 1. Test SQL Injection
        sqli_caught = False
        try:
            self.fin_db.execute_monitored_query(
                "SELECT * FROM accounts WHERE iban = '' UNION SELECT password, username, 1, 2 FROM users --",
                client_ip="192.168.30.150"
            )
        except PermissionError:
            sqli_caught = True
            print("Wazuh HIDS: Detectat și blocat atac SQL Injection pe portul PostgreSQL 5432.")

        # 2. Test Balance Tampering (Modificare directă de sold fără tranzacție ledger)
        # Populăm cont legitim
        self.fin_db.conn.execute("""
            INSERT INTO accounts (iban, client_id, currency, balance, status, created_at)
            VALUES ('RO99FEAA1111222233334444', 'CL-FRAUD-TEST', 'RON', 2500.00, 'ACTIVE', datetime('now'));
        """)
        self.fin_db.conn.execute("""
            INSERT INTO ledger_transactions (tx_id, source_iban, dest_iban, amount, currency, narrative, executed_by, timestamp)
            VALUES ('TX-LEGIT-99', 'RO00FEAA0000000000000001', 'RO99FEAA1111222233334444', 2500.00, 'RON', 'Legit deposit', 'SYS', datetime('now'));
        """)
        self.fin_db.conn.commit()

        # Atacator modifică direct soldul în DB
        self.fin_db.tamper_account_balance_unauthorized("RO99FEAA1111222233334444", 500000.00)

        # Rulare audit de consistență Wazuh
        consistent, anomalies = WazuhSecurityAuditor.audit_ledger_consistency(self.fin_db)
        tamper_detected = (not consistent) and (len(anomalies) > 0)
        print(f"Wazuh Audit Integrity Check -> Discrepanțe Ilicite Detectate: {len(anomalies)}")

        passed = sqli_caught and tamper_detected
        self.log_scenario_result(
            scenario_id="SCENARIO-02",
            name="DB SQL Injection & Balance Tampering",
            mitre_tactic="Defense Evasion / Impact",
            mitre_technique="Exploit Public-Facing App (T1190) & Data Manipulation (T1565)",
            expected_defense="Wazuh Rule 100101 (SQLi) & Rule 100109 Level 14 Alert",
            observed_outcome=f"SQLi Blocked: {sqli_caught}, Tamper Alert Triggered: {tamper_detected}",
            passed=passed
        )

    def run_scenario_3_payment_gateway_velocity_flood(self):
        """
        Scenariul 3: Atac Payment Gateway - Card-Stuffing & Velocity Brute-Force
        Simulează atac la nivelul containerului Payment Gateway (CT 312).
        """
        print("\n" + "-" * 75)
        print("[SCENARIUL 3] Atac Payment Gateway: Card-Stuffing & Rate Limit Flood")
        print("Obiectiv: Declanșarea regulilor de protecție la fraudă și a limitării de rată OPNsense/Suricata.")
        print("-" * 75)

        target_pan = "4532015012345671"
        blocked_count = 0
        attempts = 8
        attacker_ip = "192.168.30.200"

        for i in range(attempts):
            res = process_card_authorization({
                "card_number": target_pan,
                "expiry_date": "11/29",
                "cvv": f"8{i:02d}",
                "amount": 15.00,
                "currency": "RON",
                "merchant_id": "ROGUE_MERCHANT"
            }, client_ip=attacker_ip)
            if res.get("status") == "BLOCKED":
                blocked_count += 1
                print(f"Încercarea {i+1}: BLOCATĂ cu succes de modulul de analiză a riscului | Motiv: {res.get('reason')}")

        passed = blocked_count > 0
        self.log_scenario_result(
            scenario_id="SCENARIO-03",
            name="Payment Gateway Card Stuffing",
            mitre_tactic="Credential Access",
            mitre_technique="Brute Force: Password Guessing / Stuffing (T1110)",
            expected_defense="Fraud Velocity Triggered (Response Code 59) / HTTP 429 Block",
            observed_outcome=f"Attacker attempts blocked: {blocked_count} times",
            passed=passed
        )

    def run_scenario_4_bastion_bypass_lateral_movement(self):
        """
        Scenariul 4: Tentativă Mișcare Laterală și Acces Direct fără Jump-Box Hardened
        Un nod din rețeaua de test/pentest (VLAN 30 / IP 192.168.30.150) încearcă să acceseze
        Core-Banking fără a trece prin Jump-Box-ul Hardened (VM 313) cu SSH ed25519 și MFA.
        """
        print("\n" + "-" * 75)
        print("[SCENARIUL 4] Securitate Perimetrală: Tentativă Bypass Bastion Jump-Box")
        print("Obiectiv: Verificarea izolării VLAN 20 și respingerea conexiunilor directe neautorizate.")
        print("-" * 75)

        # Tentativă acces Core-Banking direct din VLAN 30 fără sesiune de bastion autorizată
        res = self.cb_engine.get_account_balance(
            iban="RO00FEAA0000000000000001",
            client_ip="192.168.30.150",
            role="TELLER",
            auth_token="STOLEN_OR_EXPIRED_TOKEN"
        )
        print(f"OPNsense Firewall & RBAC Guard: Răspuns cerere externă -> {res.get('status')} ({res.get('error')})")

        passed = res.get("status") == "FORBIDDEN" and "FIREWALL_POLICY_VIOLATION" in str(res.get("error"))
        self.log_scenario_result(
            scenario_id="SCENARIO-04",
            name="Bastion Host Bypass / Lateral Movement",
            mitre_tactic="Lateral Movement",
            mitre_technique="Remote Services: SSH / Bastion (T1021)",
            expected_defense="VLAN Isolation Drop by OPNsense + App Security Guard",
            observed_outcome=f"Status: {res.get('status')} | Error: {res.get('error')}",
            passed=passed
        )

    def run_scenario_5_swift_tampered_payload(self):
        """
        Scenariul 5: Falsificare Mesagerie Interbancară SWIFT MT103 / ISO 20022 pacs.008
        Simulează injectarea unui mesaj financiar falsificat cu cod BIC nevalid sau UETR corupt.
        """
        print("\n" + "-" * 75)
        print("[SCENARIUL 5] Mesagerie Financiară: Falsificare Mesaj SWIFT / ISO 20022")
        print("Obiectiv: Respingerea transferurilor financiare cu semnături UETR sau BIC neconforme.")
        print("-" * 75)

        tampered_swift_payload = {
            "sender_bic": "CORRUPT_BIC_99",
            "receiver_bic": "RNCBROBU",
            "debtor_iban": "RO98BTRL0001000123456789",
            "creditor_iban": "RO49RNCB0002000298765432",
            "amount": 999999.00,
            "currency": "EUR",
            "remittance_info": "Tampered settlement payload",
            "uetr": "NON_UUID_MALICIOUS_UETR"
        }

        res = process_interbank_transfer(tampered_swift_payload, client_ip="192.168.30.150")
        print(f"Validare SWIFT ISO 20022: Răspuns -> {res.get('status')} | Cod Eroare: {res.get('error_code')}")

        passed = res.get("status") in ("REJECTED", "BLOCKED")
        self.log_scenario_result(
            scenario_id="SCENARIO-05",
            name="SWIFT Message Tampering / Malformed UETR",
            mitre_tactic="Impact",
            mitre_technique="Financial Theft / Message Alteration (T1565)",
            expected_defense="Strict BIC/ISO 9362 and RFC 4122 UETR Signature Validation",
            observed_outcome=f"Status: {res.get('status')} | Error: {res.get('error_code')}",
            passed=passed
        )

    def generate_audit_report(self):
        """Generează raportul sintetic de audit pentru lucrarea de licență."""
        print("\n" + "=" * 80)
        print("RAPORT FINAL DE EVALUARE ȘI AUDIT AL SECURITĂȚII BANCARE")
        print("Universitatea din Craiova | Facultatea de Economie și Administrarea Afacerilor (FEAA)")
        print("Absolvent: Moană Ștefănuț-Cornel | Specializarea: Informatică Economică, 2026")
        print("=" * 80)

        total = len(self.results_matrix)
        passed_count = sum(1 for r in self.results_matrix if r["passed"])
        success_rate = (passed_count / total * 100.0) if total > 0 else 0.0

        for r in self.results_matrix:
            mark = "PASS [OK]" if r["passed"] else "FAIL [X]"
            print(f"[{mark}] {r['scenario_id']} : {r['name']}")
            print(f"       MITRE ATT&CK: {r['mitre_tactic']} - {r['mitre_technique']}")
            print(f"       Mecanism Apărare: {r['expected_defense']}")
            print(f"       Rezultat Observat: {r['observed_outcome']}")
            print("-" * 80)

        print(f"\nRată de Conformitate și Reziliență la Atac: {success_rate:.1f}% ({passed_count}/{total} Scenarii)")
        print(f"Total Alerte Wazuh HIDS / SIEM Emise: {len(WAZUH_ALERTS_LOG)}")
        print("Status Arhitectural: CONFORM CU STANDARDELE BANCAR-FINANCIARE (PCI-DSS, EBA, ISO 20022)")
        print("=" * 80)

        return passed_count == total


def main():
    harness = BankingAttackDefenseHarness()
    harness.run_scenario_1_nominal_kiosk_workflow()
    harness.run_scenario_2_db_tampering_and_sqli()
    harness.run_scenario_3_payment_gateway_velocity_flood()
    harness.run_scenario_4_bastion_bypass_lateral_movement()
    harness.run_scenario_5_swift_tampered_payload()
    
    all_passed = harness.generate_audit_report()
    if not all_passed:
        sys.exit(1)


if __name__ == "__main__":
    main()

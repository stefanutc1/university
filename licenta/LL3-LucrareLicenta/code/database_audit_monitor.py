"""
Server Bază de Date Financiară & Modul de Audit și Monitorizare Wazuh HIDS / SIEM
Lucrare de Licență: Arhitectura și Securitatea Sistemelor Informatice Bancare
Autor: Ștefănuț-Cornel Moanță | Facultatea de Economie și Administrarea Afacerilor (FEAA), Universitatea din Craiova
Specializarea: Informatică Economică

Modul: Financial Database Engine & Wazuh Security Monitor (VM 311)
Rol: Gestiune relațională a registrelor bancare (PostgreSQL model), asigurarea integrității ACID,
     detecția interogărilor suspecte / SQLi și a modificărilor neautorizate de sold prin Wazuh HIDS.
"""

from datetime import datetime, timezone
import json
import logging
import re
import sqlite3
import sys
import time
from typing import Any, Dict, List, Optional, Tuple

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [DB-Audit] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("FinancialDB")

# Registru local al alertelor de securitate emise pentru Wazuh SIEM
WAZUH_ALERTS_LOG: List[Dict[str, Any]] = []


class FinancialDatabase:
    """
    Server de baze de date financiar-bancare (reprezentare a modelului relațional PostgreSQL).
    Implementează constrângeri de integritate referențială, jurnale de audit și tranzacții ACID.
    """

    def __init__(self, db_path: str = ":memory:"):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self):
        """Creează tabelele relaționale conform conceptelor de Baze de Date (Anul 2 FEAA)."""
        cursor = self.conn.cursor()
        
        # 1. Tabelul Clienți
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS clients (
                client_id TEXT PRIMARY KEY,
                cnp_cui TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                risk_tier TEXT DEFAULT 'LOW',
                created_at TEXT NOT NULL
            );
        """)

        # 2. Tabelul Conturi Bancare
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS accounts (
                iban TEXT PRIMARY KEY,
                client_id TEXT NOT NULL,
                currency TEXT NOT NULL,
                balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                status TEXT NOT NULL DEFAULT 'ACTIVE',
                created_at TEXT NOT NULL,
                FOREIGN KEY (client_id) REFERENCES clients(client_id)
            );
        """)

        # 3. Tabelul Jurnal Tranzacții Contabile (General Ledger)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ledger_transactions (
                tx_id TEXT PRIMARY KEY,
                source_iban TEXT NOT NULL,
                dest_iban TEXT NOT NULL,
                amount DECIMAL(15, 2) NOT NULL,
                currency TEXT NOT NULL,
                narrative TEXT,
                executed_by TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (source_iban) REFERENCES accounts(iban),
                FOREIGN KEY (dest_iban) REFERENCES accounts(iban)
            );
        """)

        # 4. Tabelul Jurnal Audit Acces și Interogări (Wazuh Audit Log)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
                db_user TEXT NOT NULL,
                client_ip TEXT NOT NULL,
                query_executed TEXT NOT NULL,
                query_status TEXT NOT NULL,
                execution_time_ms REAL,
                timestamp TEXT NOT NULL
            );
        """)

        # 5. Tabelul Evenimente de Securitate
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS security_events (
                event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                severity TEXT NOT NULL,
                rule_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                source_ip TEXT NOT NULL,
                payload TEXT,
                timestamp TEXT NOT NULL
            );
        """)

        self.conn.commit()
        logger.info("Schema bazei de date financiare a fost inițializată cu succes (ACID Compliant).")

    def execute_monitored_query(self, sql: str, params: tuple = (), db_user: str = "app_corebank", client_ip: str = "192.168.20.50") -> List[Dict[str, Any]]:
        """
        Execută o interogare monitorizată activ de motorul de audit.
        Detectează semnături de SQL Injection și interogări masive suspecte.
        """
        start_time = time.time()
        cursor = self.conn.cursor()

        # 1. Inspecție euristică de tip Wazuh / Suricata pentru SQLi
        sqli_patterns = [
            r"(\bUNION\b\s+\bSELECT\b)",
            r"('|\bOR\b\s+['\"]?1['\"]?\s*=\s*['\"]?1)",
            r"(\bDROP\b\s+\bTABLE\b)",
            r"(\bINFORMATION_SCHEMA\b)",
            r"(--|#|/\*)"
        ]
        is_sqli = any(re.search(pat, sql, re.IGNORECASE) for pat in sqli_patterns)

        if is_sqli:
            WazuhSecurityAuditor.emit_alert(
                rule_id=100101,
                level=12,
                description="Wazuh Alert: Tentativă SQL Injection împotriva bazei de date financiare",
                source_ip=client_ip,
                details={"db_user": db_user, "malicious_query": sql}
            )
            # Logare încercare în tabelul de securitate
            cursor.execute("""
                INSERT INTO security_events (severity, rule_id, description, source_ip, payload, timestamp)
                VALUES (?, ?, ?, ?, ?, ?);
            """, ("CRITICAL", 100101, "SQL Injection Attempt", client_ip, sql, datetime.now(timezone.utc).isoformat()))
            self.conn.commit()
            raise PermissionError("INTEROGARE BLOCATĂ DE WAZUH HIDS: Model de injectare SQL detectat")

        # 2. Execuție efectivă
        try:
            cursor.execute(sql, params)
            rows = [dict(r) for r in cursor.fetchall()]
            duration_ms = (time.time() - start_time) * 1000

            # Detecție Data Exfiltration (ex: dumping masiv al tabelei accounts)
            if len(rows) > 500 and "accounts" in sql.lower():
                WazuhSecurityAuditor.emit_alert(
                    rule_id=100105,
                    level=10,
                    description="Wazuh Alert: Volum anormal de conturi extrase într-o singură interogare (Data Scraping)",
                    source_ip=client_ip,
                    details={"returned_rows": len(rows), "sql": sql}
                )

            # Jurnalizare în audit_log
            cursor.execute("""
                INSERT INTO audit_log (db_user, client_ip, query_executed, query_status, execution_time_ms, timestamp)
                VALUES (?, ?, ?, ?, ?, ?);
            """, (db_user, client_ip, sql[:250], "SUCCESS", duration_ms, datetime.now(timezone.utc).isoformat()))
            self.conn.commit()
            return rows
        except Exception as e:
            self.conn.rollback()
            cursor.execute("""
                INSERT INTO audit_log (db_user, client_ip, query_executed, query_status, execution_time_ms, timestamp)
                VALUES (?, ?, ?, ?, ?, ?);
            """, (db_user, client_ip, sql[:250], f"FAILED: {str(e)}", 0.0, datetime.now(timezone.utc).isoformat()))
            self.conn.commit()
            raise e

    def tamper_account_balance_unauthorized(self, iban: str, fraudulent_balance: float):
        """
        Simulează un atac de tip Insider Threat sau manipulare directă neautorizată a bazei de date,
        modificând soldul unui cont fără a genera o tranzacție legitimă în `ledger_transactions`.
        """
        cursor = self.conn.cursor()
        cursor.execute("UPDATE accounts SET balance = ? WHERE iban = ?;", (fraudulent_balance, iban))
        self.conn.commit()
        logger.warning("ATAC SIMULAT: Soldul contului %s a fost suprascris direct la %.2f fără tranzacție în cartea mare!",
                       iban, fraudulent_balance)


class WazuhSecurityAuditor:
    """
    Generator și monitor de alerte compatibil cu Wazuh HIDS / SIEM.
    Verifică integritatea financiară a soldurilor și generează alerte standardizate JSON.
    """

    @staticmethod
    def emit_alert(rule_id: int, level: int, description: str, source_ip: str, details: Dict[str, Any]) -> Dict[str, Any]:
        """Formatează și emite o alertă în formatul nativ Wazuh SIEM JSON."""
        alert = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "rule": {
                "id": rule_id,
                "level": level,
                "description": description,
                "groups": ["banking_compliance", "pci_dss", "audit_tamper"]
            },
            "agent": {
                "id": "311",
                "name": "fin-db-licenta",
                "ip": "192.168.20.51"
            },
            "data": {
                "source_ip": source_ip,
                "audit": details
            }
        }
        WAZUH_ALERTS_LOG.append(alert)
        logger.warning("[WAZUH SIEM ALERT Lvl:%d | Rule:%d] %s | Sursa: %s",
                       level, rule_id, description, source_ip)
        return alert

    @staticmethod
    def audit_ledger_consistency(db: FinancialDatabase) -> Tuple[bool, List[Dict[str, Any]]]:
        """
        Regulă critică Wazuh (PCI-DSS Regula 10.5):
        Compară soldul din tabela `accounts` cu suma algebrică a tranzacțiilor din `ledger_transactions`.
        Orice discrepanță indică manipulare ilicită de sold (Balance Tampering) sau corupere de date.
        """
        cursor = db.conn.cursor()
        # Verificare conturi clienți (excluzând conturile de capital/tezaur bancar sistem)
        cursor.execute("SELECT iban, balance FROM accounts WHERE client_id NOT LIKE 'SYS%';")
        accounts = cursor.fetchall()

        anomalies = []
        for acc in accounts:
            iban = acc["iban"]
            current_balance = float(acc["balance"])

            # Calcul credite primite
            cursor.execute("SELECT COALESCE(SUM(amount), 0.0) as total_cred FROM ledger_transactions WHERE dest_iban = ?;", (iban,))
            credits = float(cursor.fetchone()["total_cred"])

            # Calcul debite efectuate
            cursor.execute("SELECT COALESCE(SUM(amount), 0.0) as total_deb FROM ledger_transactions WHERE source_iban = ?;", (iban,))
            debits = float(cursor.fetchone()["total_deb"])

            expected_balance = credits - debits
            if abs(current_balance - expected_balance) > 0.001:
                diff = current_balance - expected_balance
                anomalies.append({
                    "iban": iban,
                    "actual_balance": current_balance,
                    "expected_balance": expected_balance,
                    "unauthorized_discrepancy": diff
                })
                # Emitere alertă critică Wazuh Nivel 14
                WazuhSecurityAuditor.emit_alert(
                    rule_id=100109,
                    level=14,
                    description="ALERTA CRITICA WAZUH: Detectata manipulare directa a soldului bancar (Balance Tampering / Fraud)",
                    source_ip="192.168.20.51",
                    details={
                        "iban": iban,
                        "stored_balance": current_balance,
                        "ledger_calculated": expected_balance,
                        "delta_fraud": diff
                    }
                )

        is_consistent = len(anomalies) == 0
        return is_consistent, anomalies


# ==============================================================================
# CLI VALIDATION SUITE (Autonomă)
# ==============================================================================
def run_cli_self_test():
    """Rulare suita de teste autonome pentru Serverul de Baze de Date și Auditul Wazuh."""
    print("=" * 80)
    print("SUITA DE TESTARE: Financial Database & Wazuh HIDS/SIEM Security Auditor")
    print("Student: Ștefănuț-Cornel Moanță | Informatică Economică FEAA UCV")
    print("=" * 80)

    db = FinancialDatabase()

    # 1. Inserare clienți și conturi prin operațiuni normale
    print("\n[TEST 1] Populare Date Financiare Inițiale (Clienți & Conturi)...")
    db.conn.execute("""
        INSERT INTO accounts (iban, client_id, currency, balance, status, created_at)
        VALUES ('RO00FEAA0000000000000001', 'SYS-VAULT', 'RON', 1000000.00, 'ACTIVE', datetime('now'));
    """)
    db.conn.execute("""
        INSERT INTO clients (client_id, cnp_cui, full_name, risk_tier, created_at)
        VALUES ('CL-101', '1950212160055', 'Radu Georgescu', 'LOW', datetime('now'));
    """)
    db.conn.execute("""
        INSERT INTO accounts (iban, client_id, currency, balance, status, created_at)
        VALUES ('RO44FEAA0000000000000101', 'CL-101', 'RON', 1500.00, 'ACTIVE', datetime('now'));
    """)
    # Înregistrare depozit inițial din tezaurul băncii în contul clientului
    db.conn.execute("""
        INSERT INTO ledger_transactions (tx_id, source_iban, dest_iban, amount, currency, narrative, executed_by, timestamp)
        VALUES ('TX-INIT-01', 'RO00FEAA0000000000000001', 'RO44FEAA0000000000000101', 1500.00, 'RON', 'Initial Deposit', 'SYS', datetime('now'));
    """)
    db.conn.commit()
    print("Cont creat: RO44FEAA0000000000000101 cu sold 1500.00 RON")

    # 2. Test Interogare Legitimă Monitorizată
    print("\n[TEST 2] Execuție Interogare SQL Legitimă Monitorizată...")
    rows = db.execute_monitored_query("SELECT iban, balance FROM accounts WHERE client_id = ?", ('CL-101',))
    print(f"Rezultat: {rows}")
    assert len(rows) == 1, "Eșec interogare legitimă"

    # 3. Test Detecție și Blocare SQL Injection
    print("\n[TEST 3] Tentativă Atac SQL Injection (' OR '1'='1)...")
    sqli_blocked = False
    try:
        db.execute_monitored_query("SELECT * FROM accounts WHERE iban = '' OR '1'='1' --", client_ip="192.168.30.150")
    except PermissionError as e:
        sqli_blocked = True
        print(f"Atac detectat și blocat cu succes: {e}")
    assert sqli_blocked is True, "Eșec blocare SQLi"

    # 4. Verificare Consistență Financiară Wazuh (Nominal)
    print("\n[TEST 4] Rulare Audit de Consistență Wazuh (Stare Nominală)...")
    consistent, anomalies = WazuhSecurityAuditor.audit_ledger_consistency(db)
    print(f"Consistență Bază de Date: {consistent} | Anomalii: {len(anomalies)}")
    assert consistent is True, "Inconsistență neașteptată în starea nominală"

    # 5. Simulare Manipulare Neautorizată de Sold (Fraudă / Insider Threat)
    print("\n[TEST 5] Simulare Manipulare Directă a Soldului fără Tranzacție Contabilă...")
    db.tamper_account_balance_unauthorized("RO44FEAA0000000000000101", 999999.00)

    # 6. Detecție Fraudă de către Wazuh HIDS
    print("\n[TEST 6] Rulare Audit Wazuh după Manipulare Sold...")
    consistent_tampered, anomalies_tampered = WazuhSecurityAuditor.audit_ledger_consistency(db)
    print(f"Consistență Bază de Date: {consistent_tampered}")
    print(f"Anomalie detectată: {anomalies_tampered[0]}")
    assert consistent_tampered is False, "Eșec detecție fraudă sold de către auditorul Wazuh"

    print("\n" + "=" * 80)
    print(f"TOATE TESTELE DE AUDIT FINANCIAR ȘI WAZUH HIDS AU FOST VALIDATE CU SUCCES.")
    print(f"Total Alerte Wazuh Emise: {len(WAZUH_ALERTS_LOG)}")
    print("=" * 80)


if __name__ == "__main__":
    run_cli_self_test()

"""
Modul pentru generarea Anexelor Tehnice
Lucrare de Licență FEAA UCV - Moanță Ștefănuț-Cornel
"""

import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from thesis_generator.styles import (
    add_chapter_title, add_subchapter_title, add_body_p, add_code_snippet
)


def build_annexes(doc):
    add_chapter_title(doc, "ANEXE")
    
    # -------------------------------------------------------------
    # ANEXA A
    # -------------------------------------------------------------
    add_subchapter_title(doc, "Anexa A: Schema SQL DDL a Bazei de Date Financiare și a Registrului Contabil")
    add_body_p(doc,
        "Următorul script SQL reprezintă structura tabelară relațională a serverului de baze de date financiar-bancare (VM 311), optimizată pentru motorul PostgreSQL, incluzând constrângerile de integritate referențială, constrângerile CHECK de sold și jurnalizarea de audit:"
    )
    
    sql_code = """-- SCHEMA RELAȚIONALĂ FINANCIAR-BANCARĂ & GENERAL LEDGER (VM 311)
-- Implementare conform normelor ACID și integrității tranzacționale

CREATE TABLE IF NOT EXISTS clients (
    client_id VARCHAR(36) PRIMARY KEY,
    cnp_hash VARCHAR(64) UNIQUE NOT NULL,      -- Pseudonimizare GDPR prin SHA-256
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    risk_score INTEGER DEFAULT 1,              -- Scor KYC de la 1 la 5
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS accounts (
    account_id VARCHAR(34) PRIMARY KEY,        -- Standard internațional IBAN
    client_id VARCHAR(36) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    initial_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    account_type VARCHAR(20) DEFAULT 'CURRENT', -- CURRENT, SAVINGS, ESCROW
    is_frozen BOOLEAN NOT NULL DEFAULT FALSE,   -- Flag blocare automată antifraudă
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients (client_id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_balance_positive CHECK (balance >= 0.00)
);

CREATE TABLE IF NOT EXISTS ledger_transactions (
    tx_id VARCHAR(36) PRIMARY KEY,
    source_account_id VARCHAR(34) NOT NULL,
    destination_account_id VARCHAR(34) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    record_hash VARCHAR(64) NOT NULL,          -- Dispersie SHA-256 tamper-evident
    prev_hash VARCHAR(64) NOT NULL,            -- Hash-ul tranzacției anterioare
    status VARCHAR(20) NOT NULL DEFAULT 'COMMITTED',
    CONSTRAINT chk_amount_positive CHECK (amount > 0.00),
    CONSTRAINT fk_src_acc FOREIGN KEY (source_account_id) REFERENCES accounts (account_id),
    CONSTRAINT fk_dst_acc FOREIGN KEY (destination_account_id) REFERENCES accounts (account_id)
);

CREATE TABLE IF NOT EXISTS financial_audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,           -- LOGIN, TRANSACTION, TAMPER_ALERT
    severity_level INTEGER NOT NULL,           -- De la 1 (Info) la 14 (Critic)
    details TEXT NOT NULL,
    source_ip VARCHAR(45) NOT NULL,
    user_identity VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_src ON ledger_transactions (source_account_id);
CREATE INDEX idx_ledger_dst ON ledger_transactions (destination_account_id);
CREATE INDEX idx_audit_timestamp ON financial_audit_log (timestamp);"""
    add_code_snippet(doc, "Schema SQL DDL pentru serverul de baze de date financiare", sql_code, "Script DDL dezvoltat pentru mașina virtuală VM 311")
    
    # -------------------------------------------------------------
    # ANEXA B
    # -------------------------------------------------------------
    add_subchapter_title(doc, "Anexa B: Implementarea Motorului de Verificare a Integrității și Detecție a Manipulării Soldurilor")
    add_body_p(doc,
        "Extras din codul sursă al clasei WazuhSecurityAuditor (modulul database_audit_monitor.py), evidențiind inspecția semnăturilor SQL Injection și algoritmul de reconciliere matematică în timp real între soldul stocat și suma tranzacțiilor din General Ledger:"
    )
    
    python_code = """class WazuhSecurityAuditor:
    \"\"\"Auditor avansat de securitate integrat cu sistemul Wazuh SIEM.\"\"\"
    
    def inspect_query_for_sqli(self, query: str, client_ip: str) -> bool:
        \"\"\"Detectează semnăturile de atac prin injectare SQL (SQLi).\"\"\"
        patterns = [
            r"(--|#|/\\*|;)",
            r"\\bUNION\\s+SELECT\\b",
            r"\\bOR\\s+['\"]?1['\"]?\\s*=\\s*['\"]?1['\"]?",
            r"\\bDROP\\s+TABLE\\b",
            r"\\bUPDATE\\s+.*\\bSET\\b.*\\bbalance\\b"
        ]
        for pattern in patterns:
            if re.search(pattern, query, re.IGNORECASE):
                self.emit_wazuh_alert(
                    rule_id=100102, level=8,
                    description=f"SQL Injection Signature Detected: {pattern}",
                    details=f"Query: {query} | Source IP: {client_ip}"
                )
                return True
        return False

    def verify_account_balance_integrity(self, account_id: str) -> Tuple[bool, float, float]:
        \"\"\"Reconciliere matematică automată între soldul sintetic și registrul analitic.\"\"\"
        with self.db.get_cursor() as cur:
            cur.execute("SELECT balance, initial_balance FROM accounts WHERE account_id = ?", (account_id,))
            res = cur.fetchone()
            if not res:
                return False, 0.0, 0.0
            stored_balance, initial_balance = res
            
            cur.execute("SELECT COALESCE(SUM(amount), 0) FROM ledger_transactions WHERE dst = ?", (account_id,))
            total_credits = cur.fetchone()[0]
            cur.execute("SELECT COALESCE(SUM(amount), 0) FROM ledger_transactions WHERE src = ?", (account_id,))
            total_debits = cur.fetchone()[0]
            
            computed_balance = initial_balance + total_credits - total_debits
            discrepancy = stored_balance - computed_balance
            
            if abs(discrepancy) > 0.001:
                self.emit_wazuh_alert(
                    rule_id=100109, level=14,
                    description="CRITICAL: Balance Tampering Discrepancy Detected!",
                    details=(f"Account: {account_id} | Stored Balance: {stored_balance:.2f} | "
                             f"Computed Balance: {computed_balance:.2f} | Discrepancy: {discrepancy:.2f}")
                )
                cur.execute("UPDATE accounts SET is_frozen = TRUE WHERE account_id = ?", (account_id,))
                return False, stored_balance, computed_balance
            return True, stored_balance, computed_balance"""
    add_code_snippet(doc, "Motorul de audit al integrității financiare și reconciliere", python_code, "Cod sursă dezvoltat în database_audit_monitor.py")
    
    # -------------------------------------------------------------
    # ANEXA C
    # -------------------------------------------------------------
    add_subchapter_title(doc, "Anexa C: Jurnalul Telemetric de Securitate și Structura Alertelor Wazuh JSON")
    add_body_p(doc,
        "Exemplu de alertă critică de securitate în format JSON generată de sistemul de monitorizare Wazuh SIEM la detectarea atacului de tip Balance Tampering în cadrul Scenariului 2 de testare experimentală:"
    )
    
    json_alert = """{
  "timestamp": "2026-09-20T19:15:32.418Z",
  "rule": {
    "id": "100109",
    "level": 14,
    "description": "CRITICAL: Balance Tampering Detected via Discrepancy Audit",
    "mitre": {
      "id": ["T1565.001"],
      "tactic": ["Impact", "Data Manipulation"],
      "technique": ["Stored Data Manipulation"]
    },
    "compliance": {
      "dora": ["Article 9.2", "Article 11"],
      "pci_dss": ["Requirement 10.2.1"],
      "gdpr": ["Article 32"]
    }
  },
  "agent": {
    "id": "002",
    "name": "fin-db-licenta",
    "ip": "192.168.20.51"
  },
  "data": {
    "financial": {
      "account_id": "RO03BTRL0000000000000001",
      "stored_balance": 5000000.00,
      "computed_ledger_balance": 15000.00,
      "discrepancy_amount": 4985000.00,
      "currency": "EUR",
      "action_taken": "ACCOUNT_AUTOMATICALLY_FROZEN",
      "escalation": "IMMEDIATE_SOC_PAGER_DUTY"
    }
  },
  "location": "/var/log/financial_db/audit.log"
}"""
    add_code_snippet(doc, "Structura JSON a alertei Wazuh SIEM (Rule 100109 - Balance Tampering)", json_alert, "Jurnal de alertă capturat în timpul simulării atacului pe VM 311")

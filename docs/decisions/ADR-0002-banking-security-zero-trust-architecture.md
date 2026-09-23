# ADR-0002: Zero-Trust Banking Core & SIEM Audit Telemetry

## Context
In the Bachelor's Thesis *"Arhitectura și Securitatea Sistemelor Informatice Bancare"*, the banking application must defend against targeted insider threats and automated attack scenarios (e.g. MITRE ATT&CK T1078 Valid Accounts, T1059 Command and Scripting Interpreter, T1565.001 Data Manipulation / Balance Tampering). Traditional boundary firewalls alone cannot protect core financial balances if an attacker gains valid credentials or database access.

## Decision
We implement a zero-trust, defense-in-depth architecture across the banking core:
1. **Stateless JWT with Cryptographic Signatures (HMAC-SHA256):** Every API request requires a verified bearer token with role claims (`CUSTOMER`, `TELLER`, `ADMIN`).
2. **Double-Entry Accounting Ledger (Pacioli 1494 / Fineract standard):** Money cannot be created or deleted arbitrarily. Every transaction consists of balanced debits and credits ($\sum \text{Debits} = \sum \text{Credits}$).
3. **Cryptographic SHA-256 Tamper-Evident Chaining:** Each ledger transaction record contains the cryptographic hash of the preceding record, making historical balance manipulation mathematically detectable.
4. **Structured JSON Telemetry Stream:** All security-relevant events (failed logins, threshold breaches, anomaly triggers) are formatted as structured JSON and piped to `/var/log/bank-app/security.log`, where the Wazuh HIDS agent generates SIEM alerts (Rule 100201).

## Alternatives Considered
* **Single-Table Mutable Account Balance (`UPDATE accounts SET balance = ...`):** Rejected because it violates PCI-DSS v4.0 Requirement 10 and cannot withstand database tampering.
* **Basic Session Cookie Authentication:** Rejected due to CSRF vulnerabilities in kiosk touch terminals.

## Consequences
* **Positive:** Proven resistance against balance tampering; instant detection of database-level unauthorized modifications; comprehensive forensic audit trail.
* **Negative:** Slightly higher compute overhead per transaction for hash chaining calculation.

## Status
Accepted and Implemented.

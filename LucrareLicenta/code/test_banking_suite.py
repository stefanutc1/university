"""
Test Suite automatizat Pytest pentru Suita de Securitate și Simulare Bancară LL3
Lucrare de Licență: Arhitectura și Securitatea Sistemelor Informatice Bancare
FEAA Craiova - Informatică Economică 2026
"""

import pytest
from banking_attack_simulator import BankingAttackDefenseHarness
from core_banking_service import CoreBankingEngine, CoreBankingSecurityGuard
from database_audit_monitor import FinancialDatabase, WazuhSecurityAuditor
from payment_gateway_simulator import validate_luhn, mask_pan, process_card_authorization, process_interbank_transfer


@pytest.fixture
def harness():
    return BankingAttackDefenseHarness()


@pytest.fixture
def cb_engine():
    CoreBankingEngine.reset_state()
    return CoreBankingEngine()


@pytest.fixture
def fin_db():
    return FinancialDatabase()


def test_scenario_1_nominal_kiosk_workflow(harness):
    """Verificare funcționare nominală: Kiosk autorizat (VLAN 20) și contabilitate în partidă dublă."""
    harness.run_scenario_1_nominal_kiosk_workflow()
    res = [r for r in harness.results_matrix if r["scenario_id"] == "SCENARIO-01"][0]
    assert res["passed"] is True
    assert "SUCCESS" in res["observed_outcome"]


def test_scenario_2_db_tampering_and_sqli(harness):
    """Verificare detecție SQL Injection și Balance Tampering de către Wazuh SIEM."""
    harness.run_scenario_2_db_tampering_and_sqli()
    res = [r for r in harness.results_matrix if r["scenario_id"] == "SCENARIO-02"][0]
    assert res["passed"] is True
    assert "SQLi Blocked: True" in res["observed_outcome"]
    assert "Tamper Alert Triggered: True" in res["observed_outcome"]


def test_scenario_3_payment_gateway_velocity_flood(harness):
    """Verificare filtrare anti-fraudă Card Stuffing (blocare cu prag de velocity)."""
    harness.run_scenario_3_payment_gateway_velocity_flood()
    res = [r for r in harness.results_matrix if r["scenario_id"] == "SCENARIO-03"][0]
    assert res["passed"] is True
    assert "blocked: 3 times" in res["observed_outcome"]


def test_scenario_4_bastion_bypass_lateral_movement(harness):
    """Verificare respingere conexiuni directe din VLAN neautorizat (izolare OPNsense & RBAC)."""
    harness.run_scenario_4_bastion_bypass_lateral_movement()
    res = [r for r in harness.results_matrix if r["scenario_id"] == "SCENARIO-04"][0]
    assert res["passed"] is True
    assert "FIREWALL_POLICY_VIOLATION_UNTRUSTED_SUBNET" in res["observed_outcome"]


def test_scenario_5_swift_tampered_payload(harness):
    """Verificare respingere mesaje SWIFT MT103 / ISO 20022 cu format BIC sau UETR neconform."""
    harness.run_scenario_5_swift_tampered_payload()
    res = [r for r in harness.results_matrix if r["scenario_id"] == "SCENARIO-05"][0]
    assert res["passed"] is True
    assert "SWIFT_INVALID_BIC" in res["observed_outcome"]


def test_luhn_algorithm_validation():
    """Test unitar pentru algoritmul matematic Luhn Mod 10 și mascarea PAN PCI-DSS."""
    valid_card = "4532015112835670"
    corrupt_card = "4532015112835679"
    assert validate_luhn(valid_card) is True
    assert validate_luhn(corrupt_card) is False
    masked = mask_pan(valid_card)
    assert masked == "453201******5670"


def test_double_entry_accounting_invariants(cb_engine):
    """Test unitar pentru garantarea principiului partidei duble: suma debitelor = suma creditelor."""
    client = cb_engine.create_client("1900101160011", "Test Client", "INDIVIDUAL")
    acc1 = cb_engine.open_account(client["client_id"], "RON", initial_deposit=5000.0)
    acc2 = cb_engine.open_account(client["client_id"], "RON", initial_deposit=1000.0)

    # Transfer între conturi
    tx = cb_engine.post_double_entry_transaction(
        source_iban=acc1["iban"],
        dest_iban=acc2["iban"],
        amount=1500.0,
        narrative="Transfer test unitar",
        operator_id="TELLER_TEST",
        client_ip="192.168.20.10"
    )
    assert tx["status"] == "SUCCESS"
    assert "tx_id" in tx

    # Audit matematic al General Ledger
    valid, entries_checked, msg = cb_engine.verify_ledger_integrity()
    assert valid is True
    assert entries_checked >= 1


def test_wazuh_sqli_detection_regex(fin_db):
    """Test unitar pentru detecția semnăturilor SQLi în auditorul Wazuh."""
    # Query legitim - executat cu succes
    res = fin_db.execute_monitored_query("SELECT * FROM accounts WHERE iban = 'RO123'", client_ip="192.168.20.10")
    assert isinstance(res, list)

    # Query malițios - detectat și blocat cu PermissionError
    with pytest.raises(PermissionError):
        fin_db.execute_monitored_query("SELECT * FROM accounts WHERE 1=1 OR 'a'='a'", client_ip="192.168.30.200")

    with pytest.raises(PermissionError):
        fin_db.execute_monitored_query("SELECT balance FROM accounts; DROP TABLE clients; --", client_ip="192.168.30.200")


if __name__ == "__main__":
    pytest.main(["-v", __file__])

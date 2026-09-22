#!/usr/bin/env python3
"""
Live Integration Smoke Test for Spring Boot Bank Kiosk Backend
Runs in CI to validate all critical REST endpoints before deployment.
"""

import json
import sys
import time
import urllib.request
import urllib.error


BASE_URL = "http://127.0.0.1:8080"


def wait_for_backend(timeout_seconds=60):
    """Așteaptă pornirea și inițializarea completă a backend-ului Spring Boot."""
    print(f"[SMOKE TEST] Aștept inițializarea backend-ului pe {BASE_URL} (timeout: {timeout_seconds}s)...")
    start = time.time()
    while time.time() - start < timeout_seconds:
        try:
            req = urllib.request.Request(f"{BASE_URL}/api/v1/audit/recent-logs")
            with urllib.request.urlopen(req, timeout=2) as resp:
                if resp.status == 200:
                    print(f"[SMOKE TEST] Backend activ și disponibil în {time.time() - start:.1f} secunde.")
                    return True
        except Exception:
            time.sleep(1.5)
    print("[EROARE CRITICĂ] Timeout la pornirea backend-ului Spring Boot.")
    return False


def run_smoke_tests():
    print("=" * 70)
    print("SUITA DE TESTARE INTEGRATĂ: REST API BACKEND & TELEMETRIE WAZUH")
    print("=" * 70)

    # 1. Login Authentication
    print("\n[STEP 1] Test Autentificare PIN Kiosk: POST /api/v1/auth/login")
    login_payload = json.dumps({"clientId": "K-1002", "pin": "8421"}).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/login",
        data=login_payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Status invalid: {resp.status}"
        data = json.loads(resp.read().decode("utf-8"))
        token = data.get("token")
        assert token, "Token JWT absent în răspunsul de autentificare."
        print(f"  -> Autentificare Reușită! Client: {data.get('holderName')} | Token JWT alocat (lungime: {len(token)} chars)")

    headers_auth = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    # 2. Balance Check
    print("\n[STEP 2] Test Interogare Sold: GET /api/v1/kiosk/balance")
    req = urllib.request.Request(f"{BASE_URL}/api/v1/kiosk/balance", headers=headers_auth)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        balance_data = json.loads(resp.read().decode("utf-8"))
        print(f"  -> Sold curent extras: {balance_data.get('currentBalance')} {balance_data.get('currency')} | IBAN: {balance_data.get('iban')}")

    # 3. Transfer Transaction
    print("\n[STEP 3] Test Transfer Bancar: POST /api/v1/kiosk/transfer")
    transfer_payload = json.dumps({
        "sourceIban": balance_data.get("iban"),
        "destinationIban": "RO99NXCR0002842100000002",
        "amount": 50.00,
        "description": "CI Smoke Test Transfer"
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/v1/kiosk/transfer",
        data=transfer_payload,
        headers=headers_auth
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        tx_data = json.loads(resp.read().decode("utf-8"))
        print(f"  -> Transfer procesat cu succes! TxID: {tx_data.get('transactionId')} | Nou sold: {tx_data.get('newBalance')}")

    # 4. Portal Overview
    print("\n[STEP 4] Test Portal Overview: GET /api/v1/portal/overview")
    req = urllib.request.Request(f"{BASE_URL}/api/v1/portal/overview", headers=headers_auth)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        portal_data = json.loads(resp.read().decode("utf-8"))
        print(f"  -> Overview validat: Client {portal_data.get('holderName')}, Tranzacții recente: {len(portal_data.get('recentTransactions', []))}")

    # 5. Security Anomaly Simulation
    print("\n[STEP 5] Test Simulare Anomalie Securitate: POST /api/v1/audit/simulate-anomaly")
    anomaly_payload = json.dumps({
        "anomalyType": "SMOKE_TEST_INJECTION",
        "details": "Verificare automată flux telemetrie în pipeline CI/CD",
        "triggerHttp500": False
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/v1/audit/simulate-anomaly",
        data=anomaly_payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        anomaly_res = json.loads(resp.read().decode("utf-8"))
        print(f"  -> Eveniment telemetric generat: {anomaly_res.get('status')} | Fișier țintă: {anomaly_res.get('wazuhTargetFile')}")

    print("\n" + "=" * 70)
    print("TOATE TESTELE SMOKE REST API AU TRECUT CU SUCCES (100% PASS)")
    print("=" * 70 + "\n")
    return True


if __name__ == "__main__":
    ready = wait_for_backend(timeout_seconds=60)
    if not ready:
        sys.exit(1)
    try:
        run_smoke_tests()
    except Exception as e:
        print(f"[EROARE SMOKE TEST] Eșec la execuția testelor: {e}")
        sys.exit(1)

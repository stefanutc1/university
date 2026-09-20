/**
 * MockBankingEngine - Simulator in-browser pentru GitHub Pages
 * Reproduce 100% comportamentul backend-ului Java Spring Boot si scrie loguri JSON
 */
class MockBankingEngine {
  constructor() {
    this.clientId = "K-1002";
    this.pin = "8421";
    this.name = "Popescu Ion";
    this.currentIban = "RO99NXCR0001842100000001";
    this.savingsIban = "RO99NXCR0002842100000002";
    this.currentBalance = 1450.00;
    this.savingsBalance = 3200.00;
    this.failedAttempts = 0;
    this.isFrozen = false;
    this.transactions = [
      { transactionId: "TX-9840", type: "DEPOSIT", amount: 1500.00, currency: "RON", sourceIban: "RO00BNR0000000000000001", targetIban: this.currentIban, timestamp: new Date(Date.now() - 7200000).toISOString(), status: "COMPLETED" },
      { transactionId: "TX-9841", type: "CARD_PAYMENT", amount: 50.00, currency: "RON", sourceIban: this.currentIban, targetIban: "RO44POS0000000000000009", timestamp: new Date(Date.now() - 3600000).toISOString(), status: "COMPLETED" }
    ];
    this.logs = [];
  }

  logEvent(event, client, extra = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      event: event,
      client: client || "ANONYMOUS",
      sourceIp: "192.168.20.100", // Kiosk VM IP
      ...extra
    };
    this.logs.unshift(entry);
    if (this.logs.length > 60) this.logs.pop();
    
    // Notificare ascultatori (telemetry console)
    if (window.onNewTelemetryLog) {
      window.onNewTelemetryLog(entry);
    }
    return entry;
  }

  login(clientId, pin) {
    if (clientId !== this.clientId) {
      this.logEvent("LOGIN_FAILED", clientId, { reason: "CLIENT_NOT_FOUND" });
      return { success: false, status: 401, error: "Invalid credentials", attemptCount: ++this.failedAttempts };
    }
    if (this.isFrozen) {
      this.logEvent("LOGIN_BLOCKED", clientId, { reason: "ACCOUNT_LOCKED_FROZEN" });
      return { success: false, status: 403, error: "Account frozen", message: "Contul este blocat de sistemul de securitate." };
    }
    if (pin !== this.pin) {
      this.failedAttempts++;
      this.logEvent("LOGIN_FAILED", clientId, { reason: "BAD_PIN", attemptCount: this.failedAttempts });
      if (this.failedAttempts >= 5) {
        this.isFrozen = true;
        this.logEvent("ACCOUNT_LOCKED", clientId, { reason: "MAX_ATTEMPTS_EXCEEDED", action: "ACCOUNT_AUTO_FROZEN" });
      }
      return { success: false, status: 401, error: "Invalid credentials", attemptCount: this.failedAttempts };
    }

    this.failedAttempts = 0;
    const token = "mock-jwt-" + Math.random().toString(36).substring(2) + "." + btoa(JSON.stringify({ sub: clientId, exp: Date.now() + 45000 }));
    this.logEvent("LOGIN_SUCCESS", clientId, { sessionExpiresIn: 45, iban: this.currentIban });
    return {
      success: true,
      status: 200,
      data: {
        token: token,
        expiresIn: 45,
        clientId: this.clientId,
        name: this.name,
        iban: this.currentIban
      }
    };
  }

  getBalance() {
    this.logEvent("BALANCE_INQUIRY", this.clientId, { iban: this.currentIban, balance: this.currentBalance });
    return {
      iban: this.currentIban,
      balance: this.currentBalance,
      currency: "RON",
      accountType: "CURRENT",
      savingsBalance: this.savingsBalance,
      savingsIban: this.savingsIban
    };
  }

  transfer(targetIban, amount) {
    if (this.isFrozen) {
      throw new Error("Contul este blocat.");
    }
    if (this.currentBalance < amount) {
      this.logEvent("TRANSFER_FAILED_FUNDS", this.clientId, { amount: amount, currentBalance: this.currentBalance, reason: "INSUFFICIENT_FUNDS" });
      throw new Error("Fonduri insuficiente.");
    }

    this.currentBalance -= amount;
    if (targetIban === this.savingsIban) {
      this.savingsBalance += amount;
    }

    const txId = "TX-" + Math.floor(1000 + Math.random() * 9000);
    const tx = {
      transactionId: txId,
      type: "TRANSFER",
      amount: amount,
      currency: "RON",
      sourceIban: this.currentIban,
      targetIban: targetIban,
      timestamp: new Date().toISOString(),
      status: "COMPLETED"
    };
    this.transactions.unshift(tx);

    this.logEvent("TRANSFER_EXECUTED", this.clientId, {
      amount: amount,
      sourceIban: this.currentIban,
      targetIban: targetIban,
      txId: txId,
      newBalance: this.currentBalance
    });

    return {
      status: "COMPLETED",
      transactionId: txId,
      amount: amount,
      targetIban: targetIban,
      newBalance: this.currentBalance,
      timestamp: tx.timestamp
    };
  }

  sessionWipe(reason = "COUNTDOWN_EXPIRED") {
    this.logEvent("SESSION_TIMEOUT_AUTO_WIPE", this.clientId, { reason: reason, action: "AUTO_WIPE_CREDENTIALS" });
    return { status: "SESSION_WIPED" };
  }

  simulateAnomaly(anomalyType = "BALANCE_TAMPERING_INJECTION", details = "Manual injection test") {
    this.logEvent("SIMULATED_ANOMALY_TRIGGERED", "ADMIN_CONSOLE", {
      anomalyType: anomalyType,
      severity: "CRITICAL",
      details: details,
      mitreTechnique: "T1565.001"
    });
    return {
      status: "ANOMALY_LOGGED",
      anomalyType: anomalyType,
      details: details,
      wazuhTargetFile: "/var/log/bank-app/security.log",
      wazuhRuleId: 100109
    };
  }
}

window.mockBank = new MockBankingEngine();

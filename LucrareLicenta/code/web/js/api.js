/**
 * BankApiClient - Client hibrid (Live Spring Boot / Demo Standalone)
 */
class BankApiClient {
  constructor() {
    this.baseUrl = window.location.origin.includes(":8080")
      ? "/api/v1"
      : "http://localhost:8080/api/v1";
    this.token = localStorage.getItem("bank_jwt_token") || null;
    this.isLiveBackend = false;
    this.checkBackendHealth();
  }

  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.baseUrl}/audit/recent-logs`, { credentials: "omit", signal: controller.signal });
      clearTimeout(id);
      if (res.ok) {
        this.isLiveBackend = true;
        this.updateConnectionIndicator("LIVE (Spring Boot :8080)", true);
        return;
      }
    } catch (e) {
      // Backend offline sau mod static
    }
    this.isLiveBackend = false;
    this.updateConnectionIndicator("DEMO (Offline / Mock Engine)", false);
  }

  updateConnectionIndicator(text, isLive) {
    const el = document.getElementById("backend-mode-label");
    const indicator = document.getElementById("backend-status-badge");
    if (el) el.textContent = text;
    if (indicator) {
      if (isLive) {
        indicator.classList.remove("mock-mode");
      } else {
        indicator.classList.add("mock-mode");
      }
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("bank_jwt_token", token);
    } else {
      localStorage.removeItem("bank_jwt_token");
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("bank_jwt_token");
    localStorage.removeItem("bank_user_info");
  }

  async login(clientId, pin) {
    if (this.isLiveBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId, pin })
        });
        const data = await res.json();
        if (res.ok) {
          this.setToken(data.token);
          localStorage.setItem("bank_user_info", JSON.stringify(data));
          return { success: true, data };
        } else {
          return { success: false, status: res.status, error: data.error, attemptCount: data.attemptCount };
        }
      } catch (e) {
        console.warn("Eroare apel live backend, recurgem la mock:", e);
      }
    }

    // Fallback Mock Engine
    const result = window.mockBank.login(clientId, pin);
    if (result.success) {
      this.setToken(result.data.token);
      localStorage.setItem("bank_user_info", JSON.stringify(result.data));
    }
    return result;
  }

  async getBalance() {
    if (this.isLiveBackend && this.token) {
      try {
        const res = await fetch(`${this.baseUrl}/kiosk/balance`, {
          headers: { "Authorization": `Bearer ${this.token}` }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Eroare apel getBalance live, recurgem la mock:", e);
      }
    }
    return window.mockBank.getBalance();
  }

  async transfer(targetIban, amount) {
    if (this.isLiveBackend && this.token) {
      try {
        const res = await fetch(`${this.baseUrl}/kiosk/transfer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
          },
          body: JSON.stringify({ targetIban, amount: parseFloat(amount) })
        });
        if (res.ok) return await res.json();
        const err = await res.json();
        throw new Error(err.error || "Transfer eșuat");
      } catch (e) {
        if (!e.message.includes("eșuat")) {
          console.warn("Eroare apel transfer live, recurgem la mock:", e);
        } else {
          throw e;
        }
      }
    }
    return window.mockBank.transfer(targetIban, amount);
  }

  async sessionWipe(reason = "COUNTDOWN_EXPIRED") {
    if (this.isLiveBackend && this.token) {
      try {
        await fetch(`${this.baseUrl}/kiosk/session-wipe?reason=${encodeURIComponent(reason)}`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${this.token}` }
        });
      } catch (e) {
        // Ignorăm erorile la wipe
      }
    } else {
      window.mockBank.sessionWipe(reason);
    }
    this.clearToken();
  }

  async simulateAnomaly(anomalyType = "BALANCE_TAMPERING_INJECTION", details = "Test licenta Wazuh") {
    if (this.isLiveBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/audit/simulate-anomaly`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anomalyType, details, triggerHttp500: false })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Eroare apel anomalie live, recurgem la mock:", e);
      }
    }
    return window.mockBank.simulateAnomaly(anomalyType, details);
  }

  async simulateHttp500() {
    if (this.isLiveBackend) {
      try {
        await fetch(`${this.baseUrl}/audit/simulate-anomaly`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anomalyType: "UNHANDLED_EXCEPTION_500", details: "Simulare eroare 500", triggerHttp500: true })
        });
      } catch (e) {
        // Asteptam 500
      }
    } else {
      window.mockBank.logEvent("UNHANDLED_EXCEPTION_500", "SYSTEM_CRASH_SIM", {
        error: "Internal Server Error 500",
        severity: "HIGH",
        details: "Eroare 500 interna simulata controlat pentru testare FIM / Wazuh"
      });
    }
  }

  async getRecentLogs() {
    if (this.isLiveBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/audit/recent-logs`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return window.mockBank.logs;
  }
}

window.apiClient = new BankApiClient();

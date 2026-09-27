/**
 * Banking Kiosk Application Logic
 * Lucrare de Licență FEAA UCV - Moană Ștefănuț-Cornel
 */

let currentPin = "";
let countdownTimer = null;
let secondsRemaining = 45;
let currentClient = "K-1002";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Configurare ascultator pentru telemetrie live
  window.onNewTelemetryLog = (logEntry) => {
    appendLogToConsole(logEntry);
  };

  // Verificare daca exista o sesiune salvata
  const savedToken = localStorage.getItem("bank_jwt_token");
  if (savedToken) {
    loadKioskDashboard();
  } else {
    showScreen("screen-welcome");
  }

  // Incarcare loguri initiale in consola Wazuh
  refreshTelemetryConsole();
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");

  // Daca parasim ecranele active de sesiune, oprim cronometrul
  if (screenId === "screen-welcome" || screenId === "screen-login") {
    stopCountdown();
  }
}

// -----------------------------------------------------------------------------
// KIOSK AUTH & NUMERIC PAD
// -----------------------------------------------------------------------------
function startKioskFlow() {
  currentPin = "";
  updatePinDots();
  document.getElementById("client-id-input").value = currentClient;
  showScreen("screen-login");
}

function handleNumClick(digit) {
  if (currentPin.length < 4) {
    currentPin += digit;
    updatePinDots();
    triggerButtonFeedback(digit);
  }
  if (currentPin.length === 4) {
    setTimeout(submitLogin, 150);
  }
}

function handleClearPin() {
  currentPin = "";
  updatePinDots();
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`pin-dot-${i}`);
    if (dot) {
      if (i <= currentPin.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
    }
  }
}

function triggerButtonFeedback(digit) {
  const btns = document.querySelectorAll(".num-btn");
  btns.forEach(b => {
    if (b.textContent.trim() === String(digit)) {
      b.classList.add("clicked");
      setTimeout(() => b.classList.remove("clicked"), 120);
    }
  });
}

async function submitLogin() {
  const clientId = document.getElementById("client-id-input").value.trim() || "K-1002";
  if (currentPin.length === 0) {
    showToast("Vă rugăm introduceți codul PIN.");
    return;
  }

  showToast("Se verifică credențialele...");
  const res = await window.apiClient.login(clientId, currentPin);

  if (res.success) {
    currentPin = "";
    updatePinDots();
    showToast("Autentificare reușită!");
    loadKioskDashboard();
  } else {
    currentPin = "";
    updatePinDots();
    const attempts = res.attemptCount || 1;
    showToast(`PIN Incorect! Încercarea ${attempts}/5. Log generat pentru Wazuh.`);
    shakeElement(document.querySelector(".pin-display-group"));
  }
}

async function simulateBruteForceAttack() {
  showToast("Red Team: Se simulează atac Brute-Force (5 încercări)...");
  const badPins = ["1111", "2222", "3333", "4444", "0000"];
  for (let pin of badPins) {
    await window.apiClient.login("K-1002", pin);
    await new Promise(r => setTimeout(r, 200));
  }
  showToast("Atac finalizat: 5 alerte LOGIN_FAILED emise către Wazuh!");
  refreshTelemetryConsole();
}

// -----------------------------------------------------------------------------
// KIOSK DASHBOARD & COUNTDOWN TIMER (45s AUTO-WIPE)
// -----------------------------------------------------------------------------
async function loadKioskDashboard() {
  showScreen("screen-kiosk");
  startCountdown(45);

  const balanceData = await window.apiClient.getBalance();
  if (balanceData) {
    document.getElementById("kiosk-balance-display").textContent = 
      parseFloat(balanceData.balance).toFixed(2);
    document.getElementById("kiosk-iban-display").textContent = balanceData.iban;
    document.getElementById("kiosk-savings-balance").textContent = 
      parseFloat(balanceData.savingsBalance || 0).toFixed(2);
    document.getElementById("kiosk-savings-iban").textContent = balanceData.savingsIban || "";
  }
}

function startCountdown(seconds) {
  stopCountdown();
  secondsRemaining = seconds;
  updateTimerUI();

  countdownTimer = setInterval(() => {
    secondsRemaining--;
    updateTimerUI();

    if (secondsRemaining <= 0) {
      stopCountdown();
      triggerAutoWipe("COUNTDOWN_EXPIRED");
    }
  }, 1000);
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function updateTimerUI() {
  const display = document.getElementById("timer-display");
  const banner = document.getElementById("timer-banner");
  if (display) {
    display.textContent = `${secondsRemaining}s`;
  }
  if (banner) {
    if (secondsRemaining <= 10) {
      banner.classList.add("warning");
    } else {
      banner.classList.remove("warning");
    }
  }
}

async function triggerAutoWipe(reason = "USER_LOGOUT") {
  stopCountdown();
  showToast(reason === "COUNTDOWN_EXPIRED" 
    ? "Sesiune expirată! Memoria și token-ul au fost șterse." 
    : "Sesiune încheiată cu succes.");

  await window.apiClient.sessionWipe(reason);
  currentPin = "";
  updatePinDots();
  showScreen("screen-welcome");
  refreshTelemetryConsole();
}

// -----------------------------------------------------------------------------
// OPERAȚIUNI TRANZACȚIONALE (50 RON QUICK TRANSFER)
// -----------------------------------------------------------------------------
async function handleQuickTransfer50() {
  const savingsIban = document.getElementById("kiosk-savings-iban").textContent;
  if (!savingsIban) {
    showToast("Contul de economii nu este configurat.");
    return;
  }

  showToast("Se procesează transferul rapid de 50.00 RON...");
  try {
    const res = await window.apiClient.transfer(savingsIban, 50.00);
    showToast(`Transfer reușit! TxID: ${res.transactionId}`);
    
    // Actualizare sold pe ecran
    document.getElementById("kiosk-balance-display").textContent = 
      parseFloat(res.newBalance).toFixed(2);
    
    // Resetare timer la 45s pentru activitate recenta
    secondsRemaining = 45;
    updateTimerUI();
    
    // Actualizare telemetrie
    refreshTelemetryConsole();
  } catch (err) {
    showToast(`Eroare transfer: ${err.message}`);
  }
}

function openCustomTransferModal() {
  const target = prompt("Introduceți IBAN destinatar:", "RO99NXCR0002842100000002");
  if (!target) return;
  const amountStr = prompt("Introduceți suma de transfer (RON):", "100.00");
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert("Suma introdusă este invalidă!");
    return;
  }

  window.apiClient.transfer(target, amount)
    .then(res => {
      showToast(`Transfer de ${amount.toFixed(2)} RON realizat cu succes!`);
      document.getElementById("kiosk-balance-display").textContent = 
        parseFloat(res.newBalance).toFixed(2);
      secondsRemaining = 45;
      updateTimerUI();
      refreshTelemetryConsole();
    })
    .catch(err => {
      alert(`Eroare transfer: ${err.message}`);
    });
}

// -----------------------------------------------------------------------------
// PORTAL CLIENT & VIZUALIZARE TRANZACȚII
// -----------------------------------------------------------------------------
function switchViewMode(mode) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById(`tab-${mode}`);
  if (btn) btn.classList.add("active");

  if (mode === "kiosk") {
    document.getElementById("view-kiosk-content").style.display = "block";
    document.getElementById("view-portal-content").style.display = "none";
  } else if (mode === "portal") {
    document.getElementById("view-kiosk-content").style.display = "none";
    document.getElementById("view-portal-content").style.display = "block";
    loadPortalTransactions();
  }
}

async function loadPortalTransactions() {
  const listContainer = document.getElementById("portal-tx-list");
  listContainer.innerHTML = "<div style='padding:12px;color:var(--text-muted)'>Se încarcă istoricul...</div>";

  const data = window.apiClient.isLiveBackend
    ? await fetch(`${window.apiClient.baseUrl}/portal/overview`, { headers: { "Authorization": `Bearer ${window.apiClient.token}` } }).then(r => r.json()).catch(() => null)
    : null;

  const txs = data && data.recentTransactions ? data.recentTransactions : window.mockBank.transactions;

  listContainer.innerHTML = "";
  if (!txs || txs.length === 0) {
    listContainer.innerHTML = "<div style='padding:12px;color:var(--text-muted)'>Nu există tranzacții recente.</div>";
    return;
  }

  txs.slice(0, 5).forEach(tx => {
    const isDebit = tx.type === "CARD_PAYMENT" || tx.type === "TRANSFER";
    const sign = isDebit ? "-" : "+";
    const amountClass = isDebit ? "debit" : "credit";

    const row = document.createElement("div");
    row.className = "tx-row";
    row.innerHTML = `
      <div class="tx-left">
        <span class="tx-desc">${tx.type} către ${tx.targetIban.substring(0, 12)}...</span>
        <span class="tx-id">${tx.transactionId} • ${new Date(tx.timestamp).toLocaleTimeString()}</span>
      </div>
      <div class="tx-amount ${amountClass}">${sign}${parseFloat(tx.amount).toFixed(2)} ${tx.currency}</div>
    `;
    listContainer.appendChild(row);
  });
}

// -----------------------------------------------------------------------------
// WAZUH SOC TELEMETRY CONSOLE & ANOMALY SIMULATION
// -----------------------------------------------------------------------------
async function refreshTelemetryConsole() {
  const logs = await window.apiClient.getRecentLogs();
  const consoleEl = document.getElementById("wazuh-log-stream");
  if (!consoleEl) return;
  consoleEl.innerHTML = "";

  (logs || []).slice(0, 30).forEach(log => {
    renderLogLine(consoleEl, log);
  });
}

function appendLogToConsole(logEntry) {
  const consoleEl = document.getElementById("wazuh-log-stream");
  if (!consoleEl) return;
  renderLogLine(consoleEl, logEntry, true);
}

function renderLogLine(container, log, prepend = false) {
  const div = document.createElement("div");
  div.className = `log-line event-${log.event || "INFO"}`;
  div.textContent = JSON.stringify(log);
  if (prepend && container.firstChild) {
    container.insertBefore(div, container.firstChild);
  } else {
    container.appendChild(div);
  }
}

async function triggerSimulatedAnomaly() {
  showToast("Se injectează anomalie în loguri pentru testare Wazuh...");
  await window.apiClient.simulateAnomaly(
    "BALANCE_TAMPERING_INJECTION",
    "Discrepanță simulată în ledger pentru declanșarea regulii Wazuh 100109"
  );
  showToast("Anomalie injectată! Verificați consola de mai jos.");
  refreshTelemetryConsole();
}

async function triggerSimulated500Error() {
  showToast("Se simulează eroare critică HTTP 500...");
  await window.apiClient.simulateHttp500();
  showToast("Eroare 500 declanșată și jurnalizată!");
  refreshTelemetryConsole();
}

function copyTelemetryLog() {
  const stream = document.getElementById("wazuh-log-stream");
  if (!stream) return;
  navigator.clipboard.writeText(stream.innerText)
    .then(() => showToast("Logurile au fost copiate în clipboard!"))
    .catch(() => showToast("Nu s-a putut copia textul."));
}

// -----------------------------------------------------------------------------
// UTILS
// -----------------------------------------------------------------------------
function showToast(msg) {
  let toast = document.getElementById("toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notice";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function shakeElement(el) {
  if (!el) return;
  el.style.animation = "shake 0.3s";
  setTimeout(() => el.style.animation = "", 300);
}

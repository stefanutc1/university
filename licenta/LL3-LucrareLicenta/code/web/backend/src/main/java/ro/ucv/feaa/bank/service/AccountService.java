package ro.ucv.feaa.bank.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ro.ucv.feaa.bank.dto.TransactionDto;
import ro.ucv.feaa.bank.model.BankAccount;
import ro.ucv.feaa.bank.model.BankTransaction;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AccountService {
    private final Map<String, BankAccount> accounts = new ConcurrentHashMap<>();
    private final List<BankTransaction> transactions = new CopyOnWriteArrayList<>();
    private final StructuredAuditLogger auditLogger;

    @Value("${bank.accounts.default-client:K-1002}")
    private String defaultClientId;

    @Value("${bank.accounts.default-pin:8421}")
    private String defaultPin;

    @Value("${bank.accounts.default-name:Popescu Ion}")
    private String defaultName;

    @Value("${bank.accounts.default-iban:RO99NXCR0001842100000001}")
    private String defaultIban;

    @Value("${bank.accounts.savings-iban:RO99NXCR0002842100000002}")
    private String savingsIban;

    @Value("${bank.accounts.initial-balance:1450.00}")
    private BigDecimal initialBalance;

    public AccountService(StructuredAuditLogger auditLogger) {
        this.auditLogger = auditLogger;
    }

    @PostConstruct
    public void init() {
        BankAccount defaultAccount = new BankAccount(
                defaultClientId,
                defaultPin,
                defaultName,
                defaultIban,
                savingsIban,
                initialBalance
        );
        defaultAccount.setSavingsBalance(new BigDecimal("3200.00"));
        accounts.put(defaultClientId, defaultAccount);

        // Tranzacții inițiale pentru portal overview
        transactions.add(new BankTransaction("TX-9840", defaultClientId, "DEPOSIT", "RO00BNR0000000000000001", defaultIban, new BigDecimal("1500.00"), "RON", "COMPLETED"));
        transactions.add(new BankTransaction("TX-9841", defaultClientId, "CARD_PAYMENT", defaultIban, "RO44POS0000000000000009", new BigDecimal("50.00"), "RON", "COMPLETED"));
    }

    public Optional<BankAccount> getAccount(String clientId) {
        return Optional.ofNullable(accounts.get(clientId));
    }

    public synchronized boolean validatePin(String clientId, String pin, String sourceIp) {
        BankAccount account = accounts.get(clientId);
        if (account == null) {
            Map<String, Object> extra = new HashMap<>();
            extra.put("reason", "CLIENT_NOT_FOUND");
            auditLogger.logSecurityEvent("LOGIN_FAILED", clientId, sourceIp, extra);
            return false;
        }

        if (account.isFrozen()) {
            Map<String, Object> extra = new HashMap<>();
            extra.put("reason", "ACCOUNT_LOCKED_FROZEN");
            auditLogger.logSecurityEvent("LOGIN_BLOCKED", clientId, sourceIp, extra);
            return false;
        }

        if (account.getPin().equals(pin)) {
            account.resetFailedAttempts();
            Map<String, Object> extra = new HashMap<>();
            extra.put("sessionExpiresIn", 45);
            extra.put("iban", account.getCurrentIban());
            auditLogger.logSecurityEvent("LOGIN_SUCCESS", clientId, sourceIp, extra);
            return true;
        } else {
            account.incrementFailedAttempts();
            int attempts = account.getFailedAttempts();
            Map<String, Object> extra = new HashMap<>();
            extra.put("reason", "BAD_PIN");
            extra.put("attemptCount", attempts);
            auditLogger.logSecurityEvent("LOGIN_FAILED", clientId, sourceIp, extra);

            if (attempts >= 5) {
                account.setFrozen(true);
                Map<String, Object> lockExtra = new HashMap<>();
                lockExtra.put("reason", "MAX_ATTEMPTS_EXCEEDED");
                lockExtra.put("action", "ACCOUNT_AUTO_FROZEN");
                auditLogger.logSecurityEvent("ACCOUNT_LOCKED", clientId, sourceIp, lockExtra);
            }
            return false;
        }
    }

    public int getFailedAttempts(String clientId) {
        BankAccount account = accounts.get(clientId);
        return account != null ? account.getFailedAttempts() : 1;
    }

    public synchronized BankTransaction executeTransfer(String clientId, String targetIban, BigDecimal amount, String sourceIp) {
        BankAccount account = accounts.get(clientId);
        if (account == null) throw new IllegalArgumentException("Cont inexistent");
        if (account.isFrozen()) throw new IllegalStateException("Contul este blocat");

        if (account.getCurrentBalance().compareTo(amount) < 0) {
            Map<String, Object> extra = new HashMap<>();
            extra.put("amount", amount);
            extra.put("currentBalance", account.getCurrentBalance());
            extra.put("reason", "INSUFFICIENT_FUNDS");
            auditLogger.logSecurityEvent("TRANSFER_FAILED_FUNDS", clientId, sourceIp, extra);
            throw new IllegalStateException("Fonduri insuficiente pentru transfer");
        }

        // Debit cont curent
        account.setCurrentBalance(account.getCurrentBalance().subtract(amount));

        // Daca este transfer catre contul propriu de economii, creditam contul de economii
        if (targetIban != null && targetIban.equals(account.getSavingsIban())) {
            account.setSavingsBalance(account.getSavingsBalance().add(amount));
        }

        String txId = "TX-" + (1000 + new Random().nextInt(9000));
        BankTransaction tx = new BankTransaction(
                txId,
                clientId,
                "TRANSFER",
                account.getCurrentIban(),
                targetIban,
                amount,
                "RON",
                "COMPLETED"
        );
        transactions.add(0, tx);

        Map<String, Object> extra = new HashMap<>();
        extra.put("amount", amount);
        extra.put("sourceIban", account.getCurrentIban());
        extra.put("targetIban", targetIban);
        extra.put("txId", txId);
        extra.put("newBalance", account.getCurrentBalance());
        auditLogger.logSecurityEvent("TRANSFER_EXECUTED", clientId, sourceIp, extra);

        return tx;
    }

    public List<TransactionDto> getRecentTransactions(String clientId) {
        List<TransactionDto> result = new ArrayList<>();
        int count = 0;
        for (BankTransaction tx : transactions) {
            if (tx.getClientId().equals(clientId)) {
                result.add(new TransactionDto(
                        tx.getTransactionId(),
                        tx.getType(),
                        tx.getAmount(),
                        tx.getCurrency(),
                        tx.getSourceIban(),
                        tx.getTargetIban(),
                        tx.getTimestamp(),
                        tx.getStatus()
                ));
                count++;
                if (count >= 5) break;
            }
        }
        return result;
    }

    public void simulateAnomaly(String anomalyType, String details, String sourceIp) {
        Map<String, Object> extra = new HashMap<>();
        extra.put("anomalyType", anomalyType);
        extra.put("severity", "CRITICAL");
        extra.put("details", details != null ? details : "Manual red team injection triggered for Wazuh alert test");
        extra.put("mitreTechnique", "T1565.001");
        auditLogger.logSecurityEvent("SIMULATED_ANOMALY_TRIGGERED", "ADMIN_CONSOLE", sourceIp, extra);
    }
}

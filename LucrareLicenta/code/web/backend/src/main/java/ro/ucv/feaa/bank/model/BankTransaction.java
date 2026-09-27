package ro.ucv.feaa.bank.model;

import java.math.BigDecimal;
import java.time.Instant;

public class BankTransaction {
    private String transactionId;
    private String clientId;
    private String type; // TRANSFER, CASH_WITHDRAWAL, DEPOSIT
    private String sourceIban;
    private String targetIban;
    private BigDecimal amount;
    private String currency;
    private Instant timestamp;
    private String status; // COMPLETED, FAILED, SUSPECT

    public BankTransaction(String transactionId, String clientId, String type, String sourceIban, String targetIban, BigDecimal amount, String currency, String status) {
        this.transactionId = transactionId;
        this.clientId = clientId;
        this.type = type;
        this.sourceIban = sourceIban;
        this.targetIban = targetIban;
        this.amount = amount;
        this.currency = currency;
        this.timestamp = Instant.now();
        this.status = status;
    }

    public String getTransactionId() { return transactionId; }
    public String getClientId() { return clientId; }
    public String getType() { return type; }
    public String getSourceIban() { return sourceIban; }
    public String getTargetIban() { return targetIban; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public Instant getTimestamp() { return timestamp; }
    public String getStatus() { return status; }
}

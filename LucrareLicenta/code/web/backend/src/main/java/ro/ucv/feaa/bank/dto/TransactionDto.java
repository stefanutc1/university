package ro.ucv.feaa.bank.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class TransactionDto {
    private String transactionId;
    private String type;
    private BigDecimal amount;
    private String currency;
    private String sourceIban;
    private String targetIban;
    private Instant timestamp;
    private String status;

    public TransactionDto() {}

    public TransactionDto(String transactionId, String type, BigDecimal amount, String currency, String sourceIban, String targetIban, Instant timestamp, String status) {
        this.transactionId = transactionId;
        this.type = type;
        this.amount = amount;
        this.currency = currency;
        this.sourceIban = sourceIban;
        this.targetIban = targetIban;
        this.timestamp = timestamp;
        this.status = status;
    }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getSourceIban() { return sourceIban; }
    public void setSourceIban(String sourceIban) { this.sourceIban = sourceIban; }
    public String getTargetIban() { return targetIban; }
    public void setTargetIban(String targetIban) { this.targetIban = targetIban; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

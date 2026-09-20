package ro.ucv.feaa.bank.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class TransferResponse {
    private String status;
    private String transactionId;
    private BigDecimal amount;
    private String targetIban;
    private BigDecimal newBalance;
    private Instant timestamp;

    public TransferResponse() {}

    public TransferResponse(String status, String transactionId, BigDecimal amount, String targetIban, BigDecimal newBalance) {
        this.status = status;
        this.transactionId = transactionId;
        this.amount = amount;
        this.targetIban = targetIban;
        this.newBalance = newBalance;
        this.timestamp = Instant.now();
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getTargetIban() { return targetIban; }
    public void setTargetIban(String targetIban) { this.targetIban = targetIban; }
    public BigDecimal getNewBalance() { return newBalance; }
    public void setNewBalance(BigDecimal newBalance) { this.newBalance = newBalance; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

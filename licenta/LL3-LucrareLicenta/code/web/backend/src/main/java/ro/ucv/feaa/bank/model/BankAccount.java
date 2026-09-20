package ro.ucv.feaa.bank.model;

import java.math.BigDecimal;

public class BankAccount {
    private String clientId;
    private String pin;
    private String holderName;
    private String currentIban;
    private String savingsIban;
    private BigDecimal currentBalance;
    private BigDecimal savingsBalance;
    private int failedAttempts;
    private boolean isFrozen;

    public BankAccount(String clientId, String pin, String holderName, String currentIban, String savingsIban, BigDecimal initialBalance) {
        this.clientId = clientId;
        this.pin = pin;
        this.holderName = holderName;
        this.currentIban = currentIban;
        this.savingsIban = savingsIban;
        this.currentBalance = initialBalance;
        this.savingsBalance = BigDecimal.ZERO;
        this.failedAttempts = 0;
        this.isFrozen = false;
    }

    public String getClientId() { return clientId; }
    public String getPin() { return pin; }
    public String getHolderName() { return holderName; }
    public String getCurrentIban() { return currentIban; }
    public String getSavingsIban() { return savingsIban; }
    public BigDecimal getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(BigDecimal currentBalance) { this.currentBalance = currentBalance; }
    public BigDecimal getSavingsBalance() { return savingsBalance; }
    public void setSavingsBalance(BigDecimal savingsBalance) { this.savingsBalance = savingsBalance; }
    public int getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }
    public void incrementFailedAttempts() { this.failedAttempts++; }
    public void resetFailedAttempts() { this.failedAttempts = 0; }
    public boolean isFrozen() { return isFrozen; }
    public void setFrozen(boolean frozen) { isFrozen = frozen; }
}

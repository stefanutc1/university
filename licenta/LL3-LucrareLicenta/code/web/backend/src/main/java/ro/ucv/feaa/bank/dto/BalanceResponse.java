package ro.ucv.feaa.bank.dto;

import java.math.BigDecimal;

public class BalanceResponse {
    private String iban;
    private BigDecimal balance;
    private String currency;
    private String accountType;
    private BigDecimal savingsBalance;
    private String savingsIban;

    public BalanceResponse() {}

    public BalanceResponse(String iban, BigDecimal balance, String currency, String accountType, BigDecimal savingsBalance, String savingsIban) {
        this.iban = iban;
        this.balance = balance;
        this.currency = currency;
        this.accountType = accountType;
        this.savingsBalance = savingsBalance;
        this.savingsIban = savingsIban;
    }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public BigDecimal getSavingsBalance() { return savingsBalance; }
    public void setSavingsBalance(BigDecimal savingsBalance) { this.savingsBalance = savingsBalance; }
    public String getSavingsIban() { return savingsIban; }
    public void setSavingsIban(String savingsIban) { this.savingsIban = savingsIban; }
}

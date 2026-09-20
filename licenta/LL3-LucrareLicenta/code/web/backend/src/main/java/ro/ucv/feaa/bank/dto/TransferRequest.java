package ro.ucv.feaa.bank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TransferRequest {
    @NotBlank(message = "IBAN-ul destinatar este obligatoriu")
    private String targetIban;

    @NotNull(message = "Suma este obligatorie")
    @DecimalMin(value = "0.01", message = "Suma minima este de 0.01")
    private BigDecimal amount;

    public TransferRequest() {}

    public TransferRequest(String targetIban, BigDecimal amount) {
        this.targetIban = targetIban;
        this.amount = amount;
    }

    public String getTargetIban() { return targetIban; }
    public void setTargetIban(String targetIban) { this.targetIban = targetIban; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}

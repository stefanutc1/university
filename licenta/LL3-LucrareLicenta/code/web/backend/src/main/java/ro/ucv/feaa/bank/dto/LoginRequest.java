package ro.ucv.feaa.bank.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "ID-ul clientului este obligatoriu")
    private String clientId;

    @NotBlank(message = "Codul PIN este obligatoriu")
    private String pin;

    public LoginRequest() {}

    public LoginRequest(String clientId, String pin) {
        this.clientId = clientId;
        this.pin = pin;
    }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}

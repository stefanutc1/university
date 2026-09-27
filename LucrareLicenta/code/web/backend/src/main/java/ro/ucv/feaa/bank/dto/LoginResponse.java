package ro.ucv.feaa.bank.dto;

public class LoginResponse {
    private String token;
    private int expiresIn;
    private String clientId;
    private String name;
    private String iban;

    public LoginResponse() {}

    public LoginResponse(String token, int expiresIn, String clientId, String name, String iban) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.clientId = clientId;
        this.name = name;
        this.iban = iban;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public int getExpiresIn() { return expiresIn; }
    public void setExpiresIn(int expiresIn) { this.expiresIn = expiresIn; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
}

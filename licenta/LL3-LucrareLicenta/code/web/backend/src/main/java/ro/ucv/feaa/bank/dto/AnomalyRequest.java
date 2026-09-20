package ro.ucv.feaa.bank.dto;

public class AnomalyRequest {
    private String anomalyType; // BALANCE_TAMPERING, UNAUTHORIZED_DB_WRITE, SIMULATE_500_ERROR, SUSPICIOUS_PORT_SCAN
    private String targetAccount;
    private String details;
    private boolean triggerHttp500;

    public AnomalyRequest() {}

    public AnomalyRequest(String anomalyType, String targetAccount, String details, boolean triggerHttp500) {
        this.anomalyType = anomalyType;
        this.targetAccount = targetAccount;
        this.details = details;
        this.triggerHttp500 = triggerHttp500;
    }

    public String getAnomalyType() { return anomalyType; }
    public void setAnomalyType(String anomalyType) { this.anomalyType = anomalyType; }
    public String getTargetAccount() { return targetAccount; }
    public void setTargetAccount(String targetAccount) { this.targetAccount = targetAccount; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public boolean isTriggerHttp500() { return triggerHttp500; }
    public void setTriggerHttp500(boolean triggerHttp500) { this.triggerHttp500 = triggerHttp500; }
}

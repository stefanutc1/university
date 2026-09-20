package ro.ucv.feaa.bank.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.ucv.feaa.bank.dto.AnomalyRequest;
import ro.ucv.feaa.bank.service.AccountService;
import ro.ucv.feaa.bank.service.StructuredAuditLogger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditController {

    private final AccountService accountService;
    private final StructuredAuditLogger auditLogger;

    public AuditController(AccountService accountService, StructuredAuditLogger auditLogger) {
        this.accountService = accountService;
        this.auditLogger = auditLogger;
    }

    @PostMapping("/simulate-anomaly")
    public ResponseEntity<?> simulateAnomaly(
            @RequestBody(required = false) AnomalyRequest request,
            HttpServletRequest httpRequest
    ) {
        String clientIp = extractClientIp(httpRequest);
        String anomalyType = request != null && request.getAnomalyType() != null
                ? request.getAnomalyType() : "BALANCE_TAMPERING_INJECTION";
        String details = request != null ? request.getDetails() : "Discrepanta manuala injectata in registrul contabil pentru testare Wazuh Rule 100109";

        if (request != null && request.isTriggerHttp500()) {
            Map<String, Object> extra = new HashMap<>();
            extra.put("errorType", "SIMULATED_INTERNAL_SERVER_ERROR");
            extra.put("severity", "HIGH");
            auditLogger.logSecurityEvent("UNHANDLED_EXCEPTION_500", "SYSTEM_CRASH_SIM", clientIp, extra);
            throw new RuntimeException("Eroare 500 interna simulata controlat pentru testarea FIM si monitorizarii erorilor in Wazuh!");
        }

        accountService.simulateAnomaly(anomalyType, details, clientIp);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "ANOMALY_LOGGED");
        response.put("anomalyType", anomalyType);
        response.put("details", details);
        response.put("wazuhTargetFile", "/var/log/bank-app/security.log");
        response.put("wazuhRuleId", 100109);
        response.put("message", "Evenimentul suspect a fost scris cu succes in logul auditat de agentul Wazuh.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent-logs")
    public ResponseEntity<List<Map<String, Object>>> getRecentLogs() {
        return ResponseEntity.ok(auditLogger.getRecentLogs());
    }

    private String extractClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}

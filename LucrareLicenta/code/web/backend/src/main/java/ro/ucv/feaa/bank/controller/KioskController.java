package ro.ucv.feaa.bank.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ro.ucv.feaa.bank.dto.BalanceResponse;
import ro.ucv.feaa.bank.dto.TransferRequest;
import ro.ucv.feaa.bank.dto.TransferResponse;
import ro.ucv.feaa.bank.model.BankAccount;
import ro.ucv.feaa.bank.model.BankTransaction;
import ro.ucv.feaa.bank.service.AccountService;
import ro.ucv.feaa.bank.service.StructuredAuditLogger;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/kiosk")
public class KioskController {

    private final AccountService accountService;
    private final StructuredAuditLogger auditLogger;

    public KioskController(AccountService accountService, StructuredAuditLogger auditLogger) {
        this.accountService = accountService;
        this.auditLogger = auditLogger;
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(Authentication authentication, HttpServletRequest request) {
        String clientId = (String) authentication.getPrincipal();
        Optional<BankAccount> accountOpt = accountService.getAccount(clientId);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BankAccount account = accountOpt.get();
        String clientIp = extractClientIp(request);

        Map<String, Object> extra = new HashMap<>();
        extra.put("iban", account.getCurrentIban());
        extra.put("balance", account.getCurrentBalance());
        auditLogger.logSecurityEvent("BALANCE_INQUIRY", clientId, clientIp, extra);

        BalanceResponse response = new BalanceResponse(
                account.getCurrentIban(),
                account.getCurrentBalance(),
                "RON",
                "CURRENT",
                account.getSavingsBalance(),
                account.getSavingsIban()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @Valid @RequestBody TransferRequest transferRequest,
            Authentication authentication,
            HttpServletRequest request
    ) {
        String clientId = (String) authentication.getPrincipal();
        String clientIp = extractClientIp(request);

        try {
            BankTransaction tx = accountService.executeTransfer(
                    clientId,
                    transferRequest.getTargetIban(),
                    transferRequest.getAmount(),
                    clientIp
            );

            Optional<BankAccount> accountOpt = accountService.getAccount(clientId);
            BigDecimal newBalance = accountOpt.map(BankAccount::getCurrentBalance).orElse(BigDecimal.ZERO);

            TransferResponse response = new TransferResponse(
                    tx.getStatus(),
                    tx.getTransactionId(),
                    tx.getAmount(),
                    tx.getTargetIban(),
                    newBalance
            );

            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("status", "FAILED");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/session-wipe")
    public ResponseEntity<?> wipeSession(
            @RequestParam(value = "reason", defaultValue = "COUNTDOWN_EXPIRED") String reason,
            Authentication authentication,
            HttpServletRequest request
    ) {
        String clientId = authentication != null ? (String) authentication.getPrincipal() : "ANONYMOUS";
        String clientIp = extractClientIp(request);

        Map<String, Object> extra = new HashMap<>();
        extra.put("reason", reason);
        extra.put("action", "AUTO_WIPE_CREDENTIALS");
        auditLogger.logSecurityEvent("SESSION_TIMEOUT_AUTO_WIPE", clientId, clientIp, extra);

        Map<String, String> response = new HashMap<>();
        response.put("status", "SESSION_WIPED");
        response.put("message", "Memoria de sesiune si tokenul JWT au fost sterse complet.");
        return ResponseEntity.ok(response);
    }

    private String extractClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}

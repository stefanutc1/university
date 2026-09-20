package ro.ucv.feaa.bank.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.ucv.feaa.bank.config.JwtUtil;
import ro.ucv.feaa.bank.dto.LoginRequest;
import ro.ucv.feaa.bank.dto.LoginResponse;
import ro.ucv.feaa.bank.model.BankAccount;
import ro.ucv.feaa.bank.service.AccountService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AccountService accountService;
    private final JwtUtil jwtUtil;

    public AuthController(AccountService accountService, JwtUtil jwtUtil) {
        this.accountService = accountService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        boolean isValid = accountService.validatePin(request.getClientId(), request.getPin(), clientIp);

        if (isValid) {
            String token = jwtUtil.generateToken(request.getClientId());
            Optional<BankAccount> accountOpt = accountService.getAccount(request.getClientId());
            String name = accountOpt.map(BankAccount::getHolderName).orElse("Utilizator");
            String iban = accountOpt.map(BankAccount::getCurrentIban).orElse("RO99NXCR0001000000000001");

            LoginResponse response = new LoginResponse(
                    token,
                    jwtUtil.getExpirationSeconds(),
                    request.getClientId(),
                    name,
                    iban
            );
            return ResponseEntity.ok(response);
        } else {
            int attemptCount = accountService.getFailedAttempts(request.getClientId());
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("error", "Invalid credentials");
            errorBody.put("attemptCount", attemptCount);
            errorBody.put("message", "Cod PIN sau ID client incorect. Eveniment jurnalizat pentru analiza SOC.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
        }
    }

    private String extractClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}

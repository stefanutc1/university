package ro.ucv.feaa.bank.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.ucv.feaa.bank.dto.TransactionDto;
import ro.ucv.feaa.bank.model.BankAccount;
import ro.ucv.feaa.bank.service.AccountService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/portal")
public class PortalController {

    private final AccountService accountService;

    public PortalController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(Authentication authentication) {
        String clientId = (String) authentication.getPrincipal();
        Optional<BankAccount> accountOpt = accountService.getAccount(clientId);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BankAccount account = accountOpt.get();
        List<TransactionDto> transactions = accountService.getRecentTransactions(clientId);

        Map<String, Object> response = new HashMap<>();
        response.put("clientId", account.getClientId());
        response.put("holderName", account.getHolderName());
        response.put("currentIban", account.getCurrentIban());
        response.put("currentBalance", account.getCurrentBalance());
        response.put("savingsIban", account.getSavingsIban());
        response.put("savingsBalance", account.getSavingsBalance());
        response.put("isFrozen", account.isFrozen());
        response.put("recentTransactions", transactions);

        return ResponseEntity.ok(response);
    }
}

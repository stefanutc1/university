package ro.ucv.feaa.bank.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import ro.ucv.feaa.bank.model.BankAccount;
import ro.ucv.feaa.bank.model.BankTransaction;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AccountServiceTest {

    private AccountService accountService;
    private StructuredAuditLogger auditLogger;

    @BeforeEach
    void setUp() {
        auditLogger = new StructuredAuditLogger();
        accountService = new AccountService(auditLogger);
        accountService.init();
    }

    @Test
    @DisplayName("Validare PIN corect pentru clientul implicit K-1002")
    void testValidPinAuthentication() {
        boolean authenticated = accountService.validatePin("K-1002", "8421", "127.0.0.1");
        assertTrue(authenticated, "Autentificarea cu PIN-ul corect 8421 trebuie să aibă succes.");

        Optional<BankAccount> accountOpt = accountService.getAccount("K-1002");
        assertTrue(accountOpt.isPresent());
        assertEquals("Popescu Ion", accountOpt.get().getHolderName());
    }

    @Test
    @DisplayName("Respingere PIN incorect și incrementare contor eșecuri")
    void testInvalidPinRejection() {
        boolean authenticated = accountService.validatePin("K-1002", "0000", "127.0.0.1");
        assertFalse(authenticated, "Autentificarea cu PIN greșit trebuie să eșueze.");
        assertEquals(1, accountService.getFailedAttempts("K-1002"));
    }

    @Test
    @DisplayName("Blocare automată a contului după 5 încercări eșuate consecutive")
    void testAccountLockAfterFiveFailedAttempts() {
        for (int i = 0; i < 5; i++) {
            accountService.validatePin("K-1002", "9999", "192.168.30.200");
        }
        Optional<BankAccount> accountOpt = accountService.getAccount("K-1002");
        assertTrue(accountOpt.isPresent());
        assertTrue(accountOpt.get().isFrozen(), "Contul trebuie să fie automat blocat (frozen) după 5 tentative eșuate.");
    }

    @Test
    @DisplayName("Executare transfer bancar valid și actualizare debit")
    void testSuccessfulTransfer() {
        BigDecimal initialBalance = accountService.getAccount("K-1002").get().getCurrentBalance();
        BigDecimal transferAmount = new BigDecimal("100.00");

        BankTransaction tx = accountService.executeTransfer("K-1002", "RO99NXCR0002842100000002", transferAmount, "127.0.0.1");
        assertNotNull(tx);
        assertEquals("COMPLETED", tx.getStatus());

        BigDecimal newBalance = accountService.getAccount("K-1002").get().getCurrentBalance();
        assertEquals(initialBalance.subtract(transferAmount), newBalance, "Soldul curent trebuie debitat cu suma transferată.");
    }
}

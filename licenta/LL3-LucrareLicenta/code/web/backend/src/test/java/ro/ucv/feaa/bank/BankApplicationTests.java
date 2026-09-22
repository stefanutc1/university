package ro.ucv.feaa.bank;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BankApplicationTests {

    @Test
    @DisplayName("Verificare inițializare context Spring Boot, filtre securitate și containere bean")
    void contextLoads() {
        // Validează că toate componentele, configurările de securitate și bean-urile se inițializează fără erori
    }
}

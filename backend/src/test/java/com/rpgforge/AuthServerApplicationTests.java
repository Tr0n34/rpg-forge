package com.rpgforge;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = AuthServerApplication.class)
@ActiveProfiles("auth-server")
class AuthServerApplicationTests {

    @Test
    void contextLoads() {
    }
}

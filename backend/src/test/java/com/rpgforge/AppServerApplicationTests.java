package com.rpgforge;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = AppServerApplication.class)
@ActiveProfiles("app-server")
class AppServerApplicationTests {

    @Test
    void contextLoads() {
    }
}

package com.rpgforge.api.common;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("auth-server")
public class AuthServerRootController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthServerRootController.class);

    @GetMapping("/")
    public Map<String, String> root() {
        LOGGER.info("Serving authorization server root endpoint");
        return Map.of(
                "application", "rpg-forge-auth-server",
                "status", "up"
        );
    }
}

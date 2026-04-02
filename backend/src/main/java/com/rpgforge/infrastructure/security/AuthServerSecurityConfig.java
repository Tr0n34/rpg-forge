package com.rpgforge.infrastructure.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("auth-server")
public class AuthServerSecurityConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthServerSecurityConfig.class);

    @Bean
    @Order(2)
    SecurityFilterChain authServerDefaultSecurityFilterChain(HttpSecurity http) throws Exception {
        LOGGER.info("Configuring authorization server login security filter chain");
        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/login").permitAll()
                .anyRequest().authenticated()
        );
        http.formLogin(Customizer.withDefaults());
        return http.build();
    }
}

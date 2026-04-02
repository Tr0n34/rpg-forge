package com.rpgforge;

import com.rpgforge.infrastructure.security.AppSecurityProperties;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication(proxyBeanMethods = false)
@ComponentScan(
        basePackages = "com.rpgforge",
        excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AppServerApplication.class)
)
@EnableConfigurationProperties(AppSecurityProperties.class)
public class AuthServerApplication {

    private AuthServerApplication() {
    }

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(AuthServerApplication.class);
        application.setDefaultProperties(Map.of("spring.profiles.active", "auth-server"));
        application.run(args);
    }
}

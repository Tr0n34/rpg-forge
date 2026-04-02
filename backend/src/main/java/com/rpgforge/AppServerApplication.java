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
        excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AuthServerApplication.class)
)
@EnableConfigurationProperties(AppSecurityProperties.class)
public class AppServerApplication {

    private AppServerApplication() {
    }

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(AppServerApplication.class);
        application.setDefaultProperties(Map.of("spring.profiles.active", "app-server"));
        application.run(args);
    }
}

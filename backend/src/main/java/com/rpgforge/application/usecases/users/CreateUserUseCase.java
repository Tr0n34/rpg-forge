package com.rpgforge.application.usecases.users;

import com.rpgforge.api.common.BadRequestException;
import com.rpgforge.api.common.ErrorKeys;
import com.rpgforge.application.commands.users.CreateUserCommand;
import com.rpgforge.application.rules.users.UserPermissionRules;
import com.rpgforge.application.views.users.UserView;
import com.rpgforge.domain.model.users.User;
import com.rpgforge.domain.ports.users.UserPersistencePort;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class CreateUserUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(CreateUserUseCase.class);

    private final UserPersistencePort userPersistencePort;
    private final PasswordEncoder passwordEncoder;

    public CreateUserUseCase(UserPersistencePort userPersistencePort, PasswordEncoder passwordEncoder) {
        this.userPersistencePort = userPersistencePort;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserView execute(CreateUserCommand command) {
        LOGGER.info("Creating user {}", command.username());
        if (userPersistencePort.existsByUsername(command.username())) {
            throw new BadRequestException(ErrorKeys.USERNAME_ALREADY_EXISTS);
        }
        if (userPersistencePort.existsByEmail(command.email())) {
            throw new BadRequestException(ErrorKeys.EMAIL_ALREADY_EXISTS);
        }

        User user = new User(
                UUID.randomUUID(),
                command.username(),
                command.email(),
                passwordEncoder.encode(command.password()),
                command.role(),
                UserPermissionRules.forRole(command.role(), command.permissions()),
                Instant.now()
        );
        return UserUseCaseSupport.toView(userPersistencePort.save(user));
    }
}

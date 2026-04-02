package com.rpgforge.application.usecases.users;

import com.rpgforge.application.queries.users.ListUsersQuery;
import com.rpgforge.application.views.users.UserView;
import com.rpgforge.domain.ports.users.UserPersistencePort;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class ListUsersUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(ListUsersUseCase.class);

    private final UserPersistencePort userPersistencePort;

    public ListUsersUseCase(UserPersistencePort userPersistencePort) {
        this.userPersistencePort = userPersistencePort;
    }

    @Transactional(readOnly = true)
    public List<UserView> execute(ListUsersQuery query) {
        LOGGER.info("Listing users");
        return userPersistencePort.findAll().stream()
                .map(UserUseCaseSupport::toView)
                .toList();
    }
}

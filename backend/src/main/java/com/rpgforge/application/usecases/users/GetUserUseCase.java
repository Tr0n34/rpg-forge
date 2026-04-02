package com.rpgforge.application.usecases.users;

import com.rpgforge.api.common.ErrorKeys;
import com.rpgforge.api.common.NotFoundException;
import com.rpgforge.application.queries.users.GetUserQuery;
import com.rpgforge.application.views.users.UserView;
import com.rpgforge.domain.ports.users.UserPersistencePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class GetUserUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(GetUserUseCase.class);

    private final UserPersistencePort userPersistencePort;

    public GetUserUseCase(UserPersistencePort userPersistencePort) {
        this.userPersistencePort = userPersistencePort;
    }

    @Transactional(readOnly = true)
    public UserView execute(GetUserQuery query) {
        LOGGER.info("Loading user {}", query.userId());
        return userPersistencePort.findById(query.userId())
                .map(UserUseCaseSupport::toView)
                .orElseThrow(() -> new NotFoundException(ErrorKeys.USER_NOT_FOUND));
    }
}

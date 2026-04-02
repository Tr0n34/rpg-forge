package com.rpgforge.application.usecases.users;

import com.rpgforge.application.views.users.UserView;
import com.rpgforge.domain.model.users.User;

final class UserUseCaseSupport {

    private UserUseCaseSupport() {
    }

    static UserView toView(User user) {
        return new UserView(
                user.id(),
                user.username(),
                user.email(),
                user.role(),
                user.permissions(),
                user.createdAt()
        );
    }
}

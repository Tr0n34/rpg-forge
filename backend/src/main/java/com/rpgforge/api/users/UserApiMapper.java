package com.rpgforge.api.users;

import com.rpgforge.application.commands.users.CreateUserCommand;
import com.rpgforge.application.queries.users.GetUserQuery;
import com.rpgforge.application.queries.users.ListUsersQuery;
import com.rpgforge.infrastructure.users.dto.CreateUserDto;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class UserApiMapper {

    public CreateUserCommand toCreateCommand(CreateUserDto dto) {
        return new CreateUserCommand(
                dto.username(),
                dto.email(),
                dto.password(),
                dto.role(),
                dto.permissions() == null ? Set.of() : Set.copyOf(dto.permissions())
        );
    }

    public GetUserQuery toGetQuery(UUID userId) {
        return new GetUserQuery(userId);
    }

    public ListUsersQuery toListQuery() {
        return new ListUsersQuery();
    }
}

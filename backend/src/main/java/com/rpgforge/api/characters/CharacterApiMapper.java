package com.rpgforge.api.characters;

import com.rpgforge.api.common.BadRequestException;
import com.rpgforge.api.common.ErrorKeys;
import com.rpgforge.application.commands.characters.CreateCharacterCommand;
import com.rpgforge.application.commands.characters.DeleteCharacterCommand;
import com.rpgforge.application.commands.characters.UpdateCharacterCommand;
import com.rpgforge.domain.model.characters.CharacterAllocationProfile;
import com.rpgforge.domain.model.characters.CharacterAttributes;
import com.rpgforge.application.queries.characters.GetCharacterQuery;
import com.rpgforge.application.queries.characters.ListCharactersQuery;
import com.rpgforge.infrastructure.characters.dto.CharacterAttributesDto;
import com.rpgforge.infrastructure.characters.dto.CreateCharacterDto;
import com.rpgforge.infrastructure.characters.dto.UpdateCharacterDto;
import com.rpgforge.infrastructure.security.CurrentUser;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class CharacterApiMapper {

    public CreateCharacterCommand toCreateCommand(CurrentUser currentUser, CreateCharacterDto dto) {
        return new CreateCharacterCommand(
                currentUser.id(),
                currentUser.username(),
                dto.firstName(),
                dto.lastName(),
                dto.title(),
                dto.birthDate(),
                dto.age(),
                dto.level(),
                toAllocationProfile(dto.allocationProfile()),
                toAttributes(dto.attributes())
        );
    }

    public UpdateCharacterCommand toUpdateCommand(CurrentUser currentUser, UUID characterId, UpdateCharacterDto dto) {
        return new UpdateCharacterCommand(
                currentUser.id(),
                currentUser.username(),
                characterId,
                dto.firstName(),
                dto.lastName(),
                dto.title(),
                dto.birthDate(),
                dto.age(),
                dto.level(),
                toAllocationProfile(dto.allocationProfile()),
                toAttributes(dto.attributes())
        );
    }

    public GetCharacterQuery toGetQuery(CurrentUser currentUser, UUID characterId) {
        return new GetCharacterQuery(currentUser.id(), currentUser.username(), characterId);
    }

    public DeleteCharacterCommand toDeleteCommand(CurrentUser currentUser, UUID characterId) {
        return new DeleteCharacterCommand(currentUser.id(), currentUser.username(), characterId);
    }

    public ListCharactersQuery toListQuery(CurrentUser currentUser, LocalDate createdFrom, LocalDate createdTo, String lastName) {
        return new ListCharactersQuery(currentUser.id(), currentUser.username(), createdFrom, createdTo, lastName);
    }

    private CharacterAttributes toAttributes(CharacterAttributesDto dto) {
        return new CharacterAttributes(
                dto.strength(),
                dto.agility(),
                dto.constitution(),
                dto.perception(),
                dto.intelligence(),
                dto.willpower(),
                dto.charisma()
        );
    }

    private CharacterAllocationProfile toAllocationProfile(String value) {
        try {
            return CharacterAllocationProfile.fromApiValue(value);
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException(ErrorKeys.INVALID_CHARACTER_ALLOCATION);
        }
    }
}

package com.rpgforge.application.usecases.characters;

import com.rpgforge.application.commands.characters.UpdateCharacterCommand;
import com.rpgforge.application.policies.characters.CharacterPolicies;
import com.rpgforge.application.views.characters.CharacterView;
import com.rpgforge.api.common.ErrorKeys;
import com.rpgforge.api.common.NotFoundException;
import com.rpgforge.domain.model.characters.Character;
import com.rpgforge.domain.ports.characters.CharacterPersistencePort;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class UpdateCharacterUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(UpdateCharacterUseCase.class);

    private final CharacterPersistencePort characterPersistencePort;

    public UpdateCharacterUseCase(CharacterPersistencePort characterPersistencePort) {
        this.characterPersistencePort = characterPersistencePort;
    }

    @Transactional
    public CharacterView execute(UpdateCharacterCommand command) {
        LOGGER.info("Updating character {} for user {}", command.characterId(), command.ownerUsername());
        Character existing = characterPersistencePort.findOwnedById(command.ownerId(), command.characterId())
                .orElseThrow(() -> new NotFoundException(ErrorKeys.CHARACTER_NOT_FOUND));
        Character updated = new Character(
                existing.id(),
                existing.ownerId(),
                command.firstName(),
                command.lastName(),
                command.title(),
                command.birthDate(),
                command.age(),
                command.level(),
                command.allocationProfile(),
                command.attributes(),
                existing.createdAt(),
                Instant.now()
        );
        CharacterPolicies.forUpdate().ensure(updated);
        return CharacterUseCaseSupport.toView(characterPersistencePort.save(updated));
    }
}

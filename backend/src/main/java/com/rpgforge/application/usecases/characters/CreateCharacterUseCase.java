package com.rpgforge.application.usecases.characters;

import com.rpgforge.application.commands.characters.CreateCharacterCommand;
import com.rpgforge.application.policies.characters.CharacterPolicies;
import com.rpgforge.application.views.characters.CharacterView;
import com.rpgforge.domain.model.characters.Character;
import com.rpgforge.domain.ports.characters.CharacterPersistencePort;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class CreateCharacterUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(CreateCharacterUseCase.class);

    private final CharacterPersistencePort characterPersistencePort;

    public CreateCharacterUseCase(CharacterPersistencePort characterPersistencePort) {
        this.characterPersistencePort = characterPersistencePort;
    }

    @Transactional
    public CharacterView execute(CreateCharacterCommand command) {
        LOGGER.info("Creating character {} {} for user {}", command.firstName(), command.lastName(), command.ownerUsername());
        Character character = new Character(
                UUID.randomUUID(),
                command.ownerId(),
                command.firstName(),
                command.lastName(),
                command.title(),
                command.birthDate(),
                command.age(),
                command.level(),
                command.allocationProfile(),
                command.attributes(),
                Instant.now(),
                Instant.now()
        );
        CharacterPolicies.forCreation().ensure(character);
        return CharacterUseCaseSupport.toView(characterPersistencePort.save(character));
    }
}

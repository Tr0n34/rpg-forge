package com.rpgforge.application.usecases.characters;

import com.rpgforge.application.commands.characters.DeleteCharacterCommand;
import com.rpgforge.api.common.ErrorKeys;
import com.rpgforge.api.common.NotFoundException;
import com.rpgforge.domain.model.characters.Character;
import com.rpgforge.domain.ports.characters.CharacterPersistencePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class DeleteCharacterUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(DeleteCharacterUseCase.class);

    private final CharacterPersistencePort characterPersistencePort;

    public DeleteCharacterUseCase(CharacterPersistencePort characterPersistencePort) {
        this.characterPersistencePort = characterPersistencePort;
    }

    @Transactional
    public void execute(DeleteCharacterCommand command) {
        LOGGER.info("Deleting character {} for user {}", command.characterId(), command.ownerUsername());
        Character character = characterPersistencePort.findOwnedById(command.ownerId(), command.characterId())
                .orElseThrow(() -> new NotFoundException(ErrorKeys.CHARACTER_NOT_FOUND));
        characterPersistencePort.delete(character);
    }
}

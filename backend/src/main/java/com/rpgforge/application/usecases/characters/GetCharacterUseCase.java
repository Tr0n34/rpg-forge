package com.rpgforge.application.usecases.characters;

import com.rpgforge.application.queries.characters.GetCharacterQuery;
import com.rpgforge.application.views.characters.CharacterView;
import com.rpgforge.api.common.ErrorKeys;
import com.rpgforge.api.common.NotFoundException;
import com.rpgforge.domain.ports.characters.CharacterPersistencePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class GetCharacterUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(GetCharacterUseCase.class);

    private final CharacterPersistencePort characterPersistencePort;

    public GetCharacterUseCase(CharacterPersistencePort characterPersistencePort) {
        this.characterPersistencePort = characterPersistencePort;
    }

    @Transactional(readOnly = true)
    public CharacterView execute(GetCharacterQuery query) {
        LOGGER.info("Loading character {} for user {}", query.characterId(), query.ownerUsername());
        return characterPersistencePort.findOwnedById(query.ownerId(), query.characterId())
                .map(CharacterUseCaseSupport::toView)
                .orElseThrow(() -> new NotFoundException(ErrorKeys.CHARACTER_NOT_FOUND));
    }
}

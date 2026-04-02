package com.rpgforge.application.usecases.characters;

import com.rpgforge.application.queries.characters.ListCharactersQuery;
import com.rpgforge.application.views.characters.CharacterView;
import com.rpgforge.domain.ports.characters.CharacterPersistencePort;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("app-server")
public class ListCharactersUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(ListCharactersUseCase.class);

    private final CharacterPersistencePort characterPersistencePort;

    public ListCharactersUseCase(CharacterPersistencePort characterPersistencePort) {
        this.characterPersistencePort = characterPersistencePort;
    }

    @Transactional(readOnly = true)
    public List<CharacterView> execute(ListCharactersQuery query) {
        LOGGER.info("Listing characters for user {}", query.ownerUsername());
        return characterPersistencePort.listOwned(query).stream()
                .map(CharacterUseCaseSupport::toView)
                .toList();
    }
}

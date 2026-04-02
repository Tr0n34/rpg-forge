package com.rpgforge.application.usecases.characters;

import com.rpgforge.application.views.characters.CharacterView;
import com.rpgforge.domain.model.characters.Character;

final class CharacterUseCaseSupport {

    private CharacterUseCaseSupport() {
    }

    static CharacterView toView(Character character) {
        return new CharacterView(
                character.id(),
                character.ownerId(),
                character.firstName(),
                character.lastName(),
                character.title(),
                character.birthDate(),
                character.age(),
                character.level(),
                character.allocationProfile(),
                character.attributes(),
                character.derivedStats(),
                character.createdAt(),
                character.updatedAt()
        );
    }
}

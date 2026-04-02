package com.rpgforge.application.policies.characters;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.rpgforge.api.common.BadRequestException;
import com.rpgforge.api.common.ErrorKeys;
import com.rpgforge.domain.model.characters.Character;
import com.rpgforge.domain.model.characters.CharacterAllocationProfile;
import com.rpgforge.domain.model.characters.CharacterAttributes;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CharacterPoliciesTest {

    @Test
    void forCreationRejectsNullCharacter() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> CharacterPolicies.forCreation().ensure(null)
        );

        assertEquals(ErrorKeys.VALIDATION_ERROR, exception.errorKey());
    }

    @Test
    void forCreationRejectsInvalidFixedAllocation() {
        Character character = new Character(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "Bad",
                "Build",
                null,
                LocalDate.of(1998, 5, 10),
                28,
                12,
                CharacterAllocationProfile.EXPERT,
                new CharacterAttributes(2, 2, 2, 1, 1, 0, -1),
                Instant.now(),
                Instant.now()
        );

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> CharacterPolicies.forCreation().ensure(character)
        );

        assertEquals(ErrorKeys.INVALID_CHARACTER_ALLOCATION, exception.errorKey());
    }

    @Test
    void forCreationAcceptsFreeAllocation() {
        Character character = new Character(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "Lyra",
                "Vale",
                "Arcaniste",
                LocalDate.of(2000, 4, 10),
                26,
                7,
                CharacterAllocationProfile.LIBRE,
                new CharacterAttributes(4, 1, 2, 0, 5, 3, -2),
                Instant.now(),
                Instant.now()
        );

        assertDoesNotThrow(() -> CharacterPolicies.forCreation().ensure(character));
    }
}

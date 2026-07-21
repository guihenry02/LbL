package dev.guigas.languagelearning.language_learning.enums;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class LanguageTest {

    @Test
    void shouldMapKnownCodesToEnumValues() {
        assertEquals(Optional.of(Language.ENGLISH), Language.fromCode("en"));
        assertEquals(Optional.of(Language.PORTUGUESE), Language.fromCode("pt"));
        assertEquals(Optional.of(Language.CHINESE), Language.fromCode("zh"));
        assertEquals(Optional.of(Language.CHINESE_TRADITIONAL), Language.fromCode("zh_HANT"));
    }

    @Test
    void shouldReturnEmptyWhenCodeIsNotSupported() {
        assertTrue(Language.fromCode("xyz").isEmpty());
    }
}

package dev.guigas.languagelearning.language_learning.analysis.NLP;

public record LinguisticToken(
        String text,
        String lemma,
        String pos,
        String tag,
        String dependency
) {}
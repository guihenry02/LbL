package dev.guigas.languagelearning.language_learning.analysis.NLP;

import java.util.List;

public record LinguisticAnalysis(
        List<LinguisticToken> tokens,
        List<String> sentences
) {}
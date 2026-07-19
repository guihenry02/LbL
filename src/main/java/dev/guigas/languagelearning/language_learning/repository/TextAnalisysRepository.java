package dev.guigas.languagelearning.language_learning.repository;

import java.util.List;

import dev.guigas.languagelearning.language_learning.domain.TextAnalysis;

public interface TextAnalisysRepository {
    TextAnalysis save(TextAnalysis analysis);
    List<TextAnalysis> allAnalysis();
}

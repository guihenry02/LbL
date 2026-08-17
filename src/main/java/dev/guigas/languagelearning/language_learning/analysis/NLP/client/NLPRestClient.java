package dev.guigas.languagelearning.language_learning.analysis.NLP.client;

import dev.guigas.languagelearning.language_learning.analysis.NLP.LinguisticAnalysis;

public interface NLPRestClient {
    LinguisticAnalysis languageProcessing(String text);
}

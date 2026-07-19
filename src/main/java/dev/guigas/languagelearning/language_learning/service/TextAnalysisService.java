package dev.guigas.languagelearning.language_learning.service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.domain.TextAnalysis;
import dev.guigas.languagelearning.language_learning.enums.AnalysisProvider;
import dev.guigas.languagelearning.language_learning.enums.InteractionType;
import dev.guigas.languagelearning.language_learning.repository.TextAnalisysRepository;

public class TextAnalysisService {

    private final TextAnalisysRepository textAnalisysRepository;

    public TextAnalysisService(TextAnalisysRepository textAnalisysRepository) {
        this.textAnalisysRepository = textAnalisysRepository;
    }

    public TextAnalysis analyze(LearningInteraction learningInteraction)
    {
        InteractionType interactionType = classify(learningInteraction);
        String translatedText = translate(learningInteraction);
        String explanation = explain();
        AnalysisProvider analysisProvider = getAnalysisProvider(); // Placeholder for the actual provider
        TextAnalysis textAnalysis = new TextAnalysis(interactionType, translatedText, explanation, analysisProvider);
        textAnalisysRepository.save(textAnalysis);
        return textAnalysis;
        // reestruturar pra fazer o service de LearningInteraction salvar a analise e não esse service aqui
    }

    private InteractionType classify(LearningInteraction learningInteraction) {
        // Implement classification logic here
        return InteractionType.WORD; // Placeholder
    }

    private String translate(LearningInteraction learningInteraction) {
        // Implement translation logic here
        return "Translated text"; // Placeholder
    }

    private String explain() {
        // Implement explanation logic here
        return "Explanation of the text"; // Placeholder
    }

    private AnalysisProvider getAnalysisProvider() {
        // Implement logic to determine the analysis provider
        return AnalysisProvider.AI; // Placeholder
    }

}

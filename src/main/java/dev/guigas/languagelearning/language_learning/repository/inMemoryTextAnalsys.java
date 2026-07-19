package dev.guigas.languagelearning.language_learning.repository;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Repository;

import dev.guigas.languagelearning.language_learning.domain.TextAnalysis;

@Repository
public class inMemoryTextAnalsys implements TextAnalisysRepository {

    private final List<TextAnalysis> analyses = new CopyOnWriteArrayList<>();

    @Override
    public TextAnalysis save(TextAnalysis analysis) {
        analyses.add(analysis);
        return analysis;
    }


    @Override
    public List<TextAnalysis> allAnalysis() {
        //Return the first analysis for simplicity
        return List.copyOf(analyses);
    }

}

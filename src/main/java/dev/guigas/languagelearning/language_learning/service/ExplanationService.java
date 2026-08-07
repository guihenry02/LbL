package dev.guigas.languagelearning.language_learning.service;

import org.springframework.stereotype.Service;

@Service
public class ExplanationService {

    public String explain(String originalText, String translatedText) {
        return "Explanation for: " + originalText;
    }
}

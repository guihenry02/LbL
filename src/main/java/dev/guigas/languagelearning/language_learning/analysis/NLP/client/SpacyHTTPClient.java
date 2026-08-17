package dev.guigas.languagelearning.language_learning.analysis.NLP.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import dev.guigas.languagelearning.language_learning.analysis.NLP.LinguisticAnalysis;

public class SpacyHTTPClient implements NLPRestClient {

    private final RestClient spacyRestClient;

    public SpacyHTTPClient(
            RestClient.Builder builder,
            @Value("${nlp.api.url}") String apiUrl) {

        this.spacyRestClient = builder
                .baseUrl(apiUrl)
                .build();
    }

    @Override
    public LinguisticAnalysis languageProcessing(String text) {

        return spacyRestClient.post()
                .uri("/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .body(new NLPRequest(text))
                .retrieve()
                .body(LinguisticAnalysis.class);
    }

    private record NLPRequest(String text) {}
}
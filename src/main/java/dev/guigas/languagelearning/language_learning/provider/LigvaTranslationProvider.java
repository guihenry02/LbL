package dev.guigas.languagelearning.language_learning.provider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import dev.guigas.languagelearning.language_learning.enums.Language;

@Component
public class LigvaTranslationProvider implements TranslationProvider {

    private final RestClient ligvaRestClient;

    public LigvaTranslationProvider(RestClient.Builder builder, @Value("${translation.api.url}") String apiUrl) {
        this.ligvaRestClient = builder
                .baseUrl(apiUrl)
                .build();
    }

    @Override
    public TranslationProviderResult translate(String text, Language source, Language target) {
        String translatedText = ligvaRestClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/{source}/{target}/{text}")
                    .build(
                        source.getCode(),
                        target.getCode(),
                        text))
                .retrieve()
                .body(String.class);

        return new TranslationProviderResult(text, translatedText, source, target);
    }
}

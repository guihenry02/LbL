import type { LearningInteractionRequest } from "../DTO/LearningInteractionRequest";
import type { LearningInteractionResponse } from "../DTO/LearningInteractionResponse";

class LearningInteractionClient {

    private readonly baseUrl: string;
    private static readonly LEARNING_INTERACTIONS = "/learning-interactions";

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

    }

    public async createLearningInteraction(request: LearningInteractionRequest): Promise<LearningInteractionResponse> {
        const response = await fetch(`${this.baseUrl}${LearningInteractionClient.LEARNING_INTERACTIONS}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`Failed to create learning interaction: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData as LearningInteractionResponse;
    }

}

export const learningInteractionClient = new LearningInteractionClient("http://localhost:8081");
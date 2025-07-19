import { generateResponse } from './dev';

export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const response = await generateResponse(prompt);
        return response;
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Content generation failed');
    }
};

export const generateMultipleResponses = async (prompts: string[]): Promise<string[]> => {
    const responses = await Promise.all(prompts.map(prompt => generateContent(prompt)));
    return responses;
};
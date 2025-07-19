export function enhancePrompt(prompt: string): string {
    // Example enhancement: Trim whitespace and capitalize the first letter
    return prompt.trim().charAt(0).toUpperCase() + prompt.slice(1);
}

export function addContextToPrompt(prompt: string, context: string): string {
    // Example enhancement: Add context to the prompt
    return `${context}: ${prompt}`;
}

export function simplifyPrompt(prompt: string): string {
    // Example enhancement: Simplify the prompt by removing unnecessary words
    const simplified = prompt.replace(/\b(?:very|really|just|actually)\b/g, '').trim();
    return simplified;
}
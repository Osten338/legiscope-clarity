
/**
 * Cleans and formats context text for optimal use in chat completions
 * 
 * @param context The raw context text to clean
 * @returns Cleaned context string ready for insertion into prompts
 */
export function cleanContextForChat(context: string): string | null {
  if (!context || typeof context !== 'string') {
    return null;
  }

  // Remove excessive whitespace
  let cleanedContext = context.trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ');

  // Ensure context isn't too long (OpenAI has token limits)
  const MAX_CONTEXT_LENGTH = 15000;
  if (cleanedContext.length > MAX_CONTEXT_LENGTH) {
    console.log(`Context too long (${cleanedContext.length} chars), truncating to ${MAX_CONTEXT_LENGTH}`);
    cleanedContext = cleanedContext.substring(0, MAX_CONTEXT_LENGTH) + 
      '\n...[Content truncated due to length]';
  }

  return cleanedContext;
}

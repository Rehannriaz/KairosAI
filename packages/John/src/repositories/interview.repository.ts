import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getChatCompletion = async (messages: any[]): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });
    return completion.choices[0]?.message?.content || 'No response from AI.';
  } catch (error: any) {
    // Log error details
    console.error(
      'Error communicating with OpenAI:',
      error.response?.data || error.message
    );

    if (error.response) {
      // Specific error from OpenAI API
      throw new Error(
        `OpenAI API Error: ${error.response.status} - ${error.response.data?.error?.message}`
      );
    }

    // General error
    throw new Error('Failed to generate interview response.');
  }
};

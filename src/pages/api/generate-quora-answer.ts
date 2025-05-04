import type { APIRoute } from 'astro';
import OpenAI from 'openai';

// Get API key from environment variables with better error handling
const getApiKey = () => {
  const apiKey = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key is not configured');
    return null;
  }
  return apiKey;
};

export const POST: APIRoute = async ({ request }) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key is not configured' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey
    });

    const { question, context, tone, style } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a Quora answer writer. Create a ${style}, ${tone} answer following these guidelines:

1. Write in a ${tone} tone
2. Use a ${style} writing style
3. Consider this context: ${context}
4. Keep answer between 200-400 words
5. Include relevant examples or evidence
6. Be clear and concise
7. Maintain a helpful attitude
8. Use appropriate formatting
9. Focus on providing value
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate an answer for this Quora question: ${question}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const answers = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ answers }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating Quora answer:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate Quora answer. Please try again.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
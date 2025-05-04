import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
});

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.OPENAI_API_KEY) {
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
    const { originalText, tone, style, variations } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an article rewriter. Create ${variations} unique version${variations > 1 ? 's' : ''} following these guidelines:

1. Write in a ${tone} tone
2. Use a ${style} writing style
3. Maintain the original meaning
4. Improve readability and flow
5. Keep similar length to original
6. Use natural language
7. Avoid repetitive phrases
8. Return exactly ${variations} version${variations > 1 ? 's' : ''}
9. Each version must be complete
10. Separate versions with "---VERSION---"`
        },
        {
          role: "user",
          content: `Rewrite this text ${variations} time${variations > 1 ? 's' : ''}: ${originalText}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split versions and clean them up
    const rewrittenText = content
      .split('---VERSION---')
      .map(version => version.trim())
      .filter(Boolean)
      .slice(0, variations); // Ensure we only return the requested number of versions

    return new Response(
      JSON.stringify({ rewrittenText }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error rewriting article:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to rewrite article' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
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
    const { sourceType, authors, title, year, additionalInfo } = await request.json();

    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an APA reference generator. Create references following these guidelines:

1. Source Type: ${sourceType}
2. Authors: ${authors}
3. Title: ${title}
4. Year: ${year}
5. Additional Info: ${additionalInfo}
6. Include:
   - Properly formatted reference
   - In-text citation examples
   - Formatting notes
   - Common mistakes to avoid
   - Additional tips
7. Follow APA 7th edition
8. Check formatting details
9. Verify punctuation
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate an APA reference for: ${title}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const references = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ references }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating APA reference:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate APA reference' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
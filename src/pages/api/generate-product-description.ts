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
    const { productName, features, targetAudience, tone, style } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a product description writer. Create a ${style}, ${tone} description following these guidelines:

1. Write in a ${tone} tone
2. Use a ${style} writing style
3. Target audience: ${targetAudience}
4. Highlight key features: ${features}
5. Keep description between 150-300 words
6. Focus on benefits and value
7. Use persuasive language
8. Include a strong call-to-action
9. Optimize for readability
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a product description for: ${productName}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const descriptions = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ descriptions }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating product description:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate product description' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
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
    const { topic, numberOfItems, tone, style } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a listicle writer. Create a ${style}, ${tone} list following these guidelines:

1. Generate exactly ${numberOfItems} items
2. Write in a ${tone} tone
3. Use a ${style} writing style
4. Include a brief introduction
5. Number each item clearly
6. Provide detailed explanations for each point
7. Make content engaging and informative
8. Use appropriate formatting
9. Maintain consistent style throughout
10. Separate sections with "---ITEM---"`
        },
        {
          role: "user",
          content: `Generate a ${numberOfItems}-item listicle about: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split items and clean them up
    const listicle = content
      .split('---ITEM---')
      .map(item => item.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ listicle }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating listicle:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate listicle' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
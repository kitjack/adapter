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
    const { productName, productFeatures, tone, rating } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a product reviewer. Create a ${tone} review following these guidelines:

1. Write in a ${tone} tone
2. Match the ${rating}-star rating in content
3. Discuss the key features: ${productFeatures}
4. Include both pros and cons
5. Keep the review between 200-300 words
6. Make it helpful for potential buyers
7. Use appropriate formatting
8. Be specific about product experiences
9. Maintain authenticity
10. Focus on practical usage and value`
        },
        {
          role: "user",
          content: `Generate a product review for: ${productName}`
        }
      ],
      temperature: 0.7,
    });

    const review = completion.choices[0].message.content || '';
    
    // Wrap the review in an array to maintain consistency with other endpoints
    const reviews = [review];

    return new Response(
      JSON.stringify({ reviews }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating review:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate review' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
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
    const { topic, context, tone, pointsPerSide } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a pros and cons analyst. Create a ${tone} analysis following these guidelines:

1. Write in a ${tone} tone
2. Generate exactly ${pointsPerSide} points for each side
3. Consider the context: ${context}
4. Format clearly with "Pros:" and "Cons:" sections
5. Make points concise but informative
6. Use bullet points for each item
7. Ensure balanced analysis
8. Focus on significant factors
9. Be specific and practical
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate pros and cons analysis for: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const prosAndCons = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ prosAndCons }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating pros and cons:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate pros and cons' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
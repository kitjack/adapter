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
    const { field, level, type, keywords } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a project topic generator. Create innovative project ideas following these guidelines:

1. Field: ${field}
2. Level: ${level}
3. Project type: ${type}
4. Keywords focus: ${keywords}
5. For each topic include:
   - Project title
   - Brief description
   - Key objectives
   - Expected outcomes
   - Technical requirements
6. Make topics practical and achievable
7. Consider current trends
8. Focus on innovation
9. Include implementation hints
10. Separate topics with "---TOPIC---"`
        },
        {
          role: "user",
          content: `Generate 3 project topics for: ${field}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split topics and clean them up
    const topics = content
      .split('---TOPIC---')
      .map(topic => topic.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ topics }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating project topics:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate project topics' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
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
    const { riddle, difficulty, type, includeHints } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a riddle solver. Solve this ${difficulty} ${type} riddle following these guidelines:

1. Riddle: ${riddle}
2. Difficulty: ${difficulty}
3. Type: ${type}
4. Include hints: ${includeHints}
5. Include:
   - The answer
   - Explanation of the solution
   - Word or logic analysis
   - ${includeHints ? 'Step-by-step hints' : 'Brief summary'}
   - Similar riddles
6. Break down complex parts
7. Explain wordplay
8. Show logical steps
9. Provide context
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Solve this riddle: ${riddle}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const solution = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ solution }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error solving riddle:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to solve riddle' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
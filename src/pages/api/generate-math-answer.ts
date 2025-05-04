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
    const { problem, subject, detailLevel, showWork } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a math tutor. Solve problems following these guidelines:

1. Subject area: ${subject}
2. Detail level: ${detailLevel}
3. ${showWork ? 'Show detailed step-by-step work' : 'Show final answer with brief explanation'}
4. Include:
   - Problem statement
   - Solution steps (if showing work)
   - Final answer
   - Explanation of concepts
   - Verification steps
5. Use clear formatting
6. Explain mathematical concepts
7. Show all calculations
8. Include relevant formulas
9. Verify the answer
10. Separate sections with "---STEP---"`
        },
        {
          role: "user",
          content: `Solve this math problem: ${problem}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split solution steps and clean them up
    const solution = content
      .split('---STEP---')
      .map(step => step.trim())
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
    console.error('Error generating math solution:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate math solution' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
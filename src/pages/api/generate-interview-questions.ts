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
    const { position, level, type, focus } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an interview questions generator. Create ${type} questions with a ${focus} focus following these guidelines:

1. Position: ${position}
2. Level: ${level}
3. Question type: ${type}
4. Focus area: ${focus}
5. For each question include:
   - The question
   - Expected answer points
   - What to look for
   - Red flags
   - Follow-up questions
6. Make questions relevant
7. Include assessment criteria
8. Suggest good answers
9. Add difficulty rating
10. Separate questions with "---QUESTION---"`
        },
        {
          role: "user",
          content: `Generate interview questions for a ${level} ${position} position`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split questions and clean them up
    const questions = content
      .split('---QUESTION---')
      .map(question => question.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ questions }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate interview questions' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
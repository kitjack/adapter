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
    const { candidateName, relationship, purpose, achievements, tone, style } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a recommendation letter writer. Create a ${style} letter in a ${tone} tone following these guidelines:

1. Candidate: ${candidateName}
2. Relationship: ${relationship}
3. Purpose: ${purpose}
4. Achievements: ${achievements}
5. Include:
   - Professional greeting
   - Introduction and relationship context
   - Specific examples and achievements
   - Character assessment
   - Strong endorsement
   - Contact information offer
   - Professional closing
6. Keep it concise
7. Use specific examples
8. Show enthusiasm
9. Maintain professionalism
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a ${purpose} recommendation letter for ${candidateName}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const letter = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ letter }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating recommendation letter:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate recommendation letter' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
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
    const { topic, subject, format, complexity } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a study notes generator. Create comprehensive ${format} notes following these guidelines:

1. Format: ${format} style
2. Complexity: ${complexity} level
3. Subject area: ${subject}
4. Include:
   - Key concepts and definitions
   - Important points and examples
   - Relationships between ideas
   - Visual elements (ASCII diagrams if relevant)
5. Use clear formatting
6. Break down complex topics
7. Include mnemonics when helpful
8. Organize logically
9. Highlight important terms
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate study notes about: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const notes = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ notes }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating study notes:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate study notes' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
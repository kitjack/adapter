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
    const { topic, essayType, mainPoints, style } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an essay outline generator. Create a ${style} outline for a ${essayType} essay following these guidelines:

1. Include exactly ${mainPoints} main points
2. Create a clear structure with:
   - Introduction
   - Main body points (${mainPoints})
   - Conclusion
3. For each section include:
   - Main point
   - Supporting points
   - Potential evidence/examples
4. Use appropriate formatting
5. Keep points concise but informative
6. Ensure logical flow between sections
7. Include transition suggestions
8. Add brief notes for development
9. Maintain consistency throughout
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a ${essayType} essay outline about: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const outline = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ outline }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating essay outline:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate essay outline' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
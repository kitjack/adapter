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
    const { topic, researchType, approach, sampleSize, variables } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a research methodology expert. Create a ${researchType} methodology following these guidelines:

1. Topic: ${topic}
2. Research Type: ${researchType}
3. Approach: ${approach}
4. Sample: ${sampleSize}
5. Variables: ${variables}
6. Include:
   - Research design
   - Data collection methods
   - Analysis techniques
   - Sampling strategy
   - Ethical considerations
   - Limitations
   - Timeline
7. Be specific and detailed
8. Include justifications
9. Consider validity
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a research methodology for: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const methodology = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ methodology }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating methodology:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate methodology' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
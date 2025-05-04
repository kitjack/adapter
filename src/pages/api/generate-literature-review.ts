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
    const { topic, sources, style, focus } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a literature review writer. Create a ${focus} review following these guidelines:

1. Citation style: ${style}
2. Review focus: ${focus}
3. Include:
   - Introduction
   - Methodology
   - Analysis of sources
   - Synthesis of findings
   - Critical evaluation
   - Research gaps
   - Future directions
4. Use proper academic language
5. Maintain objective tone
6. Include proper citations
7. Synthesize information
8. Identify themes
9. Compare and contrast views
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a literature review about: ${topic}\n\nSources:\n${sources}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const review = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ review }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating literature review:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate literature review' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
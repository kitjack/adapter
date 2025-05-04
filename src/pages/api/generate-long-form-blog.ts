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
    const { title, keywords, tone, wordCount, sections } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional blog writer. Create a well-structured, engaging blog post following these guidelines:

1. Write in a ${tone} tone
2. Target approximately ${wordCount} words
3. Use the provided sections as headers
4. Include relevant keywords naturally: ${keywords}
5. Make content informative and valuable
6. Use proper formatting and spacing
7. Create engaging transitions between sections
8. Include a strong introduction and conclusion
9. Focus on readability and flow
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a blog post titled "${title}" with these sections:
${sections.join('\n')}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split content into sections and clean them up
    const blogSections = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ content: blogSections }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating blog post:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate blog post' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
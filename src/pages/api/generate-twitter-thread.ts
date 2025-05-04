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
    const { topic, variations, useEmojis } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a Twitter thread writer. Create exactly ${variations} engaging thread${variations > 1 ? 's' : ''} following these guidelines:

1. Each thread should have 5-7 tweets
2. Each tweet should be under 280 characters
3. Number each tweet (e.g., "1/", "2/", etc.)
4. Make content engaging and informative
5. Use appropriate line breaks between tweets
6. ${useEmojis ? 'Include relevant emojis naturally throughout the text' : 'Do not use any emojis'}
7. Return exactly ${variations} thread${variations > 1 ? 's' : ''}
8. Each thread must be a complete, standalone story
9. Separate threads with "---THREAD---"
10. Focus on providing value and insights`
        },
        {
          role: "user",
          content: `Generate ${variations} Twitter thread${variations > 1 ? 's' : ''} about: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split threads and clean them up
    const threads = content
      .split('---THREAD---')
      .map(thread => thread.trim())
      .filter(Boolean)
      .slice(0, variations); // Ensure we only return the requested number of variations

    return new Response(
      JSON.stringify({ threads }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating Twitter thread:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate Twitter thread' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
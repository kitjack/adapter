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
    const { imageDescription, keywords, tone, variations } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an Instagram caption writer. Create exactly ${variations} engaging caption${variations > 1 ? 's' : ''} following these guidelines:

1. Write in a ${tone} tone
2. Include relevant emojis naturally throughout the text
3. Include 3-5 relevant hashtags at the end
4. Keep each caption between 50-150 characters (not including hashtags)
5. Make it engaging and relatable
6. Use appropriate line breaks for readability
7. Return exactly ${variations} caption${variations > 1 ? 's' : ''}
8. Each caption must be a complete, standalone message
9. Separate captions with "---CAPTION---"
10. Consider the image description and keywords when crafting the caption`
        },
        {
          role: "user",
          content: `Generate ${variations} Instagram caption${variations > 1 ? 's' : ''} for an image with:
Description: ${imageDescription}
Keywords: ${keywords}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split captions and clean them up
    const captions = content
      .split('---CAPTION---')
      .map(caption => caption.trim())
      .filter(Boolean)
      .slice(0, variations); // Ensure we only return the requested number of variations

    return new Response(
      JSON.stringify({ captions }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating Instagram caption:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate Instagram caption' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
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
    const { topic, tone, variations, useEmojis } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a Facebook post writer. Create exactly ${variations} engaging post${variations > 1 ? 's' : ''} following these guidelines:

1. Write in a ${tone} tone
2. Keep each post between 100-300 words
3. Make content engaging and relatable
4. Use appropriate line breaks for readability
5. ${useEmojis 
    ? 'Include relevant emojis throughout the text to enhance engagement and emotional connection. Place emojis naturally where they add value, not after every word or sentence.' 
    : 'DO NOT use any emojis or emoticons in the text. Focus on expressing emotions and tone through words only.'}
6. Return exactly ${variations} post${variations > 1 ? 's' : ''}
7. Each post must be a complete, standalone message
8. Separate posts with "---POST---"
9. Include a call-to-action when relevant
10. Focus on encouraging engagement and discussion`
        },
        {
          role: "user",
          content: `Generate ${variations} Facebook post${variations > 1 ? 's' : ''} about: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split posts and clean them up
    const posts = content
      .split('---POST---')
      .map(post => post.trim())
      .filter(Boolean)
      .slice(0, variations); // Ensure we only return the requested number of variations

    return new Response(
      JSON.stringify({ posts }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating Facebook post:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate Facebook post' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
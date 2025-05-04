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
    const { topic, tone, variations } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a LinkedIn post writer. Create exactly ${variations} engaging, professional post${variations > 1 ? 's' : ''} following these guidelines:

1. Write in a ${tone} tone
2. Include relevant hashtags (2-3 max) at the end
3. Keep each post between 100-200 words
4. Focus on value and insights
5. Use appropriate line breaks for readability
6. Avoid clickbait or overly promotional language
7. Include a clear call-to-action when relevant
8. Return exactly ${variations} post${variations > 1 ? 's' : ''}
9. Each post must be a complete, standalone message
10. Separate posts with "---POST---"`
        },
        {
          role: "user",
          content: `Generate ${variations} LinkedIn post${variations > 1 ? 's' : ''} about: ${topic}`
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
    console.error('Error generating LinkedIn post:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate LinkedIn post' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
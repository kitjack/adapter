import type { APIRoute } from 'astro';
import OpenAI from 'openai';

// Get API key from environment variables with better error handling
const getApiKey = () => {
  const apiKey = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key is not configured');
    return null;
  }
  return apiKey;
};

export const POST: APIRoute = async ({ request }) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
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
    const { videoTitle, videoKeywords } = await request.json();

    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a YouTube description writer. Create concise, engaging descriptions following these rules:

1. Start with a brief 1-2 sentence hook about the video content
2. Add 3-4 relevant hashtags at the end
3. Include a simple call-to-action for subscribing
4. Keep the total length under 500 characters
5. Focus on natural, readable text (not overly SEO-stuffed)
6. Don't include:
   - Timestamps
   - Links
   - Channel promotions
   - Social media links
   - Lengthy explanations
   - Emojis or special characters
7. Use simple formatting with proper spacing between sections`
        },
        {
          role: "user",
          content: `Generate a YouTube description for a video titled: "${videoTitle}" with these keywords: ${videoKeywords}`
        }
      ],
      temperature: 0.7,
    });

    const description = completion.choices[0].message.content || '';

    return new Response(
      JSON.stringify({ description }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating description:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate description' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
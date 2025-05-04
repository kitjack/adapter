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
    const { topic, keywords, numberOfQuestions, tone } = await request.json();

    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a FAQ writer. Create exactly ${numberOfQuestions} Q&A pairs following these guidelines:

1. Write in a ${tone} tone
2. Focus on common questions about ${topic}
3. Include keywords naturally: ${keywords}
4. Make answers informative but concise
5. Format each Q&A pair clearly
6. Ensure answers are accurate and helpful
7. Return exactly ${numberOfQuestions} Q&A pairs
8. Separate each Q&A pair with "---QA---"
9. Start each question with "Q:" and each answer with "A:"
10. Focus on providing practical, actionable information`
        },
        {
          role: "user",
          content: `Generate ${numberOfQuestions} FAQ questions and answers about: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split FAQs and clean them up
    const faqs = content
      .split('---QA---')
      .map(faq => faq.trim())
      .filter(Boolean)
      .slice(0, numberOfQuestions); // Ensure we only return the requested number of FAQs

    return new Response(
      JSON.stringify({ faqs }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating FAQs:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate FAQs' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
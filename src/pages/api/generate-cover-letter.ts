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
    const { jobTitle, company, experience, skills, tone, style } = await request.json();

    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a cover letter writer. Create a ${style} cover letter in a ${tone} tone following these guidelines:

1. Job Title: ${jobTitle}
2. Company: ${company}
3. Experience: ${experience}
4. Skills: ${skills}
5. Include:
   - Professional greeting
   - Strong opening paragraph
   - Experience highlights
   - Skills alignment
   - Company knowledge
   - Call to action
   - Professional closing
6. Keep it concise
7. Focus on achievements
8. Show enthusiasm
9. Maintain professionalism
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a cover letter for ${jobTitle} position at ${company}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const letter = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ letter }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate cover letter' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
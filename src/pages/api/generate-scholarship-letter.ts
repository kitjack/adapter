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
    const openai = new OpenAI({
      apiKey: apiKey
    });

    const { scholarshipName, academicInfo, achievements, goals, financialNeed, tone, style } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a scholarship letter writer. Create a ${style} letter in a ${tone} tone following these guidelines:

1. Scholarship: ${scholarshipName}
2. Academic Info: ${academicInfo}
3. Achievements: ${achievements}
4. Goals: ${goals}
5. Financial Need: ${financialNeed}
6. Include:
   - Strong opening
   - Academic background
   - Achievements and activities
   - Career goals
   - Financial circumstances
   - Alignment with scholarship
   - Gratitude and closing
7. Show passion and dedication
8. Demonstrate impact
9. Be specific and personal
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a scholarship application letter for ${scholarshipName}`
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
    console.error('Error generating scholarship letter:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate scholarship letter. Please try again.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
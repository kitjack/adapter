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
    const { careerLevel, industry, experience, skills, style, focus } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a resume planning expert. Create a ${style} resume plan with a ${focus} focus following these guidelines:

1. Career Level: ${careerLevel}
2. Industry: ${industry}
3. Experience: ${experience}
4. Skills: ${skills}
5. Include sections for:
   - Contact information
   - Professional summary
   - Work experience
   - Skills and competencies
   - Education and certifications
   - Additional sections
6. Provide content suggestions
7. Include formatting tips
8. Suggest keywords
9. Add achievement examples
10. Separate sections with "---SECTION---"`
        },
        {
          role: "user",
          content: `Generate a resume plan for a ${careerLevel} position in ${industry}`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    
    // Split sections and clean them up
    const plan = content
      .split('---SECTION---')
      .map(section => section.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ plan }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating resume plan:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate resume plan' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
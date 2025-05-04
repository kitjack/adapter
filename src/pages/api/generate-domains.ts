import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
});

const cleanDomainSuggestion = (text: string): string[] => {
  // Split by newlines and clean each line
  return text
    ?.split('\n')
    .map(line => line.trim())
    // Remove numbering (e.g., "1.", "2.", etc.)
    .map(line => line.replace(/^\d+\.\s*/, ''))
    // Remove bullet points
    .map(line => line.replace(/^[-•*]\s*/, ''))
    // Remove any explanatory text
    .filter(line => line.includes('.'))
    // Remove any remaining text that doesn't look like a domain
    .map(line => {
      const domainMatch = line.match(/[\w-]+\.[a-z]{2,}/i);
      return domainMatch ? domainMatch[0] : '';
    })
    // Remove empty lines
    .filter(Boolean)
    // Take only the first 5 results
    .slice(0, 5);
};

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
    const { businessName } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a domain name generator. Generate domain names in the format: domain.tld - one per line, no numbering or explanation. Mix of .com, .io, .co, and other TLDs. Keep names short and memorable."
        },
        {
          role: "user",
          content: `Generate domain names for: ${businessName}`
        }
      ],
      temperature: 0.7,
    });

    const suggestions = cleanDomainSuggestion(completion.choices[0].message.content || '');

    return new Response(
      JSON.stringify({ domains: suggestions }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating domains:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate domains' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
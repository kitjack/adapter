import React from 'react';

interface Tool {
  name: string;
  description: string;
  href: string;
  isFree?: boolean;
}

interface SimilarToolsProps {
  currentToolPath: string;
  category?: 'social-media' | 'writing' | 'student' | 'career';
}

const SimilarTools: React.FC<SimilarToolsProps> = ({ currentToolPath, category = 'social-media' }) => {
  let tools: Tool[] = [];
  let heading = "Ready to Transform Your Social Media Strategy?";
  let description = "Start creating engaging, platform-optimized content in seconds with our free AI social media tools. No registration, no credit card, no limits.";
  
  // Social Media Tools
  if (category === 'social-media') {
    tools = [
      {
        name: "YouTube Description Generator",
        description: "Create engaging, SEO-optimized YouTube video descriptions with AI. Boost your video's visibility and engagement.",
        href: "/tools/youtube-description",
        isFree: true
      },
      {
        name: "Instagram Caption Generator",
        description: "Create engaging Instagram captions that capture attention and drive engagement. Generate multiple variations with different tones.",
        href: "/tools/instagram-caption",
        isFree: true
      },
      {
        name: "LinkedIn Post Generator",
        description: "Create professional and engaging LinkedIn posts that showcase your expertise and drive meaningful engagement.",
        href: "/tools/linkedin-post",
        isFree: true
      },
      {
        name: "Twitter Thread Generator",
        description: "Create engaging Twitter threads that captivate your audience. Generate multiple variations with customizable options.",
        href: "/tools/twitter-thread",
        isFree: true
      },
      {
        name: "Facebook Post Generator",
        description: "Create engaging Facebook posts that drive engagement and spark conversations.",
        href: "/tools/facebook-post",
        isFree: true
      }
    ];
  }
  // Writing Tools
  else if (category === 'writing') {
    heading = "Ready to Supercharge Your Content Creation?";
    description = "Create professional-quality content in seconds with our free AI writing tools. Generate articles, blog posts, product descriptions, and more—completely free.";
    
    tools = [
      {
        name: "Article Rewriter",
        description: "Transform existing content with fresh phrasing while preserving meaning. Generate unique variations of your articles.",
        href: "/tools/article-rewriter",
        isFree: true
      },
      {
        name: "Long Form Blog Generator",
        description: "Create comprehensive, SEO-friendly blog posts with custom sections. Generate engaging long-form content that ranks.",
        href: "/tools/long-form-blog",
        isFree: true
      },
      {
        name: "Product Description Generator",
        description: "Create compelling product descriptions that convert browsers to buyers. Generate persuasive copy that highlights key features and benefits.",
        href: "/tools/product-description",
        isFree: true
      },
      {
        name: "Blog FAQ Generator",
        description: "Generate question-and-answer sections to boost SEO and user engagement. Create comprehensive FAQs that address user queries.",
        href: "/tools/blog-faq",
        isFree: true
      },
      {
        name: "Listicle Generator",
        description: "Create engaging, formatted list-style article content. Generate compelling listicles that capture reader attention.",
        href: "/tools/listicle",
        isFree: true
      },
      {
        name: "Pros and Cons Generator",
        description: "Create balanced argument sections for blog posts and reviews. Generate comprehensive pros and cons lists for any topic.",
        href: "/tools/pros-and-cons",
        isFree: true
      },
      {
        name: "Product Review Generator",
        description: "Create balanced, informative product reviews for any item. Generate comprehensive reviews that help users make informed decisions.",
        href: "/tools/product-review",
        isFree: true
      },
      {
        name: "Quora Answer Generator",
        description: "Create informative, helpful answers for Quora questions. Generate well-researched responses that provide value to readers.",
        href: "/tools/quora-answer",
        isFree: true
      },
      {
        name: "Domain Name Generator",
        description: "Generate creative and available domain names for your business using AI. Get instant suggestions that match your brand.",
        href: "/tools/domain-generator",
        isFree: true
      }
    ];
  }
  // Student Tools
  else if (category === 'student') {
    heading = "Ready to Excel in Your Studies?";
    description = "Boost your academic performance with our free AI student tools. Generate essays, solve math problems, create study notes, and more—all completely free.";
    
    tools = [
      {
        name: "Essay Outline Generator",
        description: "Create structured essay outlines with customizable sections and detailed points. Generate comprehensive outlines for any topic.",
        href: "/tools/essay-outline",
        isFree: true
      },
      {
        name: "Math Answer Generator",
        description: "Get step-by-step solutions for math problems. Understand the process and learn as you solve.",
        href: "/tools/math-answer",
        isFree: true
      },
      {
        name: "Study Notes Generator",
        description: "Transform complex topics into clear, organized study notes. Generate comprehensive summaries and key points for better learning.",
        href: "/tools/study-notes",
        isFree: true
      },
      {
        name: "APA Reference Generator",
        description: "Generate accurate APA style references for any source. Create properly formatted citations with ease.",
        href: "/tools/apa-reference",
        isFree: true
      },
      {
        name: "Literature Review Generator",
        description: "Create comprehensive literature reviews with proper citations and analysis. Generate structured academic reviews.",
        href: "/tools/literature-review",
        isFree: true
      },
      {
        name: "Project Topic Generator",
        description: "Generate unique and innovative project ideas for any field. Get detailed project topics with scope and objectives.",
        href: "/tools/project-topic",
        isFree: true
      },
      {
        name: "Research Methodology Generator",
        description: "Create comprehensive research methodologies for your academic projects. Generate detailed research designs and methods.",
        href: "/tools/research-methodology",
        isFree: true
      },
      {
        name: "Riddles Answer Generator",
        description: "Get answers and explanations for any riddle. Understand the wordplay and logic behind each solution.",
        href: "/tools/riddles-answer",
        isFree: true
      }
    ];
  }
  // Career Tools
  else if (category === 'career') {
    heading = "Ready to Advance Your Career?";
    description = "Create professional career documents and prepare for interviews with our free AI career tools. No registration, no credit card, no limits.";
    
    tools = [
      {
        name: "Cover Letter Generator",
        description: "Create professional, tailored cover letters that highlight your qualifications and stand out to employers.",
        href: "/tools/cover-letter",
        isFree: true
      },
      {
        name: "Resume Plan Generator",
        description: "Create a structured plan for your resume. Get section-by-section guidance and content suggestions.",
        href: "/tools/resume-plan",
        isFree: true
      },
      {
        name: "Interview Questions Generator",
        description: "Generate tailored interview questions for any position. Get comprehensive questions with suggested answers.",
        href: "/tools/interview-questions",
        isFree: true
      },
      {
        name: "Recommendation Letter Generator",
        description: "Create professional recommendation letters that highlight achievements and potential. Generate personalized letters for any purpose.",
        href: "/tools/recommendation-letter",
        isFree: true
      },
      {
        name: "Scholarship Letter Generator",
        description: "Create compelling scholarship application letters that showcase your achievements and aspirations. Generate personalized letters for any scholarship.",
        href: "/tools/scholarship-letter",
        isFree: true
      }
    ];
  }

  // Filter out the current tool
  const filteredTools = tools.filter(tool => !tool.href.includes(currentToolPath));

  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="bg-indigo-50 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{heading}</h2>
        <p className="text-center text-gray-600 mb-8">
          {description}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {filteredTools.map((tool, index) => (
            <a 
              key={index}
              href={tool.href} 
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition shadow-md"
            >
              Try {tool.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarTools;
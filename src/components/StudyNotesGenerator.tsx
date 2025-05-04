import { useState, useEffect } from 'react';

export default function StudyNotesGenerator() {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [format, setFormat] = useState('outline');
  const [complexity, setComplexity] = useState('intermediate');
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    let timer: number;
    if (copied) {
      timer = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-study-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic,
          subject,
          format,
          complexity
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate study notes');
      }
      
      const data = await response.json();
      setNotes(data.notes);
      setCooldown(15);
    } catch (err) {
      setError('Failed to generate study notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const content = notes.join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.slice(0, 30)}-study-notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notes.join('\n\n'));
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy notes:', err);
    }
  };

  const handleClearResults = () => {
    setNotes([]);
    setTopic('');
    setSubject('');
    setFormat('outline');
    setComplexity('intermediate');
  };

  const categories = [
    { name: 'All Tools', count: 229, icon: 'grid' },
    { name: 'Content Generation', count: 170, icon: 'document' },
    { name: 'Social Media Tools', count: 44, icon: 'chat' },
    { name: 'Marketing & SEO', count: 40, icon: 'megaphone' },
    { name: 'Writing Enhancement', count: 36, icon: 'pen' },
  ];

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generate Your Study Notes</h2>
              <p className="text-gray-600">Create organized, comprehensive study notes for any topic</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  placeholder="Enter your study topic"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm text-gray-700 mb-2">
                  Subject Area
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  placeholder="e.g., Biology, History, Mathematics"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="format" className="block text-sm text-gray-700 mb-2">
                    Note Format
                  </label>
                  <select
                    id="format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  >
                    <option value="outline">Outline</option>
                    <option value="summary">Summary</option>
                    <option value="flashcards">Flashcards</option>
                    <option value="mindmap">Mind Map</option>
                    <option value="cornell">Cornell Notes</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="complexity" className="block text-sm text-gray-700 mb-2">
                    Complexity Level
                  </label>
                  <select
                    id="complexity"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="relative w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating notes...</span>
                  </div>
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s to generate again`
                ) : (
                  'Generate Notes'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {notes.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Generated Notes
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {copied ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        )}
                      </svg>
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={handleClearResults}
                      className="px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  {notes.map((section, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div className="text-gray-900 whitespace-pre-wrap">{section}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories Sidebar */}
      <div className="w-[500px]">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Tools Categories</h2>
          <p className="text-gray-600 mb-8">Browse all AI tools by category</p>
          
          <div className="space-y-3">
            {categories.map((category, index) => (
              <a
                key={index}
                href={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-500 group-hover:bg-purple-500/5 transition">
                    {getCategoryIcon(category.icon)}
                  </div>
                  <span className="text-gray-900">{category.name}</span>
                </div>
                <span className="text-sm text-purple-500 bg-white px-3 py-1 rounded-lg">
                  {category.count}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(type: string) {
  switch (type) {
    case 'grid':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'document':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'chat':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case 'pen':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    default:
      return null;
  }
}
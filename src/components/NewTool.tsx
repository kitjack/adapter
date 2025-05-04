import { useState, useEffect } from 'react';

export default function NewTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [copied, setCopied] = useState(false);

  // Cooldown timer
  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Copy feedback timer
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
      const response = await fetch('/api/your-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process request');
      }
      
      const data = await response.json();
      setOutput(data.result.split('\n').filter(Boolean));
      setCooldown(15);
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const content = output.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output.join('\n'));
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClearResults = () => {
    setOutput([]);
    setInput('');
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Tool Title</h2>
              <p className="text-gray-600">Tool description goes here</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="input" className="block text-sm text-gray-700 mb-2">
                  Input Label
                </label>
                <input
                  type="text"
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-astro-blue focus:ring-2 focus:ring-astro-blue/20 transition"
                  placeholder="Enter your input"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="relative w-full bg-astro-blue text-white py-4 px-6 rounded-xl hover:bg-astro-blue/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s to generate again`
                ) : (
                  'Process'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {output.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Results
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
                <div className="space-y-2">
                  {output.map((line, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                    >
                      <span className="text-gray-900">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
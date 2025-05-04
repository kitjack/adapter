import { useState, useEffect, useRef } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toolCategories = [
    {
      title: "Social Media Tools",
      href: "/tools/social-media",
      items: [
        { name: "YouTube Description Generator", href: "/tools/youtube-description" },
        { name: "LinkedIn Post Generator", href: "/tools/linkedin-post" },
        { name: "Instagram Caption Generator", href: "/tools/instagram-caption" },
        { name: "Twitter Thread Generator", href: "/tools/twitter-thread" },
        { name: "Facebook Post Generator", href: "/tools/facebook-post" }
      ]
    },
    {
      title: "Writing Tools",
      href: "/tools/writing",
      items: [
        { name: "Article Rewriter", href: "/tools/article-rewriter" },
        { name: "Long Form Blog Generator", href: "/tools/long-form-blog" },
        { name: "Product Description Generator", href: "/tools/product-description" },
        { name: "Blog FAQ Generator", href: "/tools/blog-faq" },
        { name: "Listicle Generator", href: "/tools/listicle" }
      ]
    },
    {
      title: "Student Tools",
      href: "/tools/student",
      items: [
        { name: "Essay Outline Generator", href: "/tools/essay-outline" },
        { name: "Math Answer Generator", href: "/tools/math-answer" },
        { name: "Study Notes Generator", href: "/tools/study-notes" },
        { name: "APA Reference Generator", href: "/tools/apa-reference" },
        { name: "Project Topic Generator", href: "/tools/project-topic" }
      ]
    },
    {
      title: "Career Tools",
      href: "/tools/career",
      items: [
        { name: "Cover Letter Generator", href: "/tools/cover-letter" },
        { name: "Resume Plan Generator", href: "/tools/resume-plan" },
        { name: "Interview Questions Generator", href: "/tools/interview-questions" },
        { name: "Recommendation Letter Generator", href: "/tools/recommendation-letter" }
      ]
    },
    {
      title: "Etsy Seller Tools",
      href: "/tools/etsy",
      items: [
        { name: "Etsy Product Description Generator", href: "/tools/etsy-product-description" },
        { name: "Etsy Tag Generator", href: "/tools/etsy-tag-generator" },
        { name: "Etsy Shop Name Generator", href: "/tools/etsy-shop-name-generator" },
        { name: "Etsy Title Generator", href: "/tools/etsy-title-generator" }
      ]
    },
    {
      title: "YouTube Tools",
      href: "/tools/youtube",
      items: [
        { name: "YouTube Description Generator", href: "/tools/youtube-description" },
        { name: "YouTube Tag Generator", href: "/tools/youtube-tag-generator" },
        { name: "YouTube Title Generator", href: "/tools/youtube-title-generator" },
        { name: "YouTube Script Generator", href: "/tools/youtube-script-generator" }
      ]
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-8 h-8 text-orange-500"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <rect width="7" height="5" x="7" y="7" rx="1" />
                <rect width="7" height="5" x="10" y="12" rx="1" />
              </svg>
              <span>AI-Free-Forever</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative dropdown-container" ref={dropdownRef}>
              <button 
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition flex items-center gap-1"
                aria-expanded={isToolsDropdownOpen}
                aria-haspopup="true"
              >
                Top Tools
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isToolsDropdownOpen && (
                <div className="absolute left-0 w-screen bg-white shadow-lg z-50 border-t border-gray-100" style={{ top: "100%", left: "50%", transform: "translateX(-50%)" }}>
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
                      {toolCategories.map((category, idx) => (
                        <div key={idx} className="space-y-4">
                          <a href={category.href} className="block text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">
                            {category.title}
                          </a>
                          <ul className="space-y-2">
                            {category.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <a 
                                  href={item.href}
                                  className="block text-gray-600 hover:text-indigo-600 transition py-1"
                                >
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                          <a href={category.href} className="block text-sm text-indigo-500 hover:text-indigo-600 transition">
                            View all →
                          </a>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                      <a 
                        href="/tools" 
                        className="text-indigo-500 hover:text-indigo-600 transition font-medium inline-flex items-center gap-1"
                      >
                        Browse all AI tools
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <a href="/blog" className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Blog</a>
            <a href="/about" className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">About</a>
            <a href="/contact" className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Contact</a>
            <a href="/privacy" className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Privacy</a>
            <a href="/terms" className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Terms</a>
            <div className="pl-2 flex items-center space-x-2">
              <a href="http://youtube.com/@aifreeforever" className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition shadow-sm">Youtube Tutorials</a>
              <a href="/contact" className="px-4 py-2 text-orange-500 bg-white border border-orange-500 rounded-lg hover:bg-orange-50 transition">Suggest a tool</a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded-lg p-2"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-2 space-y-1">
              <div>
                <button
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
                  aria-expanded={isToolsDropdownOpen}
                >
                  <span>Top Tools</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isToolsDropdownOpen && (
                  <div className="mt-2 space-y-2 pl-4">
                    {toolCategories.map((category, idx) => (
                      <div key={idx} className="py-2">
                        <a href={category.href} className="block font-medium text-gray-900 hover:text-indigo-600 transition">
                          {category.title}
                        </a>
                        <ul className="mt-1 space-y-1 pl-4">
                          {category.items.slice(0, 3).map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <a 
                                href={item.href}
                                className="block text-sm text-gray-600 hover:text-indigo-600 transition py-1"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                          {category.items.length > 3 && (
                            <li>
                              <a href={category.href} className="block text-sm text-indigo-500 hover:text-indigo-600 transition py-1">
                                View all {category.items.length} tools →
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                    <a href="/tools" className="block px-3 py-2 text-indigo-500 hover:text-indigo-600 transition font-medium">
                      Browse all AI tools →
                    </a>
                  </div>
                )}
              </div>
              <a href="/blog" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Blog</a>
              <a href="/about" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">About</a>
              <a href="/contact" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Contact</a>
              <a href="/privacy" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Privacy</a>
              <a href="/terms" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">Terms</a>
              <div className="pt-2 space-y-1">
                <a href="http://youtube.com/@aifreeforever" className="block px-3 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition shadow-sm">Youtube Tutorials</a>
                <a href="/contact" className="block px-3 py-2 text-orange-500 bg-white border border-orange-500 rounded-lg hover:bg-orange-50 transition">Suggest a tool</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
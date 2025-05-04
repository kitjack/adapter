import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F1C] py-16 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Social Media Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Social Media Tools</h3>
            <ul className="space-y-2">
              <li><a href="/tools/youtube-description" className="text-gray-400 hover:text-white transition">YT Description</a></li>
              <li><a href="/tools/linkedin-post" className="text-gray-400 hover:text-white transition">LinkedIn Post</a></li>
              <li><a href="/tools/instagram-caption" className="text-gray-400 hover:text-white transition">IG Caption</a></li>
              <li><a href="/tools/twitter-thread" className="text-gray-400 hover:text-white transition">Twitter Thread</a></li>
              <li><a href="/tools/facebook-post" className="text-gray-400 hover:text-white transition">FB Post</a></li>
            </ul>
          </div>

          {/* Student Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Student Tools</h3>
            <ul className="space-y-2">
              <li><a href="/tools/essay-outline" className="text-gray-400 hover:text-white transition">Essay Outline</a></li>
              <li><a href="/tools/math-answer" className="text-gray-400 hover:text-white transition">Math Solver</a></li>
              <li><a href="/tools/study-notes" className="text-gray-400 hover:text-white transition">Notes Summary</a></li>
              <li><a href="/tools/apa-reference" className="text-gray-400 hover:text-white transition">APA Citation</a></li>
              <li><a href="/tools/project-topic" className="text-gray-400 hover:text-white transition">Project Ideas</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white transition">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white transition">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-12 border-t border-gray-800">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>All services are online</span>
            </div>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="/terms" className="text-sm text-gray-400 hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
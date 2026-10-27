import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUp, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setLanguage } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f0f4f9] border-t border-[#dadce0] py-10 text-xs text-[#5f6368]">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#dadce0]">
          {/* Brand Lockup */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]" />
            </div>
            <span className="text-sm font-semibold text-[#1f1f1f]">
              TM3 Martial Arts Academy & TM Sports
            </span>
            <span className="text-slate-400">·</span>
            <span>Discipline & Determination — Est. 2000</span>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#444746]">
            <a href="#services" className="hover:text-[#1a73e8] transition-colors">
              Programs
            </a>
            <a href="#schedule" className="hover:text-[#1a73e8] transition-colors">
              Schedule
            </a>
            <a href="#announcements" className="hover:text-[#1a73e8] transition-colors">
              News
            </a>
            <a href="#about" className="hover:text-[#1a73e8] transition-colors">
              Instructors & Pricing
            </a>
            <a href="#contact" className="hover:text-[#1a73e8] transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Bottom row: Terms & Email */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#747775]">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 TM3 Martial Arts Academy. All rights reserved.</span>
            <span>tm3martialartsacademy@gmail.com</span>
            <span>Monthly $80 · Quarterly $220 · Annual $800</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1 text-[#444746] hover:text-[#1a73e8] transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Language: {language === 'en' ? 'English (US)' : 'Français (CA)'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full bg-[#ffffff] border border-[#dadce0] hover:bg-[#e0e2ec] text-[#5f6368] transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

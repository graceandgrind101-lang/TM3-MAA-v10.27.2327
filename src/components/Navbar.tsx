import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Grid, HelpCircle, User, Sparkles, ChevronDown, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { role, setRole, setIsRegistrationOpen, setIsSearchOpen, activeMember, language, theme, toggleTheme } = useApp();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', labelEn: 'Overview', labelFr: 'Aperçu' },
    { id: 'services', labelEn: 'Disciplines', labelFr: 'Disciplines' },
    { id: 'schedule', labelEn: 'Schedule', labelFr: 'Planning' },
    { id: 'calendar', labelEn: 'Tournaments & Calendar', labelFr: 'Tournois & Calendrier' },
    { id: 'announcements', labelEn: 'Stream', labelFr: 'Annonces' },
    { id: 'about', labelEn: 'About', labelFr: 'À Propos' },
    { id: 'contact', labelEn: 'Facility', labelFr: 'Centre' }
  ];

  const getProfileInitials = () => {
    if (role === 'admin') return 'MV';
    if (role === 'member') return 'AR';
    if (role === 'pending') return 'SL';
    return 'G';
  };

  const getProfileBg = () => {
    if (role === 'admin') return 'bg-[#ea4335] text-white';
    if (role === 'member') return 'bg-[#1a73e8] text-white';
    if (role === 'pending') return 'bg-[#fbbc04] text-[#202124]';
    return 'bg-[#5f6368] text-white';
  };

  return (
    <header className="bg-[#ffffff] border-b border-[#e0e2ec] sticky top-[41px] z-40 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand Lockup */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 group whitespace-nowrap shrink-0 text-left"
        >
          {/* Multi-Color Emblem */}
          <div className="w-9 h-9 rounded-xl bg-[#f0f4f9] border border-[#dadce0] p-1.5 flex items-center justify-center shadow-xs group-hover:bg-[#e8f0fe] transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"
                fill="#1a73e8"
              />
              <circle cx="18" cy="6" r="3" fill="#ea4335" />
              <circle cx="6" cy="18" r="3" fill="#34a853" />
              <circle cx="6" cy="6" r="2.5" fill="#fbbc04" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[18px] font-medium tracking-tight text-[#1f1f1f]">
                TM Sports
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                TM3
              </span>
            </div>
            <span className="text-[10px] text-[#747775] -mt-0.5">Martial Arts & Fitness</span>
          </div>
        </button>

        {/* Center: Search Pill (Ctrl + K) */}
        <div className="flex-1 max-w-xs xl:max-w-sm items-center relative">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between gap-2 bg-[#f0f4f9] hover:bg-[#e9eef6] border border-[#dadce0]/60 rounded-full px-3.5 py-1.5 transition-all cursor-pointer text-left group shadow-2xs hover:shadow-xs"
            title="Quick Search (Ctrl + K)"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Search className="w-3.5 h-3.5 text-[#5f6368] group-hover:text-[#1a73e8] shrink-0 transition-colors" />
              <span className="text-xs text-[#5f6368] truncate">
                {language === 'en'
                  ? 'Search classes, programs, news...'
                  : 'Rechercher cours, programmes...'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono text-[#5f6368] bg-[#ffffff] border border-[#dadce0] px-2 py-0.5 rounded-full shadow-2xs">
              <kbd className="hidden sm:inline">Ctrl+K</kbd>
              <kbd className="sm:hidden">⌘K</kbd>
            </div>
          </button>
        </div>

        {/* Right: Nav Links & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <nav className="hidden xl:flex items-center gap-0.5 text-xs font-medium text-[#444746] mr-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#e8f0fe] text-[#1a73e8] font-semibold'
                      : 'hover:bg-[#f1f3f4] hover:text-[#1f1f1f]'
                  }`}
                >
                  {language === 'en' ? link.labelEn : link.labelFr}
                </button>
              );
            })}
          </nav>

          {/* Primary Action Button (Google Pill Button) */}
          {role === 'visitor' && (
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full shadow-xs hover:shadow-md transition-all whitespace-nowrap"
            >
              {language === 'en' ? 'Get Started' : 'Commencer'}
            </button>
          )}

          {role === 'member' && (
            <button
              onClick={() => setCurrentTab('member-portal')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                currentTab === 'member-portal'
                  ? 'bg-[#d3e3fd] text-[#041e49] font-semibold'
                  : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-xs'
              }`}
            >
              {language === 'en' ? 'Member Portal' : 'Portail Membre'}
            </button>
          )}

          {role === 'pending' && (
            <button
              onClick={() => setCurrentTab('member-portal')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                currentTab === 'member-portal'
                  ? 'bg-[#feefc3] text-[#b06000] font-semibold'
                  : 'bg-[#fbbc04] hover:bg-[#f9ab00] text-[#202124] shadow-xs'
              }`}
            >
              {language === 'en' ? 'Application Status' : 'Statut Inscription'}
            </button>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin-panel')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                currentTab === 'admin-panel'
                  ? 'bg-[#fce8e6] text-[#c5221f] font-semibold'
                  : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-xs'
              }`}
            >
              {language === 'en' ? 'Admin Console' : 'Console Admin'}
            </button>
          )}

          {/* VS Code Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1f1f1f] transition-colors"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to VS Code Dark Theme'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#fbbc04]" />
            ) : (
              <Moon className="w-4 h-4 text-[#5f6368]" />
            )}
          </button>

          {/* Google App Grid Icon (9 Dots) */}
          <button
            onClick={() => setCurrentTab('services')}
            className="p-2 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1f1f1f] transition-colors"
            title="Google Apps · TM Sports Suite"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Google User Avatar Circle */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-[#e0e2ec] hover:ring-[#1a73e8] transition-all shadow-xs ${getProfileBg()}`}
              title="Google Account"
            >
              {getProfileInitials()}
            </button>

            {/* Google Profile Dropdown Card */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#ffffff] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-[#dadce0] p-4 z-50 text-xs text-[#1f1f1f] space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-[#e0e2ec]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getProfileBg()}`}
                  >
                    {getProfileInitials()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-semibold text-sm truncate">
                      {role === 'admin'
                        ? 'Coach Marcus Vance'
                        : role === 'member'
                        ? 'Alex Rivers'
                        : role === 'pending'
                        ? 'Sarah Lin'
                        : 'Public Guest'}
                    </div>
                    <div className="text-[11px] text-[#5f6368] truncate">
                      {role === 'admin'
                        ? 'admin@tmsportsclub.com'
                        : role === 'member'
                        ? 'alex.rivers@tmsports.org'
                        : role === 'pending'
                        ? 'sarah.lin@tmsports.org'
                        : 'visitor@guest.local'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-[#444746]">
                  <button
                    onClick={() => {
                      setCurrentTab(role === 'admin' ? 'admin-panel' : 'member-portal');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#f1f3f4] transition-colors"
                  >
                    {role === 'admin' ? 'Open Admin Console' : 'Manage TM Sports Account'}
                  </button>
                  <button
                    onClick={() => {
                      setIsRegistrationOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#f1f3f4] transition-colors"
                  >
                    Register New Program
                  </button>
                </div>

                <div className="pt-2 border-t border-[#e0e2ec] flex justify-between items-center text-[11px] text-[#747775]">
                  <span>Privacy · Terms</span>
                  <button
                    onClick={() => {
                      setRole('visitor');
                      setCurrentTab('home');
                      setIsProfileMenuOpen(false);
                    }}
                    className="text-[#1a73e8] hover:underline font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

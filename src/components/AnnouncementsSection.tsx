import React from 'react';
import { useApp } from '../context/AppContext';
import { Pin, MessageSquare, KeyRound } from 'lucide-react';

export const AnnouncementsSection: React.FC = () => {
  const { announcements, setIsTelegramOpen, setIsRegistrationOpen, language } = useApp();

  return (
    <section id="announcements" className="scroll-mt-24 py-20 bg-[#f8fafd] border-b border-[#e0e2ec]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-medium text-[#1a73e8] uppercase tracking-wider mb-1">
              TM3 Academy News & Updates
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
              Club <span className="font-semibold text-[#1a73e8]">announcements</span>
            </h2>
            <p className="text-[#5f6368] text-sm mt-1 max-w-lg font-normal">
              {language === 'en'
                ? 'Official updates from Master Mulatu Biru, Pro Shop uniform restocks, 4-digit PIN profile claiming, and belt promotion dates.'
                : 'Annonces officielles de Master Mulatu Biru, boutique Pro Shop, réclamation de profil par PIN à 4 chiffres et examens de ceintures.'}
            </p>
          </div>
          <button
            onClick={() => setIsRegistrationOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#ffffff] hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#dadce0] text-xs font-medium shadow-2xs transition-colors self-start md:self-auto"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#f29900]" />
            <span>Claim Member Profile with 4-Digit PIN</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((ann) => {
            const initials = ann.author
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={ann.id}
                className={`p-6 rounded-2xl border transition-all ${
                  ann.pinned
                    ? 'bg-[#ffffff] border-[#1a73e8]/30 shadow-[0_2px_12px_rgba(26,115,232,0.08)]'
                    : 'bg-[#ffffff] border-[#e0e2ec] hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold text-xs flex items-center justify-center">
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1f1f1f]">{ann.author}</div>
                      <div className="text-[11px] text-[#747775]">{ann.date} · {ann.category}</div>
                    </div>
                  </div>

                  {ann.pinned && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#b06000] bg-[#feefc3] px-2.5 py-0.5 rounded-full">
                      <Pin className="w-3 h-3 fill-[#b06000]" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-[#1f1f1f] mb-2 leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs text-[#444746] leading-relaxed mb-4">
                  {ann.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#f1f3f4] text-xs text-[#5f6368]">
                  <span className="text-[11px]">Visible to all active athletes</span>
                  <button
                    type="button"
                    onClick={() => setIsTelegramOpen(true)}
                    className="flex items-center gap-1 text-[#1a73e8] hover:underline cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discussion (Telegram bot)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

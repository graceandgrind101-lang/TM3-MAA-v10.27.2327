import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Calendar, CheckCircle2, KeyRound } from 'lucide-react';
import heroImg from '../assets/images/hero_athletic_training_1793107474900.jpg';

interface HeroProps {
  onExploreServices: () => void;
  onViewSchedule: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onViewSchedule }) => {
  const { setIsRegistrationOpen, members, classes, language } = useApp();

  const activeCount = members.filter((m) => m.status === 'active').length;

  return (
    <section className="bg-[#f8fafd] border-b border-[#e0e2ec] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f0fe] border border-[#d2e3fc] text-xs font-medium text-[#1a73e8]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbc04]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]" />
              </div>
              <span>TM3 Martial Arts Academy · Discipline & Determination — Est. 2000</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1f1f1f] leading-[1.12]">
              Forge your strength with{' '}
              <span className="font-semibold text-[#1a73e8]">TM3 Martial Arts</span> &{' '}
              <span className="font-semibold text-[#1f1f1f]">TM Sports</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#444746] leading-relaxed max-w-xl font-normal">
              {language === 'en'
                ? 'Taekwondo, Group Workout Sessions, and Cultural Dance classes for all ages. Build discipline, power, and community with Master Mulatu Biru, Instructor Derege, and our certified coaching team.'
                : 'Taekwondo, entraînements de groupe et cours de danse culturelle pour tous les âges. Développez discipline, puissance et esprit d’équipe.'}
            </p>

            {/* Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsRegistrationOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium shadow-xs hover:shadow-md transition-all whitespace-nowrap"
              >
                <span>{language === 'en' ? 'Join / Register' : 'Rejoindre le Club'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsRegistrationOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#ffffff] hover:bg-[#f1f3f4] text-[#1a73e8] border border-[#dadce0] text-sm font-medium transition-colors whitespace-nowrap"
              >
                <KeyRound className="w-4 h-4 text-[#f29900]" />
                <span>{language === 'en' ? 'Claim Profile (4-Digit PIN)' : 'Réclamer Profil (PIN)'}</span>
              </button>

              <button
                onClick={onViewSchedule}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full text-xs font-medium text-[#444746] hover:text-[#1f1f1f] hover:bg-[#eef2fa] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#1a73e8]" />
                <span>{language === 'en' ? 'View Schedule' : 'Consulter l’Horaire'}</span>
              </button>
            </div>

            {/* Trust checks */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-[#5f6368]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                <span>Taekwondo & Belt Progression (Est. 2000)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                <span>Group Workouts (6 AM · 9 AM · 6:30 PM)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                <span>Dancing Classes (M/W/F or T/Th/Sat)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Media Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-[#ffffff] border border-[#dadce0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-2">
              <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96">
                <img
                  src={heroImg}
                  alt="TM3 Martial Arts Academy & TM Sports facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 bg-black/50 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="text-xs font-medium text-[#c4eed0] flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#34a853]" />
                      <span>Discipline & Determination — Est. 2000</span>
                    </div>
                    <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
                      $80/mo · $220/qtr · $800/yr
                    </span>
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    TM3 Martial Arts Academy · Master Mulatu Biru & Instructor Derege
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Academy Heritage</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]" />
            </div>
            <div className="text-3xl font-normal text-[#1f1f1f] font-mono tabular-nums">Est. 2000</div>
            <div className="text-[11px] text-[#747775] mt-1">TM3 Martial Arts Academy</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Active Athletes</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]" />
            </div>
            <div className="text-3xl font-normal text-[#34a853] font-mono tabular-nums">{activeCount}+</div>
            <div className="text-[11px] text-[#747775] mt-1">Registered club members</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Weekly Classes</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" />
            </div>
            <div className="text-3xl font-normal text-[#1f1f1f] font-mono tabular-nums">{classes.length}</div>
            <div className="text-[11px] text-[#747775] mt-1">Workouts, Dance & Taekwondo</div>
          </div>

          <div className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368]">Membership Dues</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" />
            </div>
            <div className="text-3xl font-normal text-[#1f1f1f] font-mono tabular-nums">$80<span className="text-sm text-[#5f6368]">/mo</span></div>
            <div className="text-[11px] text-[#747775] mt-1">$220 Quarterly · $800 Annual</div>
          </div>
        </div>
      </div>
    </section>
  );
};

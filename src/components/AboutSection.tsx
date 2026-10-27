import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Target, HeartHandshake, Award, ShoppingBag, CreditCard, Users } from 'lucide-react';
import coachMarcusImg from '../assets/images/avatar_coach_marcus_1793107476857.jpg';
import taekwondoImg from '../assets/images/service_taekwondo_kids_1793107475549.jpg';
import aerobicsImg from '../assets/images/service_aerobics_group_1793107475923.jpg';
import { TM3_MEMBERSHIP_PLANS } from '../utils/scheduleUtils';

export const AboutSection: React.FC = () => {
  const { language, setIsRegistrationOpen } = useApp();

  const instructors = [
    {
      name: 'Master Mulatu Biru',
      role: 'Head Martial Arts Master · TM3 Founder (Est. 2000)',
      program: 'Taekwondo & Belt Progression',
      schedule: 'Tue / Wed / Thu / Fri · 5:15 PM & Sat · 10:00 AM',
      bio: 'Leads traditional martial arts training with structured belt progression, Poomsae forms, sparring discipline, and character building for youth and adults since 2000.',
      image: taekwondoImg,
      badge: 'TM3 Master Instructor'
    },
    {
      name: 'Derege',
      role: 'Lead Cultural Dance & Rhythm Instructor',
      program: 'Dancing Classes & Cultural Dance Workouts',
      schedule: 'Mon/Wed/Fri OR Tue/Thu/Sat · 10:30 AM, 4:00 PM, 7:30 PM',
      bio: 'Directs high-energy Cultural Dance workouts and cardio choreography across flexible 3-day weekly tracks (Mon/Wed/Fri or Tue/Thu/Sat) for morning, afternoon, and evening athletes.',
      image: aerobicsImg,
      badge: 'Dance Track Lead'
    },
    {
      name: 'Coach Marcus Vance & Elena Ramos',
      role: 'Strength & Group Conditioning Directors',
      program: 'Group Workout Sessions & Barbell Lab',
      schedule: 'Early (6–7 AM M/W/F) · Late (9–10 AM M–F) · Eve (6:30–7 PM M–F)',
      bio: 'Deliver structured weekday Group Workout Sessions focused on full-body strength, kettlebell complexes, and metabolic endurance.',
      image: coachMarcusImg,
      badge: 'CSCS Certified'
    }
  ];

  return (
    <section id="about" className="scroll-mt-24 py-20 bg-[#ffffff] border-b border-[#e0e2ec]">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Top Row: Academy Story & 4 Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Academy Feature Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-[#dadce0] bg-[#ffffff] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3">
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img
                  src={coachMarcusImg}
                  alt="TM3 Martial Arts Academy Coaching Staff"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4 pt-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f1f1f]">
                      TM3 Martial Arts Academy
                    </h3>
                    <div className="text-xs text-[#1a73e8] font-medium">
                      Discipline & Determination — Est. 2000
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                    tm3gym.com
                  </span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed mt-3">
                  "Taekwondo and group fitness for all ages. Build discipline, power, and community at TM3 Martial Arts Academy."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Story & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-medium text-[#1a73e8] uppercase tracking-wider">
              About TM3 Martial Arts Academy & TM Sports
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1f1f1f] leading-snug">
              Forge your strength with{' '}
              <span className="font-semibold text-[#1a73e8]">discipline & determination</span>.
            </h2>
            <p className="text-sm text-[#444746] leading-relaxed font-normal">
              {language === 'en'
                ? 'Established in 2000, TM3 Martial Arts Academy brings together traditional Taekwondo belt progression, daily Group Workout Sessions, Cultural Dance tracks, and outdoor summit hikes under one unified community.'
                : 'Fondée en 2000, TM3 Martial Arts Academy réunit le Taekwondo traditionnel, les séances d’entraînement de groupe, la danse culturelle et les randonnées en montagne.'}
            </p>

            {/* 4 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#feefc3] text-[#b06000] flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Taekwondo (Est. 2000)</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Led by Master Mulatu Biru (Tue–Fri 5:15 PM & Sat 10:00 AM) with structured belt progression for all ages.
                </p>
              </div>

              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <span>Group Workout Sessions</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Early Morning (M/W/F 6–7 AM), Late Morning (M–F 9–10 AM), and Evening (M–F 6:30–7 PM).
                </p>
              </div>

              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#f3e8fd] text-[#8430ce] flex items-center justify-center">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <span>Dancing Class Tracks</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Led by Instructor Derege on Mon/Wed/Fri OR Tue/Thu/Sat (10:30–11:30 AM, 4–5 PM, 7:30–8:30 PM).
                </p>
              </div>

              <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#e0e2ec]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1f1f1f] mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#c4eed0] text-[#137333] flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span>Pro Shop & 4-Digit PIN</span>
                </div>
                <p className="text-xs text-[#5f6368] leading-relaxed pl-9">
                  Uniforms (sizes XS–XXL), sparring gear sets at the front desk, and 4-digit PIN online profile claiming.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: OUR INSTRUCTORS — Meet the Team (from tm3gym.com) */}
        <div className="pt-8 border-t border-[#e0e2ec]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#1a73e8] uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Our Instructors</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1f1f1f]">
                Meet the <span className="font-semibold text-[#1a73e8]">TM3 coaching team</span>
              </h3>
            </div>
            <span className="text-xs text-[#5f6368]">
              Certified Martial Arts, Cultural Dance & Strength Instructors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((inst) => (
              <div
                key={inst.name}
                className="bg-[#f8fafd] border border-[#e0e2ec] rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="h-48 overflow-hidden relative bg-[#e8f0fe]">
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      {inst.badge}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-base font-bold text-[#1f1f1f]">{inst.name}</div>
                    <div className="text-xs font-medium text-[#1a73e8]">{inst.role}</div>
                    <p className="text-xs text-[#444746] leading-relaxed">{inst.bio}</p>
                  </div>
                </div>
                <div className="px-5 py-3 bg-[#ffffff] border-t border-[#e0e2ec] text-[11px] font-mono text-[#5f6368]">
                  {inst.schedule}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Official TM3 Membership Plans ($80 / $220 / $800) */}
        <div className="pt-8 border-t border-[#e0e2ec]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#1a73e8] uppercase tracking-wider mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>TM3 Membership Dues</span>
              </div>
              <h3 className="text-2xl font-normal text-[#1f1f1f]">
                Transparent <span className="font-semibold text-[#1a73e8]">membership plans</span>
              </h3>
            </div>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium transition-colors self-start sm:self-auto"
            >
              Register or Claim Profile with 4-Digit PIN
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TM3_MEMBERSHIP_PLANS.map((plan, idx) => (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl border flex items-center justify-between ${
                  idx === 1
                    ? 'bg-[#e8f0fe]/60 border-[#1a73e8]'
                    : 'bg-[#f8fafd] border-[#e0e2ec]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1f1f1f]">{plan.label} Plan</span>
                    {idx === 1 && (
                      <span className="text-[10px] font-semibold bg-[#1a73e8] text-white px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#5f6368] mt-1">{plan.savingsLabel || 'All-Access Training'}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-[#1f1f1f]">${plan.price}</div>
                  <div className="text-[11px] text-[#5f6368]">{plan.periodLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

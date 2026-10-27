import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SportService } from '../types';
import { Dumbbell, Users, Activity, Mountain, Sparkles, UserCheck, Clock, Check, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: SportService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { services, setSelectedServiceForJoin, setIsRegistrationOpen, language } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const filteredServices = services.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'group') return s.category === 'aerobics' || s.category === 'dance';
    if (filter === 'combat') return s.category === 'taekwondo';
    if (filter === 'individual') return s.category === 'strength' || s.category === 'pt' || s.category === 'opengym';
    if (filter === 'outdoor') return s.category === 'hiking';
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'taekwondo':
        return {
          headerBg: 'bg-[#fbbc04]',
          headerText: 'text-[#202124]',
          accentText: 'text-[#b06000]',
          chipBg: 'bg-[#feefc3] text-[#b06000]'
        };
      case 'hiking':
        return {
          headerBg: 'bg-[#34a853]',
          headerText: 'text-white',
          accentText: 'text-[#137333]',
          chipBg: 'bg-[#c4eed0] text-[#137333]'
        };
      case 'aerobics':
        return {
          headerBg: 'bg-[#ea4335]',
          headerText: 'text-white',
          accentText: 'text-[#c5221f]',
          chipBg: 'bg-[#fce8e6] text-[#c5221f]'
        };
      case 'strength':
        return {
          headerBg: 'bg-[#1a73e8]',
          headerText: 'text-white',
          accentText: 'text-[#1a73e8]',
          chipBg: 'bg-[#e8f0fe] text-[#1a73e8]'
        };
      case 'dance':
        return {
          headerBg: 'bg-[#a142f4]',
          headerText: 'text-white',
          accentText: 'text-[#8430ce]',
          chipBg: 'bg-[#f3e8fd] text-[#8430ce]'
        };
      case 'pt':
        return {
          headerBg: 'bg-[#007b83]',
          headerText: 'text-white',
          accentText: 'text-[#007b83]',
          chipBg: 'bg-[#e0f2f1] text-[#004d40]'
        };
      default:
        return {
          headerBg: 'bg-[#5f6368]',
          headerText: 'text-white',
          accentText: 'text-[#1a73e8]',
          chipBg: 'bg-[#f1f3f4] text-[#444746]'
        };
    }
  };

  return (
    <section id="services" className="scroll-mt-24 py-20 bg-[#f8fafd] border-b border-[#e0e2ec]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header (Google style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-medium text-[#1a73e8] uppercase tracking-wider mb-1">
              Google Classroom & Training Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
              Featured athletic <span className="font-semibold text-[#1a73e8]">disciplines</span>
            </h2>
            <p className="text-[#5f6368] text-sm mt-1 max-w-xl font-normal">
              {language === 'en'
                ? 'Join structured programs led by certified instructors with scheduled tracks, capacity limits, and progress milestones.'
                : 'Programmes sportifs encadrés avec places limitées et suivi certifié.'}
            </p>
          </div>

          {/* Google M3 Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: language === 'en' ? 'All (7)' : 'Tous (7)' },
              { id: 'combat', label: language === 'en' ? 'Youth Taekwondo' : 'Taekwondo' },
              { id: 'individual', label: language === 'en' ? 'Strength & Gym' : 'Musculation' },
              { id: 'group', label: language === 'en' ? 'Group Cardio' : 'Cardio' },
              { id: 'outdoor', label: language === 'en' ? 'Mountain Treks' : 'Randonnée' }
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1a73e8] text-white shadow-xs'
                      : 'bg-[#ffffff] text-[#444746] border border-[#dadce0] hover:bg-[#f1f3f4]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Google Classroom / Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => {
            const colors = getCategoryColor(service.category);
            const hasImage = Boolean(service.image);

            return (
              <div
                key={service.id}
                className="bg-[#ffffff] border border-[#e0e2ec] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Google Classroom style header banner */}
                  {hasImage ? (
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${colors.chipBg}`}>
                          {service.category.toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-bold drop-shadow-sm leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-xs text-white/90 drop-shadow-xs">{service.instructor}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-4 ${colors.headerBg} ${colors.headerText} flex justify-between items-start`}>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                          {service.category}
                        </span>
                        <h3 className="text-xl font-bold leading-tight mt-0.5">{service.title}</h3>
                        <p className="text-xs opacity-90 mt-0.5">{service.instructor}</p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        0{idx + 1}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-[#444746] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Google-style metadata strip */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[#f1f3f4]">
                      <div className="flex items-center gap-1.5 text-[#5f6368]">
                        <Clock className="w-3.5 h-3.5 text-[#5f6368]" />
                        <span>{service.scheduleSummary.split('·')[0]}</span>
                      </div>
                      <span className="font-semibold text-[#1f1f1f] text-sm">
                        ${service.pricingMonthly}
                        <span className="text-[11px] text-[#5f6368] font-normal">/mo</span>
                      </span>
                    </div>

                    {/* Capacity Progress Bar (Google Material style) */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#5f6368] mb-1">
                        <span>Class Enrollment</span>
                        <span className="font-mono font-medium text-[#1f1f1f]">
                          {service.currentEnrolled} / {service.capacity} members
                        </span>
                      </div>
                      <div className="w-full bg-[#f1f3f4] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#1a73e8] h-full rounded-full transition-all"
                          style={{ width: `${(service.currentEnrolled / service.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-1.5 pt-1">
                      {service.features.slice(0, 2).map((feat, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 text-xs text-[#444746]">
                          <Check className="w-3.5 h-3.5 text-[#34a853] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3 border-t border-[#f1f3f4]">
                  <button
                    onClick={() => {
                      setSelectedServiceForJoin(service.title);
                      setIsRegistrationOpen(true);
                    }}
                    className="flex-1 py-2 px-3 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors text-center"
                  >
                    Enroll in Program
                  </button>
                  <button
                    onClick={() => onSelectService(service)}
                    className="px-3 py-2 text-xs font-medium text-[#1a73e8] hover:bg-[#f1f3f4] rounded-full transition-colors"
                  >
                    Details
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

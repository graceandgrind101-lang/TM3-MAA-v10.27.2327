import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TimetableClass } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin, User, CheckCircle2, Dumbbell, CalendarDays, List } from 'lucide-react';
import { CalendarView } from './CalendarView';
import {
  GROUP_WORKOUT_SESSIONS,
  DANCING_CLASS_SESSIONS,
  DANCING_CLASS_TRACKS,
  formatSessionDuration,
} from '../utils/scheduleUtils';

export const ScheduleSection: React.FC = () => {
  const { classes, activeMember, bookClass, cancelClassBooking, setIsRegistrationOpen, role, language } = useApp();
  const [selectedDay, setSelectedDay] = useState<TimetableClass['dayOfWeek']>('Monday');
  const [scheduleView, setScheduleView] = useState<'timetable' | 'calendar'>('timetable');

  const days: { day: TimetableClass['dayOfWeek']; dateNum: string }[] = [
    { day: 'Monday', dateNum: '27' },
    { day: 'Tuesday', dateNum: '28' },
    { day: 'Wednesday', dateNum: '29' },
    { day: 'Thursday', dateNum: '30' },
    { day: 'Friday', dateNum: '31' },
    { day: 'Saturday', dateNum: '01' }
  ];

  const filteredClasses = classes.filter((c) => c.dayOfWeek === selectedDay);

  const getEventStyle = (serviceId: string) => {
    switch (serviceId) {
      case 'strength':
        return {
          bg: 'bg-[#e8f0fe]',
          border: 'border-[#1a73e8]',
          titleText: 'text-[#1a73e8]',
          indicator: 'bg-[#1a73e8]'
        };
      case 'aerobics':
        return {
          bg: 'bg-[#fce8e6]',
          border: 'border-[#ea4335]',
          titleText: 'text-[#c5221f]',
          indicator: 'bg-[#ea4335]'
        };
      case 'taekwondo':
        return {
          bg: 'bg-[#feefc3]',
          border: 'border-[#f29900]',
          titleText: 'text-[#b06000]',
          indicator: 'bg-[#fbbc04]'
        };
      case 'dance':
        return {
          bg: 'bg-[#f3e8fd]',
          border: 'border-[#a142f4]',
          titleText: 'text-[#8430ce]',
          indicator: 'bg-[#a142f4]'
        };
      default:
        return {
          bg: 'bg-[#e8f0fe]',
          border: 'border-[#1a73e8]',
          titleText: 'text-[#1a73e8]',
          indicator: 'bg-[#1a73e8]'
        };
    }
  };

  return (
    <section id="schedule" className="scroll-mt-24 py-20 bg-[#ffffff] border-b border-[#e0e2ec]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Google Calendar Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#e0e2ec]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-normal text-[#1f1f1f]">
                  Weekly athletic <span className="font-semibold text-[#1a73e8]">timetable</span>
                </h2>
                <span className="text-[10px] font-medium bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full">
                  TM3 Martial Arts Academy
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Group Workout Sessions, Dancing Classes (Mon/Wed/Fri OR Tue/Thu/Sat), and TM3 Taekwondo (Tue–Fri 5:15 PM)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#f0f4f9] p-1 rounded-full border border-[#dadce0]">
              <button
                onClick={() => setScheduleView('timetable')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  scheduleView === 'timetable'
                    ? 'bg-[#ffffff] text-[#1a73e8] shadow-2xs font-semibold'
                    : 'text-[#5f6368] hover:text-[#1f1f1f]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Daily Timetable</span>
              </button>
              <button
                onClick={() => setScheduleView('calendar')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  scheduleView === 'calendar'
                    ? 'bg-[#ffffff] text-[#1a73e8] shadow-2xs font-semibold'
                    : 'text-[#5f6368] hover:text-[#1f1f1f]'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-[#34a853]" />
                <span>Tournaments & Calendar</span>
              </button>
            </div>

            {/* Google Calendar Day Picker Bar */}
            {scheduleView === 'timetable' && (
              <div className="flex items-center gap-1.5 bg-[#f0f4f9] p-1.5 rounded-2xl border border-[#dadce0] overflow-x-auto">
                {days.map((item) => {
                  const isSelected = selectedDay === item.day;
                  return (
                    <button
                      key={item.day}
                      onClick={() => setSelectedDay(item.day)}
                      className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all min-w-[62px] ${
                        isSelected
                          ? 'bg-[#1a73e8] text-white shadow-xs font-semibold'
                          : 'text-[#444746] hover:bg-[#ffffff] hover:text-[#1f1f1f]'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-medium">
                        {item.day.slice(0, 3)}
                      </span>
                      <span className="text-sm font-mono mt-0.5">{item.dateNum}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Featured Group Workout Sessions & Dancing Class Schedule Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: 🏋️ Group Workout Sessions */}
          <div className="bg-[#f8fafd] border border-[#e0e2ec] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center text-sm shadow-2xs">
                    🏋️
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#1f1f1f]">
                      Group Workout Sessions
                    </h3>
                    <p className="text-[11px] text-[#5f6368]">
                      Strength & conditioning group fitness classes
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#137333] bg-[#c4eed0] px-2.5 py-1 rounded-full self-start sm:self-auto">
                  Mon – Fri
                </span>
              </div>

              <div className="space-y-3">
                {GROUP_WORKOUT_SESSIONS.map((slot, index) => {
                  const accents = [
                    'border-l-[#ea4335] bg-[#ffffff]',
                    'border-l-[#1a73e8] bg-[#ffffff]',
                    'border-l-[#34a853] bg-[#ffffff]',
                  ];
                  const badgeColors = [
                    'bg-[#fce8e6] text-[#c5221f]',
                    'bg-[#e8f0fe] text-[#1a73e8]',
                    'bg-[#c4eed0] text-[#137333]',
                  ];
                  return (
                    <div
                      key={slot.id}
                      className={`p-3.5 rounded-2xl border border-[#dadce0] border-l-4 ${accents[index]} flex items-center justify-between gap-3 shadow-2xs`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#1f1f1f]">{slot.label}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[index]}`}>
                            ({slot.daysLabel})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#1f1f1f]">
                          <Clock className="w-3.5 h-3.5 text-[#1a73e8]" />
                          <span>
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#5f6368] font-mono shrink-0">{slot.durationMinutes} min</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: 💃 Dancing Class Schedule */}
          <div className="bg-[#f8fafd] border border-[#e0e2ec] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#a142f4] text-white flex items-center justify-center text-sm shadow-2xs">
                    💃
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#1f1f1f]">
                      Dancing Class Schedule
                    </h3>
                    <p className="text-[11px] text-[#5f6368]">
                      Led by Instructor Derege · Choose your 3-day weekly track
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold text-[#8430ce] bg-[#f3e8fd] px-2.5 py-1 rounded-full">
                    {DANCING_CLASS_TRACKS[0].label}
                  </span>
                  <span className="text-[10px] font-bold text-[#5f6368]">OR</span>
                  <span className="text-[10px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-1 rounded-full">
                    {DANCING_CLASS_TRACKS[1].label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {DANCING_CLASS_SESSIONS.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl border border-[#dadce0] border-l-4 border-l-[#a142f4] bg-[#ffffff] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1f1f1f]">{slot.label}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f3e8fd] text-[#8430ce]">
                          Mon · Wed · Fri OR Tue · Thu · Sat
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#1f1f1f]">
                        <Clock className="w-3.5 h-3.5 text-[#a142f4]" />
                        <span>
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#5f6368] font-mono shrink-0">{slot.durationMinutes} min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content based on view */}
        {scheduleView === 'calendar' ? (
          <CalendarView />
        ) : (
          <div className="space-y-3">
          {filteredClasses.length === 0 ? (
            <div className="bg-[#f8fafd] border border-[#e0e2ec] rounded-2xl p-12 text-center text-[#5f6368]">
              <CalendarIcon className="w-8 h-8 mx-auto text-[#747775] mb-2" />
              <div className="text-sm font-medium text-[#1f1f1f]">No sessions scheduled for this day</div>
              <p className="text-xs text-[#5f6368] mt-1">Open gym access remains available 05:00 AM – 11:00 PM.</p>
            </div>
          ) : (
            filteredClasses.map((item) => {
              const style = getEventStyle(item.serviceId);
              const isBooked = activeMember ? item.bookedMemberIds.includes(activeMember.id) : false;
              const isWaitlisted = activeMember ? item.waitlistMemberIds.includes(activeMember.id) : false;
              const spotsLeft = item.capacity - item.bookedMemberIds.length;
              const isFull = spotsLeft <= 0;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border border-l-4 ${style.border} ${style.bg} border-t-[#e0e2ec] border-r-[#e0e2ec] border-b-[#e0e2ec] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-xs`}
                >
                  {/* Left: Time and Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1">
                    <div className="min-w-[140px]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1f1f1f] font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#5f6368]" />
                        <span>{item.startTime} – {item.endTime}</span>
                      </div>
                      <div className="text-[11px] text-[#5f6368] mt-0.5">
                        {formatSessionDuration(item.startTime, item.endTime)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${style.indicator}`} />
                        <h4 className="text-base font-semibold text-[#1f1f1f]">
                          {item.serviceName}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5f6368]">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#747775]" />
                          <span>
                            {item.instructor.startsWith('Coach') || item.instructor.startsWith('Master')
                              ? item.instructor
                              : `Instructor ${item.instructor}`}
                          </span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#747775]" />
                          <span>{item.room}</span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#444746]">{item.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Capacity & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                    <div className="text-right">
                      <div className="text-xs font-medium text-[#1f1f1f]">
                        <span className="font-mono">{item.bookedMemberIds.length}</span> / {item.capacity} Spots Booked
                      </div>
                      <div className="text-[11px] text-[#5f6368]">
                        {isFull ? (
                          <span className="text-[#b06000] font-medium">Waitlist Open</span>
                        ) : (
                          <span>{spotsLeft} remaining</span>
                        )}
                      </div>
                    </div>

                    {/* Google Action Button */}
                    {role === 'visitor' ? (
                      <button
                        onClick={() => setIsRegistrationOpen(true)}
                        className="px-4 py-2 text-xs font-medium text-[#1a73e8] bg-[#ffffff] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-full transition-colors whitespace-nowrap shadow-xs"
                      >
                        Join Club to Book
                      </button>
                    ) : role === 'pending' ? (
                      <div className="text-xs text-[#b06000] px-3 py-1 bg-[#feefc3] rounded-full border border-[#f9ab00]/40 font-medium">
                        Verification Pending
                      </div>
                    ) : isBooked ? (
                      <button
                        onClick={() => activeMember && cancelClassBooking(item.id, activeMember.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#137333] bg-[#c4eed0] hover:bg-[#a8dab5] rounded-full transition-colors whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" />
                        <span>Reserved (Cancel)</span>
                      </button>
                    ) : isWaitlisted ? (
                      <button
                        onClick={() => activeMember && cancelClassBooking(item.id, activeMember.id)}
                        className="px-4 py-2 text-xs font-medium text-[#b06000] bg-[#feefc3] hover:bg-[#fde293] rounded-full transition-colors whitespace-nowrap"
                      >
                        On Waitlist (Cancel)
                      </button>
                    ) : (
                      <button
                        onClick={() => activeMember && bookClass(item.id, activeMember.id)}
                        className={`px-5 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap shadow-xs ${
                          isFull
                            ? 'bg-[#ffffff] text-[#b06000] border border-[#dadce0] hover:bg-[#f1f3f4]'
                            : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white hover:shadow-md'
                        }`}
                      >
                        {isFull ? 'Join Waitlist' : 'Reserve Spot'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        )}
      </div>
    </section>
  );
};

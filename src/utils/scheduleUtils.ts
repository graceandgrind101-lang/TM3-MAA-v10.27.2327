import { TimetableClass } from '../types';

export interface GroupWorkoutSlot {
  id: string;
  label: string;
  daysLabel: string;
  days: TimetableClass['dayOfWeek'][];
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface DancingClassTrack {
  id: 'mwf' | 'tts';
  label: string;
  days: TimetableClass['dayOfWeek'][];
}

export interface DancingClassTimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface MembershipPlanTier {
  id: 'monthly' | 'quarterly' | 'annual';
  label: string;
  price: number;
  periodLabel: string;
  savingsLabel?: string;
}

export const TM3_MEMBERSHIP_PLANS: MembershipPlanTier[] = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: 80,
    periodLabel: '$80 / month',
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    price: 220,
    periodLabel: '$220 / 3 months',
    savingsLabel: 'Save $20',
  },
  {
    id: 'annual',
    label: 'Annual',
    price: 800,
    periodLabel: '$800 / year',
    savingsLabel: 'Save $160',
  },
];

export const GROUP_WORKOUT_SESSIONS: GroupWorkoutSlot[] = [
  {
    id: 'early-morning',
    label: 'Early Morning',
    daysLabel: 'Mon / Wed / Fri',
    days: ['Monday', 'Wednesday', 'Friday'],
    startTime: '6:00 AM',
    endTime: '7:00 AM',
    durationMinutes: 60,
  },
  {
    id: 'late-morning',
    label: 'Late Morning',
    daysLabel: 'Mon – Fri',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    durationMinutes: 60,
  },
  {
    id: 'evening',
    label: 'Evening',
    daysLabel: 'Mon – Fri',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '6:30 PM',
    endTime: '7:00 PM',
    durationMinutes: 30,
  },
];

export const DANCING_CLASS_TRACKS: DancingClassTrack[] = [
  {
    id: 'mwf',
    label: 'Mon · Wed · Fri',
    days: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: 'tts',
    label: 'Tue · Thu · Sat',
    days: ['Tuesday', 'Thursday', 'Saturday'],
  },
];

export const DANCING_CLASS_SESSIONS: DancingClassTimeSlot[] = [
  {
    id: 'dance-morning',
    label: 'Morning',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    durationMinutes: 60,
  },
  {
    id: 'dance-afternoon',
    label: 'Afternoon',
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    durationMinutes: 60,
  },
  {
    id: 'dance-evening',
    label: 'Evening',
    startTime: '7:30 PM',
    endTime: '8:30 PM',
    durationMinutes: 60,
  },
];

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function getSessionDurationMinutes(startTime: string, endTime: string): number {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  return end > start ? end - start : 60;
}

export function formatSessionDuration(startTime: string, endTime: string): string {
  const mins = getSessionDurationMinutes(startTime, endTime);
  return `${mins} min session`;
}

export function getGroupWorkoutSlotsForDay(day: TimetableClass['dayOfWeek']): GroupWorkoutSlot[] {
  return GROUP_WORKOUT_SESSIONS.filter((slot) => slot.days.includes(day));
}

export function getDancingTrackForDay(day: TimetableClass['dayOfWeek']): DancingClassTrack | undefined {
  return DANCING_CLASS_TRACKS.find((track) => track.days.includes(day));
}

export function isValidMemberPin(pin: string): boolean {
  return /^\d{4}$/.test(pin.trim());
}

export function calculateWinRate(wins: number, losses: number): number {
  const totalDecided = wins + losses;
  if (totalDecided <= 0) return 0;
  return Math.round((wins / totalDecided) * 100);
}

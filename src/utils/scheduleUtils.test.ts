import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GROUP_WORKOUT_SESSIONS,
  DANCING_CLASS_TRACKS,
  DANCING_CLASS_SESSIONS,
  TM3_MEMBERSHIP_PLANS,
  getSessionDurationMinutes,
  formatSessionDuration,
  getGroupWorkoutSlotsForDay,
  getDancingTrackForDay,
  isValidMemberPin,
  calculateWinRate,
} from './scheduleUtils';

test('GROUP_WORKOUT_SESSIONS matches requested Early Morning, Late Morning, and Evening slots', () => {
  assert.equal(GROUP_WORKOUT_SESSIONS.length, 3);

  const early = GROUP_WORKOUT_SESSIONS.find((s) => s.id === 'early-morning');
  assert.ok(early);
  assert.equal(early.daysLabel, 'Mon / Wed / Fri');
  assert.equal(early.startTime, '6:00 AM');
  assert.equal(early.endTime, '7:00 AM');
  assert.deepEqual(early.days, ['Monday', 'Wednesday', 'Friday']);

  const late = GROUP_WORKOUT_SESSIONS.find((s) => s.id === 'late-morning');
  assert.ok(late);
  assert.equal(late.daysLabel, 'Mon – Fri');
  assert.equal(late.startTime, '9:00 AM');
  assert.equal(late.endTime, '10:00 AM');
  assert.equal(late.days.length, 5);

  const evening = GROUP_WORKOUT_SESSIONS.find((s) => s.id === 'evening');
  assert.ok(evening);
  assert.equal(evening.daysLabel, 'Mon – Fri');
  assert.equal(evening.startTime, '6:30 PM');
  assert.equal(evening.endTime, '7:00 PM');
  assert.equal(evening.durationMinutes, 30);
});

test('DANCING_CLASS_TRACKS and DANCING_CLASS_SESSIONS match Mon/Wed/Fri OR Tue/Thu/Sat and 3 daily times', () => {
  assert.equal(DANCING_CLASS_TRACKS.length, 2);
  assert.deepEqual(DANCING_CLASS_TRACKS[0].days, ['Monday', 'Wednesday', 'Friday']);
  assert.deepEqual(DANCING_CLASS_TRACKS[1].days, ['Tuesday', 'Thursday', 'Saturday']);

  assert.equal(DANCING_CLASS_SESSIONS.length, 3);
  assert.equal(DANCING_CLASS_SESSIONS[0].startTime, '10:30 AM');
  assert.equal(DANCING_CLASS_SESSIONS[0].endTime, '11:30 AM');
  assert.equal(DANCING_CLASS_SESSIONS[1].startTime, '4:00 PM');
  assert.equal(DANCING_CLASS_SESSIONS[1].endTime, '5:00 PM');
  assert.equal(DANCING_CLASS_SESSIONS[2].startTime, '7:30 PM');
  assert.equal(DANCING_CLASS_SESSIONS[2].endTime, '8:30 PM');

  assert.equal(getDancingTrackForDay('Monday')?.id, 'mwf');
  assert.equal(getDancingTrackForDay('Saturday')?.id, 'tts');
});

test('TM3_MEMBERSHIP_PLANS and 4-digit PIN validator match tm3gym.com', () => {
  assert.equal(TM3_MEMBERSHIP_PLANS.length, 3);
  assert.equal(TM3_MEMBERSHIP_PLANS[0].price, 80);
  assert.equal(TM3_MEMBERSHIP_PLANS[1].price, 220);
  assert.equal(TM3_MEMBERSHIP_PLANS[2].price, 800);

  assert.equal(isValidMemberPin('8472'), true);
  assert.equal(isValidMemberPin('123'), false);
  assert.equal(isValidMemberPin('12a4'), false);
});

test('getSessionDurationMinutes and formatSessionDuration compute exact durations', () => {
  assert.equal(getSessionDurationMinutes('6:00 AM', '7:00 AM'), 60);
  assert.equal(getSessionDurationMinutes('9:00 AM', '10:00 AM'), 60);
  assert.equal(getSessionDurationMinutes('6:30 PM', '7:00 PM'), 30);
  assert.equal(getSessionDurationMinutes('10:30 AM', '11:30 AM'), 60);
  assert.equal(getSessionDurationMinutes('4:00 PM', '5:00 PM'), 60);
  assert.equal(getSessionDurationMinutes('7:30 PM', '8:30 PM'), 60);
  assert.equal(formatSessionDuration('6:30 PM', '7:00 PM'), '30 min session');
  assert.equal(formatSessionDuration('10:30 AM', '11:30 AM'), '60 min session');
});

test('getGroupWorkoutSlotsForDay returns 3 sessions on Mon/Wed/Fri and 2 on Tue/Thu', () => {
  assert.equal(getGroupWorkoutSlotsForDay('Monday').length, 3);
  assert.equal(getGroupWorkoutSlotsForDay('Wednesday').length, 3);
  assert.equal(getGroupWorkoutSlotsForDay('Friday').length, 3);
  assert.equal(getGroupWorkoutSlotsForDay('Tuesday').length, 2);
  assert.equal(getGroupWorkoutSlotsForDay('Thursday').length, 2);
});

test('calculateWinRate returns accurate percentage', () => {
  assert.equal(calculateWinRate(18, 2), 90);
  assert.equal(calculateWinRate(12, 4), 75);
  assert.equal(calculateWinRate(0, 0), 0);
});

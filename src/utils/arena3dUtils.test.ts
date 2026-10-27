import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARENA_CAMERA_PRESETS,
  calculateSparringStrike,
  calculateBarbellLoad,
  stepSpringPhysics,
  TM3_BELT_RANKS,
} from './arena3dUtils';

test('ARENA_CAMERA_PRESETS defines all 5 interactive 3D stations with valid coordinates', () => {
  const keys = Object.keys(ARENA_CAMERA_PRESETS);
  assert.deepEqual(keys, ['overview', 'taekwondo', 'workout', 'dance', 'belts']);
  for (const preset of Object.values(ARENA_CAMERA_PRESETS)) {
    assert.equal(preset.position.length, 3);
    assert.equal(preset.target.length, 3);
    assert.ok(preset.labelEn.length > 0);
  }
});

test('calculateSparringStrike awards accurate WT points and 3-hit combo bonuses', () => {
  const s1 = calculateSparringStrike('trunk_punch', 0);
  assert.equal(s1.basePoints, 1);
  assert.equal(s1.newCombo, 1);
  assert.equal(s1.comboBonus, 0);
  assert.equal(s1.totalAwarded, 1);

  const s2 = calculateSparringStrike('trunk_kick', s1.newCombo);
  assert.equal(s2.basePoints, 2);
  assert.equal(s2.newCombo, 2);
  assert.equal(s2.totalAwarded, 2);

  // 3rd consecutive hit gets +1 combo bonus
  const s3 = calculateSparringStrike('spinning_head_kick', s2.newCombo);
  assert.equal(s3.basePoints, 5);
  assert.equal(s3.newCombo, 3);
  assert.equal(s3.comboBonus, 1);
  assert.equal(s3.totalAwarded, 6);
  assert.equal(s3.targetZone, 'head');
});

test('calculateBarbellLoad computes exact IWF calibrated bumper plates per side', () => {
  const load60 = calculateBarbellLoad(60);
  assert.equal(load60.barWeightKg, 20);
  assert.equal(load60.platesPerSide.length, 1);
  assert.equal(load60.platesPerSide[0].weightKg, 20);

  const load140 = calculateBarbellLoad(140);
  // (140 - 20) / 2 = 60kg per side -> 25 + 25 + 10
  assert.deepEqual(
    load140.platesPerSide.map((p) => p.weightKg),
    [25, 25, 10]
  );

  const load180 = calculateBarbellLoad(180);
  // (180 - 20) / 2 = 80kg per side -> 25 + 25 + 25 + 5
  assert.deepEqual(
    load180.platesPerSide.map((p) => p.weightKg),
    [25, 25, 25, 5]
  );
  const sumPerSide = load180.platesPerSide.reduce((acc, p) => acc + p.weightKg, 0);
  assert.equal(load180.barWeightKg + sumPerSide * 2, 180);
});

test('stepSpringPhysics damps displacement back toward equilibrium', () => {
  let state = { displacement: 0.35, velocity: 0 };
  state = stepSpringPhysics(state, 0.016);
  assert.ok(state.velocity < 0, 'Spring should accelerate back toward zero');
  assert.ok(state.displacement < 0.35, 'Displacement should decrease initially');

  for (let i = 0; i < 300; i++) {
    state = stepSpringPhysics(state, 0.016);
  }
  assert.equal(state.displacement, 0);
  assert.equal(state.velocity, 0);
});

test('TM3_BELT_RANKS covers White through Black belt progression', () => {
  assert.equal(TM3_BELT_RANKS.length, 6);
  assert.equal(TM3_BELT_RANKS[0].id, 'white');
  assert.equal(TM3_BELT_RANKS[5].id, 'black');
});

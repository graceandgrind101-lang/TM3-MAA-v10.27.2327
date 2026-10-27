export type ArenaStationId = 'overview' | 'taekwondo' | 'workout' | 'dance' | 'belts';

export interface CameraPreset {
  id: ArenaStationId;
  labelEn: string;
  labelFr: string;
  badge: string;
  instructor: string;
  scheduleSummary: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
}

export const ARENA_CAMERA_PRESETS: Record<ArenaStationId, CameraPreset> = {
  overview: {
    id: 'overview',
    labelEn: 'Full 3D Dojang',
    labelFr: 'Dojang 3D Complet',
    badge: 'TM3 Arena · Est. 2000',
    instructor: 'Master Mulatu Biru & Instructor Derege',
    scheduleSummary: 'Mon–Sat · Taekwondo, Group Workouts & Cultural Dance',
    description:
      'Interactive 360° spatial view of the TM3 Martial Arts Academy & TM Sports facility. Orbit with mouse/touch or select any training zone below.',
    position: [0, 6.2, 11.5],
    target: [0, 1.3, 0],
  },
  taekwondo: {
    id: 'taekwondo',
    labelEn: 'WT Sparring Target',
    labelFr: 'Cible Taekwondo WT',
    badge: 'Taekwondo · Master Mulatu Biru',
    instructor: 'Master Mulatu Biru (Black Belt Master)',
    scheduleSummary: 'Tue–Fri 5:15 PM – 6:15 PM · Sat 10:00 AM – 11:00 AM',
    description:
      'Electronic WT Hogu trunk & head sparring target. Click the target zones or trigger strikes to test recoil physics and World Taekwondo point scoring.',
    position: [-3.2, 2.5, 4.4],
    target: [-3.2, 1.45, 0],
  },
  workout: {
    id: 'workout',
    labelEn: 'Group Workout Rig',
    labelFr: 'Station Musculation',
    badge: '🏋️ Group Workout Sessions',
    instructor: 'Coach Marcus Vance & Conditioning Staff',
    scheduleSummary: 'Early 6–7 AM (M/W/F) · Late 9–10 AM (M–F) · Eve 6:30–7 PM (M–F)',
    description:
      'Calibrated Olympic barbell & power rack station. Cycle IWF bumper plate loads (60 kg to 180 kg) and inspect bar knurling and rack geometry.',
    position: [3.2, 2.5, 4.5],
    target: [3.2, 1.35, 0],
  },
  dance: {
    id: 'dance',
    labelEn: 'Cultural Dance Stage',
    labelFr: 'Scène de Danse',
    badge: '💃 Dancing Class · Instructor Derege',
    instructor: 'Instructor Derege',
    scheduleSummary: 'M/W/F or T/Th/Sat · 10:30 AM, 4:00 PM & 7:30 PM',
    description:
      'Illuminated acoustic rhythm stage and motion floor for Cultural Dance & aerobic choreography. Toggle rhythm tempo waves and stage lighting.',
    position: [0, 3.1, 4.8],
    target: [0, 0.8, -2.2],
  },
  belts: {
    id: 'belts',
    labelEn: 'Belt Rank Display',
    labelFr: 'Grades & Ceintures',
    badge: 'Ceremonial Belt Rack',
    instructor: 'Master Mulatu Biru · Kukkiwon Curriculum',
    scheduleSummary: 'Quarterly Belt Testing · White to Black Belt Dan',
    description:
      'Traditional 6-tier Taekwondo ceremonial belt rack representing Courtesy, Integrity, Perseverance, Self-Control, and Indomitable Spirit.',
    position: [-5.2, 2.3, 2.6],
    target: [-5.5, 1.6, -2.2],
  },
};

export type StrikeType = 'trunk_punch' | 'trunk_kick' | 'turning_trunk_kick' | 'head_kick' | 'spinning_head_kick';

export interface StrikeResult {
  strikeType: StrikeType;
  label: string;
  koreanName: string;
  basePoints: number;
  newCombo: number;
  comboBonus: number;
  totalAwarded: number;
  targetZone: 'trunk' | 'head';
  impulseVelocity: number;
}

const STRIKE_METADATA: Record<
  StrikeType,
  { label: string; koreanName: string; basePoints: number; targetZone: 'trunk' | 'head'; impulseVelocity: number }
> = {
  trunk_punch: {
    label: 'Momtong Jireugi (Trunk Punch)',
    koreanName: '몸통 지르기',
    basePoints: 1,
    targetZone: 'trunk',
    impulseVelocity: 4.5,
  },
  trunk_kick: {
    label: 'Dollyo Chagi (Body Roundhouse)',
    koreanName: '돌려 차기',
    basePoints: 2,
    targetZone: 'trunk',
    impulseVelocity: 7.0,
  },
  head_kick: {
    label: 'Olgul Chagi (Head Kick)',
    koreanName: '얼굴 차기',
    basePoints: 3,
    targetZone: 'head',
    impulseVelocity: 8.5,
  },
  turning_trunk_kick: {
    label: 'Dwit Chagi (Spinning Back Kick)',
    koreanName: '뒤 차기',
    basePoints: 4,
    targetZone: 'trunk',
    impulseVelocity: 10.5,
  },
  spinning_head_kick: {
    label: 'Mondollyo Huryeo Chagi (Spinning Hook Kick)',
    koreanName: '몸돌려 후려차기',
    basePoints: 5,
    targetZone: 'head',
    impulseVelocity: 12.5,
  },
};

/**
 * Calculates WT electronic sparring points and combo streak bonuses.
 */
export function calculateSparringStrike(strikeType: StrikeType, currentCombo: number): StrikeResult {
  const meta = STRIKE_METADATA[strikeType];
  const safeCombo = Math.max(0, Math.floor(currentCombo));
  const newCombo = safeCombo + 1;
  // Award +1 bonus point on every 3rd consecutive strike in a combo
  const comboBonus = newCombo % 3 === 0 ? 1 : 0;
  const totalAwarded = meta.basePoints + comboBonus;

  return {
    strikeType,
    label: meta.label,
    koreanName: meta.koreanName,
    basePoints: meta.basePoints,
    newCombo,
    comboBonus,
    totalAwarded,
    targetZone: meta.targetZone,
    impulseVelocity: meta.impulseVelocity,
  };
}

export type BarbellWeightKg = 60 | 100 | 140 | 180;

export interface BumperPlateSpec {
  weightKg: 25 | 20 | 15 | 10 | 5;
  colorHex: number;
  colorName: string;
  radius: number;
  thickness: number;
}

export interface BarbellLoadout {
  totalWeightKg: BarbellWeightKg;
  totalLbs: number;
  barWeightKg: 20;
  platesPerSide: BumperPlateSpec[];
}

const PLATE_CATALOG: Record<25 | 20 | 15 | 10 | 5, BumperPlateSpec> = {
  25: { weightKg: 25, colorHex: 0xd93025, colorName: 'IWF Red (25kg)', radius: 0.45, thickness: 0.065 },
  20: { weightKg: 20, colorHex: 0x1a73e8, colorName: 'IWF Blue (20kg)', radius: 0.45, thickness: 0.058 },
  15: { weightKg: 15, colorHex: 0xfbbc04, colorName: 'IWF Yellow (15kg)', radius: 0.45, thickness: 0.048 },
  10: { weightKg: 10, colorHex: 0x34a853, colorName: 'IWF Green (10kg)', radius: 0.45, thickness: 0.038 },
  5: { weightKg: 5, colorHex: 0xf8fafc, colorName: 'IWF White (5kg)', radius: 0.32, thickness: 0.028 },
};

/**
 * Calculates exact calibrated Olympic bumper plates per side for a 20kg bar.
 */
export function calculateBarbellLoad(totalWeightKg: BarbellWeightKg): BarbellLoadout {
  const barWeightKg = 20;
  let remainingPerSide = (totalWeightKg - barWeightKg) / 2;
  const platesPerSide: BumperPlateSpec[] = [];
  const denominations: Array<25 | 20 | 15 | 10 | 5> = [25, 20, 15, 10, 5];

  for (const denom of denominations) {
    while (remainingPerSide >= denom) {
      platesPerSide.push(PLATE_CATALOG[denom]);
      remainingPerSide -= denom;
    }
  }

  return {
    totalWeightKg,
    totalLbs: Math.round(totalWeightKg * 2.20462),
    barWeightKg,
    platesPerSide,
  };
}

export interface SpringState {
  displacement: number;
  velocity: number;
}

/**
 * Advances a damped harmonic oscillator spring for 3D target recoil.
 */
export function stepSpringPhysics(
  state: SpringState,
  dt: number,
  stiffness = 140,
  damping = 14
): SpringState {
  const clampedDt = Math.min(Math.max(dt, 0), 0.05);
  const acceleration = -stiffness * state.displacement - damping * state.velocity;
  const nextVelocity = state.velocity + acceleration * clampedDt;
  const nextDisplacement = state.displacement + nextVelocity * clampedDt;

  if (Math.abs(nextDisplacement) < 0.0005 && Math.abs(nextVelocity) < 0.0005) {
    return { displacement: 0, velocity: 0 };
  }

  return {
    displacement: nextDisplacement,
    velocity: nextVelocity,
  };
}

export interface BeltRankSpec {
  id: string;
  rankName: string;
  koreanRank: string;
  colorHex: number;
  stripeColorHex?: number;
  tenet: string;
  focus: string;
}

export const TM3_BELT_RANKS: BeltRankSpec[] = [
  {
    id: 'white',
    rankName: 'White Belt (10th Geup)',
    koreanRank: '백띠 · Baek-tti',
    colorHex: 0xf8fafc,
    tenet: 'Courtesy (Ye-Ui)',
    focus: 'Fundamental stances (Ap-kubi, Dwit-kubi), basic blocks & Taegeuk Il Jang.',
  },
  {
    id: 'yellow',
    rankName: 'Yellow Belt (8th Geup)',
    koreanRank: '노란띠 · Noran-tti',
    colorHex: 0xfbbc04,
    tenet: 'Integrity (Yom-Chi)',
    focus: 'Front snap kicks (Ap-chagi), roundhouse mechanics & Taegeuk Ee Jang.',
  },
  {
    id: 'green',
    rankName: 'Green Belt (6th Geup)',
    koreanRank: '초록띠 · Chorok-tti',
    colorHex: 0x34a853,
    tenet: 'Perseverance (In-Nae)',
    focus: 'Side piercing kicks (Yeop-chagi), back kicks & Taegeuk Sam/Sa Jang.',
  },
  {
    id: 'blue',
    rankName: 'Blue Belt (4th Geup)',
    koreanRank: '파란띠 · Paran-tti',
    colorHex: 0x1a73e8,
    tenet: 'Self-Control (Guk-Gi)',
    focus: 'Electronic Hogu sparring combinations, spinning hook kicks & Taegeuk Oh/Yuk Jang.',
  },
  {
    id: 'red',
    rankName: 'Red Belt (2nd Geup)',
    koreanRank: '빨간띠 · Ppalgan-tti',
    colorHex: 0xd93025,
    tenet: 'Indomitable Spirit (Baekjul-Boolgool)',
    focus: 'Advanced jumping kicks, board breaking & Taegeuk Chil/Pal Jang.',
  },
  {
    id: 'black',
    rankName: 'Black Belt (1st–4th Dan)',
    koreanRank: '검은띠 · Geomeun-tti',
    colorHex: 0x18181b,
    stripeColorHex: 0xf59e0b,
    tenet: 'Mastery & Leadership (Master Mulatu Biru)',
    focus: 'Koryo, Keumgang, Taebaek Poomsae, championship WT sparring & studio mentorship.',
  },
];

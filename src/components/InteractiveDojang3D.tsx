import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ARENA_CAMERA_PRESETS,
  ArenaStationId,
  BarbellWeightKg,
  calculateBarbellLoad,
  calculateSparringStrike,
  stepSpringPhysics,
  StrikeResult,
  StrikeType,
  TM3_BELT_RANKS,
} from '../utils/arena3dUtils';
import { useApp } from '../context/AppContext';
import {
  Box,
  ChevronDown,
  ChevronUp,
  Compass,
  Dumbbell,
  Flame,
  Layers,
  Music,
  RotateCcw,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

interface InteractiveDojang3DProps {
  isFullPage?: boolean;
  onNavigateToSchedule?: () => void;
}

function createMatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Deep blue outer mat
    ctx.fillStyle = '#174ea6';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle EVA foam tatami weave lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 512; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Inner red/orange octagonal contest border
    ctx.strokeStyle = '#fbbc04';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#1a73e8';
    ctx.beginPath();
    ctx.arc(256, 256, 192, 0, Math.PI * 2);
    ctx.fill();

    // Center TM3 emblem ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 68, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TM3', 256, 244);
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fbbc04';
    ctx.fillText('EST. 2000', 256, 274);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#262930';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}

export const InteractiveDojang3D: React.FC<InteractiveDojang3DProps> = ({
  isFullPage = false,
  onNavigateToSchedule,
}) => {
  const { setIsRegistrationOpen, showToast } = useApp();
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  // React UI state
  const [activeStation, setActiveStation] = useState<ArenaStationId>('overview');
  const [sparringScore, setSparringScore] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [lastStrike, setLastStrike] = useState<StrikeResult | null>(null);
  const [barbellWeight, setBarbellWeight] = useState<BarbellWeightKg>(100);
  const [danceRhythmActive, setDanceRhythmActive] = useState<boolean>(true);
  const [selectedBeltId, setSelectedBeltId] = useState<string>('black');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [hoveredPartLabel, setHoveredPartLabel] = useState<string | null>(null);
  const [webglReady, setWebglReady] = useState<boolean>(false);

  // Refs synchronized into the Three.js loop without re-creating the scene
  const stationRef = useRef<ArenaStationId>('overview');
  const explodeRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(true);
  const danceRhythmRef = useRef<boolean>(true);
  const selectedBeltRef = useRef<string>('black');
  const springStateRef = useRef<{ displacement: number; velocity: number; axisX: number; axisZ: number }>({
    displacement: 0,
    velocity: 0,
    axisX: 0,
    axisZ: -1,
  });
  const barbellSquatPhaseRef = useRef<number>(0);
  const hitFlashTimerRef = useRef<number>(0);
  const rebuildPlatesRef = useRef<((weight: BarbellWeightKg) => void) | null>(null);
  const triggerStrikeRef = useRef<((type: StrikeType) => void) | null>(null);

  useEffect(() => {
    stationRef.current = activeStation;
  }, [activeStation]);

  useEffect(() => {
    explodeRef.current = explodeFactor;
  }, [explodeFactor]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    danceRhythmRef.current = danceRhythmActive;
  }, [danceRhythmActive]);

  useEffect(() => {
    selectedBeltRef.current = selectedBeltId;
  }, [selectedBeltId]);

  const handleSelectStation = useCallback((station: ArenaStationId) => {
    setActiveStation(station);
    if (station !== 'overview') {
      setAutoRotate(false);
    }
  }, []);

  const handleStrike = useCallback(
    (type: StrikeType) => {
      setComboStreak((prevCombo) => {
        const res = calculateSparringStrike(type, prevCombo);
        setLastStrike(res);
        setSparringScore((prevScore) => prevScore + res.totalAwarded);
        // Apply physical impulse to the 3D sparring dummy spring
        const angle = (Math.random() - 0.5) * 0.5;
        springStateRef.current = {
          displacement: 0.12,
          velocity: res.impulseVelocity * 0.35,
          axisX: Math.sin(angle),
          axisZ: -Math.cos(angle),
        };
        hitFlashTimerRef.current = 0.35;
        return res.newCombo;
      });
    },
    []
  );

  useEffect(() => {
    triggerStrikeRef.current = handleStrike;
  }, [handleStrike]);

  const handleChangeBarbellWeight = useCallback((weight: BarbellWeightKg) => {
    setBarbellWeight(weight);
    barbellSquatPhaseRef.current = 1.0; // Trigger a subtle rack bounce/lift animation
    if (rebuildPlatesRef.current) {
      rebuildPlatesRef.current(weight);
    }
  }, []);

  // Initialize Three.js Scene once
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 540;

    // Detect software WebGL renderer (SwiftShader / llvmpipe / Basic Render)
    const probeCanvas = document.createElement('canvas');
    const probeGl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    const dbgInfo = probeGl?.getExtension('WEBGL_debug_renderer_info');
    const rendererInfo = dbgInfo ? String(probeGl?.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) || '') : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererInfo);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f141d);
    scene.fog = new THREE.FogExp2(0x0f141d, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(...ARENA_CAMERA_PRESETS.overview.position);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio IBL environment map via RoomEnvironment on all devices
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 2.2;
    controls.maxDistance = 18;
    controls.target.set(...ARENA_CAMERA_PRESETS.overview.target);

    // Three-point warm/cool studio lighting
    const hemiLight = new THREE.HemisphereLight(0xd2e3fc, 0x1e293b, 0.75);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.8);
    keyLight.position.set(6, 11, 7);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 28;
      const d = 9;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.9);
    rimLight.position.set(-7, 6, -6);
    scene.add(rimLight);

    // Interactables list for fast raycasting
    const interactables: THREE.Object3D[] = [];
    const explodeParts: Array<{ mesh: THREE.Object3D; basePos: THREE.Vector3; offset: THREE.Vector3 }> = [];

    const registerExplodePart = (mesh: THREE.Object3D, offset: THREE.Vector3) => {
      explodeParts.push({
        mesh,
        basePos: mesh.position.clone(),
        offset,
      });
    };

    // 1. Arena Floor & Octagonal Competition Mat (disjoint Y depth >= 0.02)
    const floorTex = createWoodFloorTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: floorTex,
      roughness: 0.72,
      metalness: 0.08,
    });
    const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    const matTex = createMatTexture();
    const matGeo = new THREE.CylinderGeometry(4.4, 4.4, 0.04, 8);
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: matTex,
      roughness: 0.6,
      metalness: 0.05,
    });
    const dojangMat = new THREE.Mesh(matGeo, matMaterial);
    dojangMat.position.set(0, 0.02, 0.4);
    dojangMat.receiveShadow = !isSoftwareGl;
    scene.add(dojangMat);

    // Soft radial contact shadow helper
    const addContactShadow = (x: number, z: number, radius: number) => {
      const shadowGeo = new THREE.CircleGeometry(radius, 24);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
      });
      const disc = new THREE.Mesh(shadowGeo, shadowMat);
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(x, 0.045, z);
      scene.add(disc);
    };

    // =========================================================================
    // STATION 1: WT Electronic Sparring Target Dummy (9-part composite Group)
    // =========================================================================
    const sparringGroup = new THREE.Group();
    sparringGroup.position.set(-3.2, 0.04, 0);
    scene.add(sparringGroup);
    addContactShadow(-3.2, 0, 0.95);

    // Part 1: Weighted Base
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, metalness: 0.15 });
    const dummyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.66, 0.34, 24), baseMat);
    dummyBase.position.y = 0.17;
    dummyBase.castShadow = !isSoftwareGl;
    sparringGroup.add(dummyBase);

    // Pivot group for spring recoil
    const dummyPivot = new THREE.Group();
    dummyPivot.position.set(0, 0.34, 0);
    sparringGroup.add(dummyPivot);

    // Part 2: Chrome Spring Column
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.88 });
    const springCol = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.65, 16), chromeMat);
    springCol.position.y = 0.32;
    dummyPivot.add(springCol);
    registerExplodePart(springCol, new THREE.Vector3(0, 0.15, 0));

    // Part 3: Core Foam Torso
    const padDarkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.65, metalness: 0.1 });
    const coreTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.29, 0.92, 20), padDarkMat);
    coreTorso.position.y = 1.05;
    coreTorso.castShadow = !isSoftwareGl;
    dummyPivot.add(coreTorso);

    // Part 4: WT Blue Electronic Hogu Chest Protector
    const hoguMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a73e8,
      roughness: 0.32,
      metalness: 0.15,
      clearcoat: 0.6,
      emissive: new THREE.Color(0x000000),
    });
    const hoguShell = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.33, 0.68, 20, 1, false, -Math.PI * 0.65, Math.PI * 1.3), hoguMat);
    hoguShell.position.y = 1.06;
    hoguShell.userData = {
      station: 'taekwondo',
      action: 'strike_trunk',
      label: 'WT Blue Electronic Hogu (Click to Strike — 2 pts)',
    };
    interactables.push(hoguShell);
    dummyPivot.add(hoguShell);
    registerExplodePart(hoguShell, new THREE.Vector3(0, 0.25, 0.45));

    // Part 5: Red Target Scoring Zone Patch on Chest
    const targetZoneMat = new THREE.MeshStandardMaterial({
      color: 0xea4335,
      roughness: 0.35,
      metalness: 0.2,
      emissive: new THREE.Color(0x3b0704),
    });
    const chestPatch = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 0.08), targetZoneMat);
    chestPatch.position.set(0, 1.08, 0.33);
    chestPatch.userData = {
      station: 'taekwondo',
      action: 'strike_turning_trunk',
      label: 'WT Sensor Bullseye (Click for Spinning Back Kick — 4 pts)',
    };
    interactables.push(chestPatch);
    dummyPivot.add(chestPatch);
    registerExplodePart(chestPatch, new THREE.Vector3(0, 0.28, 0.72));

    // Part 6 & 7: Left & Right High-Kick Target Paddles
    const paddleMat = new THREE.MeshStandardMaterial({ color: 0xfbbc04, roughness: 0.4, metalness: 0.15 });
    const leftPaddle = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.12), paddleMat);
    leftPaddle.position.set(-0.52, 1.32, 0.1);
    leftPaddle.rotation.z = 0.25;
    leftPaddle.userData = {
      station: 'taekwondo',
      action: 'strike_trunk',
      label: 'Left Roundhouse Kick Paddle (Click to Strike — 2 pts)',
    };
    interactables.push(leftPaddle);
    dummyPivot.add(leftPaddle);
    registerExplodePart(leftPaddle, new THREE.Vector3(-0.45, 0.3, 0));

    const rightPaddle = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.12), paddleMat);
    rightPaddle.position.set(0.52, 1.32, 0.1);
    rightPaddle.rotation.z = -0.25;
    rightPaddle.userData = {
      station: 'taekwondo',
      action: 'strike_trunk',
      label: 'Right Roundhouse Kick Paddle (Click to Strike — 2 pts)',
    };
    interactables.push(rightPaddle);
    dummyPivot.add(rightPaddle);
    registerExplodePart(rightPaddle, new THREE.Vector3(0.45, 0.3, 0));

    // Part 8: Head & WT Red Electronic Headgear
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0xd93025,
      roughness: 0.28,
      metalness: 0.15,
      clearcoat: 0.7,
      emissive: new THREE.Color(0x000000),
    });
    const headTarget = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 18), headMat);
    headTarget.position.set(0, 1.76, 0);
    headTarget.userData = {
      station: 'taekwondo',
      action: 'strike_head',
      label: 'WT Electronic Headgear Target (Click for Head Kick — 5 pts)',
    };
    interactables.push(headTarget);
    dummyPivot.add(headTarget);
    registerExplodePart(headTarget, new THREE.Vector3(0, 0.65, 0));

    // =========================================================================
    // STATION 2: Group Workout Olympic Barbell & Squat Rack (10-part Group)
    // =========================================================================
    const workoutGroup = new THREE.Group();
    workoutGroup.position.set(3.2, 0.04, 0);
    scene.add(workoutGroup);
    addContactShadow(3.2, 0, 1.25);

    const rackSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.75,
    });
    const accentRedMat = new THREE.MeshStandardMaterial({
      color: 0xea4335,
      roughness: 0.35,
      metalness: 0.5,
    });

    // Rack Left & Right Uprights
    const uprightGeo = new THREE.BoxGeometry(0.1, 2.35, 0.1);
    const leftUpright = new THREE.Mesh(uprightGeo, rackSteelMat);
    leftUpright.position.set(-0.68, 1.175, -0.35);
    leftUpright.castShadow = !isSoftwareGl;
    workoutGroup.add(leftUpright);

    const rightUpright = new THREE.Mesh(uprightGeo, rackSteelMat);
    rightUpright.position.set(0.68, 1.175, -0.35);
    rightUpright.castShadow = !isSoftwareGl;
    workoutGroup.add(rightUpright);

    // Rack Base Feet
    const footGeo = new THREE.BoxGeometry(0.12, 0.08, 1.25);
    const leftFoot = new THREE.Mesh(footGeo, rackSteelMat);
    leftFoot.position.set(-0.68, 0.04, 0);
    workoutGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, rackSteelMat);
    rightFoot.position.set(0.68, 0.04, 0);
    workoutGroup.add(rightFoot);

    // Pull-up Crossbeam
    const pullupBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.46, 16), accentRedMat);
    pullupBar.rotation.z = Math.PI / 2;
    pullupBar.position.set(0, 2.24, -0.35);
    workoutGroup.add(pullupBar);
    registerExplodePart(pullupBar, new THREE.Vector3(0, 0.4, 0));

    // J-Cups / Spotter Arms
    const spotterGeo = new THREE.BoxGeometry(0.12, 0.07, 0.55);
    const leftSpotter = new THREE.Mesh(spotterGeo, accentRedMat);
    leftSpotter.position.set(-0.68, 1.22, -0.05);
    workoutGroup.add(leftSpotter);

    const rightSpotter = new THREE.Mesh(spotterGeo, accentRedMat);
    rightSpotter.position.set(0.68, 1.22, -0.05);
    workoutGroup.add(rightSpotter);

    // Olympic Barbell Assembly Group
    const barbellGroup = new THREE.Group();
    barbellGroup.position.set(0, 1.29, 0.08);
    workoutGroup.add(barbellGroup);

    const barShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.2, 20), chromeMat);
    barShaft.rotation.z = Math.PI / 2;
    barShaft.userData = {
      station: 'workout',
      action: 'cycle_weight',
      label: '20kg Olympic Barbell (Click to Cycle Bumper Plate Weight)',
    };
    interactables.push(barShaft);
    barbellGroup.add(barShaft);

    // Dynamic Bumper Plates Container
    const platesGroup = new THREE.Group();
    barbellGroup.add(platesGroup);

    const plateMaterials = new Map<number, THREE.MeshStandardMaterial>();
    const getPlateMaterial = (hex: number) => {
      if (!plateMaterials.has(hex)) {
        plateMaterials.set(
          hex,
          new THREE.MeshStandardMaterial({
            color: hex,
            roughness: 0.42,
            metalness: 0.18,
          })
        );
      }
      return plateMaterials.get(hex)!;
    };

    const rebuildPlates = (weightKg: BarbellWeightKg) => {
      while (platesGroup.children.length > 0) {
        const child = platesGroup.children[0] as THREE.Mesh;
        platesGroup.remove(child);
        if (child.geometry) child.geometry.dispose();
      }

      const loadout = calculateBarbellLoad(weightKg);
      let offsetLeft = -0.74;
      let offsetRight = 0.74;

      loadout.platesPerSide.forEach((plate, idx) => {
        const geo = new THREE.CylinderGeometry(plate.radius, plate.radius, plate.thickness, 28);
        const mat = getPlateMaterial(plate.colorHex);

        const leftPlate = new THREE.Mesh(geo, mat);
        leftPlate.rotation.z = Math.PI / 2;
        leftPlate.position.set(offsetLeft - idx * 0.01, 0, 0);
        leftPlate.userData = {
          station: 'workout',
          action: 'cycle_weight',
          label: `${plate.colorName} Bumper Plate (Click to Change Load)`,
        };
        platesGroup.add(leftPlate);
        offsetLeft -= plate.thickness + 0.012;

        const rightPlate = new THREE.Mesh(geo, mat);
        rightPlate.rotation.z = Math.PI / 2;
        rightPlate.position.set(offsetRight + idx * 0.01, 0, 0);
        rightPlate.userData = {
          station: 'workout',
          action: 'cycle_weight',
          label: `${plate.colorName} Bumper Plate (Click to Change Load)`,
        };
        platesGroup.add(rightPlate);
        offsetRight += plate.thickness + 0.012;
      });
    };

    rebuildPlates(100);
    rebuildPlatesRef.current = rebuildPlates;

    // =========================================================================
    // STATION 3: Cultural Dance & Rhythm Stage (Instructor Derege)
    // =========================================================================
    const danceGroup = new THREE.Group();
    danceGroup.position.set(0, 0.04, -2.5);
    scene.add(danceGroup);

    const stageDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(1.85, 1.95, 0.18, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.35, metalness: 0.3 })
    );
    stageDeck.position.y = 0.09;
    stageDeck.userData = {
      station: 'dance',
      action: 'toggle_rhythm',
      label: 'Cultural Dance Stage — Instructor Derege (Click to Toggle Rhythm Wave)',
    };
    interactables.push(stageDeck);
    danceGroup.add(stageDeck);

    const stageRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.88, 0.035, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0xfbbc04,
        emissive: new THREE.Color(0xd97706),
        emissiveIntensity: 0.8,
        roughness: 0.2,
      })
    );
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = 0.18;
    danceGroup.add(stageRing);
    registerExplodePart(stageRing, new THREE.Vector3(0, 0.45, 0));

    // 6 Rhythm Equalizer Pillars around back arc of Dance Stage
    const rhythmBars: THREE.Mesh[] = [];
    const barColors = [0x1a73e8, 0xea4335, 0xfbbc04, 0x34a853, 0xa855f7, 0x06b6d4];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI + (i / 5) * Math.PI - Math.PI; // back semicircle
      const rad = 1.55;
      const x = Math.cos(angle - Math.PI) * rad;
      const z = -Math.sin(angle) * rad * 0.7 - 0.3;
      const barMat = new THREE.MeshStandardMaterial({
        color: barColors[i],
        emissive: new THREE.Color(barColors[i]),
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.4,
      });
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.2, 16), barMat);
      bar.position.set((i - 2.5) * 0.55, 0.78, -1.15);
      bar.userData = {
        station: 'dance',
        action: 'toggle_rhythm',
        label: 'Rhythm Equalizer Column (Click to Toggle Dance Pulse)',
      };
      interactables.push(bar);
      danceGroup.add(bar);
      rhythmBars.push(bar);
    }

    // =========================================================================
    // STATION 4: Ceremonial 6-Tier Belt Progression Rack
    // =========================================================================
    const beltRackGroup = new THREE.Group();
    beltRackGroup.position.set(-5.4, 0.04, -2.2);
    beltRackGroup.rotation.y = 0.42;
    scene.add(beltRackGroup);
    addContactShadow(-5.4, -2.2, 0.9);

    const walnutMat = new THREE.MeshStandardMaterial({ color: 0x3f271d, roughness: 0.58, metalness: 0.1 });
    const rackPostLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), walnutMat);
    rackPostLeft.position.set(-0.75, 1.2, 0);
    beltRackGroup.add(rackPostLeft);

    const rackPostRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), walnutMat);
    rackPostRight.position.set(0.75, 1.2, 0);
    beltRackGroup.add(rackPostRight);

    const headerPlaque = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.24, 0.14), walnutMat);
    headerPlaque.position.set(0, 2.35, 0);
    beltRackGroup.add(headerPlaque);
    registerExplodePart(headerPlaque, new THREE.Vector3(0, 0.35, 0));

    const beltMeshes = new Map<string, THREE.Mesh>();
    TM3_BELT_RANKS.forEach((belt, index) => {
      const yPos = 0.45 + index * 0.31;
      const beltMat = new THREE.MeshStandardMaterial({
        color: belt.colorHex,
        roughness: 0.45,
        metalness: 0.1,
        emissive: new THREE.Color(0x000000),
      });
      const beltBar = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.13, 0.09), beltMat);
      beltBar.position.set(0, yPos, 0.04);
      beltBar.userData = {
        station: 'belts',
        action: 'select_belt',
        beltId: belt.id,
        label: `${belt.rankName} — ${belt.tenet} (Click to Inspect)`,
      };
      interactables.push(beltBar);
      beltRackGroup.add(beltBar);
      beltMeshes.set(belt.id, beltBar);
      registerExplodePart(beltBar, new THREE.Vector3(0, 0, (index + 1) * 0.12));
    });

    // Pre-compile shaders on hardware GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    setWebglReady(true);

    // Raycasting for pointer click & hover
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return; // Ignore orbit drags

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([...interactables, ...platesGroup.children], false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const data = hitObj.userData;
        if (data?.station) {
          setActiveStation(data.station as ArenaStationId);
          setAutoRotate(false);
        }
        if (data?.action === 'strike_trunk' && triggerStrikeRef.current) {
          triggerStrikeRef.current('trunk_kick');
        } else if (data?.action === 'strike_turning_trunk' && triggerStrikeRef.current) {
          triggerStrikeRef.current('turning_trunk_kick');
        } else if (data?.action === 'strike_head' && triggerStrikeRef.current) {
          triggerStrikeRef.current('spinning_head_kick');
        } else if (data?.action === 'cycle_weight') {
          const weights: BarbellWeightKg[] = [60, 100, 140, 180];
          setBarbellWeight((prev) => {
            const next = weights[(weights.indexOf(prev) + 1) % weights.length];
            rebuildPlates(next);
            barbellSquatPhaseRef.current = 1.0;
            return next;
          });
        } else if (data?.action === 'toggle_rhythm') {
          setDanceRhythmActive((prev) => !prev);
        } else if (data?.action === 'select_belt' && data.beltId) {
          setSelectedBeltId(data.beltId);
        }
      }
    };

    let lastHoverCheck = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 60) return;
      lastHoverCheck = now;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([...interactables, ...platesGroup.children], false);
      if (hits.length > 0 && hits[0].object.userData?.label) {
        renderer.domElement.style.cursor = 'pointer';
        setHoveredPartLabel(hits[0].object.userData.label);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredPartLabel(null);
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    domElem.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('pointermove', onPointerMove);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Scratch vectors for zero-allocation loop
    const desiredCamPos = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3();
    const clock = new THREE.Clock();

    // Software WebGL fenceSync pacing helper
    const gl = renderer.getContext() as WebGL2RenderingContext;
    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    function afterDraw(cb: () => void) {
      if (!isSoftwareGl || typeof gl.fenceSync !== 'function') {
        rafId = requestAnimationFrame(cb);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = gl.clientWaitSync(sync!, 0, 0);
        if (status === gl.TIMEOUT_EXPIRED) {
          timerId = setTimeout(poll, 16);
          return;
        }
        gl.deleteSync(sync);
        timerId = setTimeout(() => {
          if (!disposed) rafId = requestAnimationFrame(cb);
        }, 80);
      };
      timerId = setTimeout(poll, 16);
    }

    let lastStationTracked: ArenaStationId = 'overview';

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // 1. Camera station transition damping
      const currentStation = stationRef.current;
      const preset = ARENA_CAMERA_PRESETS[currentStation];
      desiredTarget.set(...preset.target);
      controls.target.lerp(desiredTarget, 1 - Math.exp(-5.5 * dt));

      if (currentStation !== lastStationTracked) {
        desiredCamPos.set(...preset.position);
        camera.position.lerp(desiredCamPos, 1 - Math.exp(-4.5 * dt));
        if (camera.position.distanceTo(desiredCamPos) < 0.08) {
          lastStationTracked = currentStation;
        }
      }

      controls.autoRotate = autoRotateRef.current && currentStation === 'overview';
      controls.autoRotateSpeed = 0.85;
      controls.update();

      // 2. Step Spring Physics on Taekwondo Sparring Dummy
      const sp = springStateRef.current;
      if (sp.displacement !== 0 || sp.velocity !== 0) {
        const next = stepSpringPhysics({ displacement: sp.displacement, velocity: sp.velocity }, dt);
        sp.displacement = next.displacement;
        sp.velocity = next.velocity;
        dummyPivot.rotation.x = sp.axisZ * sp.displacement;
        dummyPivot.rotation.z = -sp.axisX * sp.displacement;
      } else {
        dummyPivot.rotation.x = 0;
        dummyPivot.rotation.z = 0;
      }

      // Hit flash decay
      if (hitFlashTimerRef.current > 0) {
        hitFlashTimerRef.current = Math.max(0, hitFlashTimerRef.current - dt);
        const flashIntensity = hitFlashTimerRef.current * 2.2;
        hoguMat.emissive.setHex(0x1a73e8).multiplyScalar(flashIntensity);
        headMat.emissive.setHex(0xfbbc04).multiplyScalar(flashIntensity);
      } else {
        hoguMat.emissive.setHex(0x000000);
        headMat.emissive.setHex(0x000000);
      }

      // 3. Barbell subtle power-clean / rack bounce animation
      if (barbellSquatPhaseRef.current > 0) {
        barbellSquatPhaseRef.current = Math.max(0, barbellSquatPhaseRef.current - dt * 2.2);
        const bounce = Math.sin(barbellSquatPhaseRef.current * Math.PI * 2) * 0.14;
        barbellGroup.position.y = 1.29 + bounce;
      } else {
        barbellGroup.position.y = 1.29;
      }

      // 4. Cultural Dance Stage Rhythm Equalizer animation
      const isRhythm = danceRhythmRef.current;
      rhythmBars.forEach((bar, i) => {
        const targetScaleY = isRhythm ? 0.55 + 0.55 * Math.abs(Math.sin(elapsed * 3.6 + i * 0.85)) : 0.4;
        bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetScaleY, 1 - Math.exp(-8 * dt));
        bar.position.y = 0.18 + (1.2 * bar.scale.y) / 2;
      });

      // 5. Highlight Selected Belt on Rack
      beltMeshes.forEach((mesh, id) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (id === selectedBeltRef.current) {
          mat.emissive.setHex(0x3b82f6);
          mat.emissiveIntensity = 0.45;
          mesh.scale.set(1.06, 1.15, 1.15);
        } else {
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mesh.scale.set(1, 1, 1);
        }
      });

      // 6. Exploded View Inspection Interpolation
      const exp = explodeRef.current;
      for (const item of explodeParts) {
        item.mesh.position.x = item.basePos.x + item.offset.x * exp;
        item.mesh.position.y = item.basePos.y + item.offset.y * exp;
        item.mesh.position.z = item.basePos.z + item.offset.z * exp;
      }

      renderer.render(scene, camera);
      afterDraw(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (timerId !== undefined) clearTimeout(timerId);
      resizeObserver.disconnect();
      domElem.removeEventListener('pointerdown', onPointerDown);
      domElem.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      envTarget.dispose();
      floorTex.dispose();
      matTex.dispose();
      renderer.dispose();
    };
  }, []);

  const currentPreset = ARENA_CAMERA_PRESETS[activeStation];
  const currentBarbellLoadout = calculateBarbellLoad(barbellWeight);
  const currentBeltSpec = TM3_BELT_RANKS.find((b) => b.id === selectedBeltId) || TM3_BELT_RANKS[5];

  return (
    <section
      id="dojang-3d"
      aria-label="Interactive 3D TM3 Dojang and Training Arena"
      className={`${isFullPage ? 'py-6' : 'py-16 border-b border-[#e0e2ec]'} bg-[#f8fafd]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-medium mb-2">
              <Box className="w-3.5 h-3.5" />
              <span>Interactive 3D Spatial Dojang · WebGL Training Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#1f1f1f]">
              Explore the <span className="font-semibold text-[#1a73e8]">TM3 3D Training Arena</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5f6368] mt-1 max-w-2xl">
              Click directly on 3D equipment or use the station controls below to test World Taekwondo electronic Hogu
              scoring, load calibrated Olympic bumper plates, pulse Instructor Derege’s dance stage, and inspect
              Taekwondo belt ranks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToSchedule && (
              <button
                onClick={onNavigateToSchedule}
                className="px-4 py-2 rounded-full text-xs font-medium bg-[#ffffff] hover:bg-[#f1f3f4] text-[#1f1f1f] border border-[#dadce0] transition-colors"
              >
                View Full Class Schedule
              </button>
            )}
            <button
              onClick={() => {
                setIsRegistrationOpen(true);
                showToast('Opening TM3 Registration & 4-Digit PIN Claim Modal');
              }}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-xs transition-colors"
            >
              Book Trial Session ($80/mo)
            </button>
          </div>
        </div>

        {/* 3D Viewport Container */}
        <div
          data-testid="dojang-3d-viewport"
          data-station={activeStation}
          className={`relative w-full ${
            isFullPage ? 'h-[640px] sm:h-[700px]' : 'h-[540px] sm:h-[620px]'
          } rounded-3xl overflow-hidden border border-[#dadce0] shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-[#0f141d] select-none`}
        >
          {/* Dedicated Empty Canvas Mount Div (Zero sibling interference) */}
          <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

          {/* Fallback / Initializing State */}
          {!webglReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0f141d] text-white z-20">
              <div className="text-center space-y-2">
                <Box className="w-8 h-8 text-[#1a73e8] mx-auto" />
                <div className="text-sm font-medium">Initializing TM3 3D Spatial Dojang...</div>
              </div>
            </div>
          )}

          {/* Top-Left Floating Station Telemetry Card (No backdrop-blur over WebGL canvas) */}
          <div className="absolute top-4 left-4 z-10 max-w-xs sm:max-w-sm bg-[#111827]/95 border border-white/15 rounded-2xl p-4 text-white pointer-events-auto shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#1a73e8]/30 text-[#93c5fd] border border-[#1a73e8]/40">
                {currentPreset.badge}
              </span>
              {activeStation !== 'overview' && (
                <button
                  onClick={() => handleSelectStation('overview')}
                  className="text-[11px] text-[#93c5fd] hover:text-white flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Camera</span>
                </button>
              )}
            </div>

            <h3 className="text-base font-semibold text-white leading-snug">{currentPreset.labelEn}</h3>
            <p className="text-[11px] text-[#cbd5e1] mt-1 leading-relaxed">{currentPreset.description}</p>

            <div className="mt-2.5 pt-2.5 border-t border-white/10 text-[11px] space-y-1 text-[#94a3b8]">
              <div className="flex items-center justify-between">
                <span className="text-[#cbd5e1] font-medium">Lead Instructor:</span>
                <span className="text-white">{currentPreset.instructor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#cbd5e1] font-medium">Schedule:</span>
                <span className="text-[#fbbc04] font-mono text-[10px]">{currentPreset.scheduleSummary}</span>
              </div>
            </div>
          </div>

          {/* Top-Right Live Scoreboard & Equipment Readout */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
            <div className="bg-[#111827]/95 border border-white/15 rounded-2xl px-4 py-3 text-white shadow-lg flex items-center gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">WT Sparring Score</div>
                <div
                  data-testid="sparring-score-value"
                  className="text-2xl font-bold font-mono tabular-nums text-[#fbbc04]"
                >
                  {sparringScore} <span className="text-xs font-normal text-[#cbd5e1]">pts</span>
                </div>
              </div>

              <div className="h-8 w-px bg-white/15" />

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">Combo Streak</div>
                <div className="text-lg font-bold font-mono tabular-nums text-[#34a853]">{comboStreak}x</div>
              </div>

              <div className="h-8 w-px bg-white/15 hidden sm:block" />

              <div className="hidden sm:block">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">Olympic Bar Load</div>
                <div className="text-sm font-bold font-mono tabular-nums text-[#60a5fa]">
                  {currentBarbellLoadout.totalWeightKg} kg ({currentBarbellLoadout.totalLbs} lbs)
                </div>
              </div>
            </div>

            {/* Last Strike Callout Banner */}
            {lastStrike && (
              <div className="bg-[#1e293b]/95 border border-[#fbbc04]/50 rounded-xl px-3.5 py-2 text-xs text-white shadow-md flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#fbbc04] shrink-0" />
                <div>
                  <span className="font-semibold text-[#fbbc04]">+{lastStrike.totalAwarded} pts</span> ·{' '}
                  <span>{lastStrike.label}</span>
                  {lastStrike.comboBonus > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-[#34a853]/30 text-[#86efac] text-[10px] font-mono">
                      3-Hit Combo +1!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Hover Raycast Tooltip */}
            {hoveredPartLabel && (
              <div className="bg-[#1a73e8] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-md">
                {hoveredPartLabel}
              </div>
            )}
          </div>

          {/* Unified Collapsible Bottom Control Dock */}
          <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-auto">
            <div className="max-w-5xl mx-auto bg-[#111827]/95 border border-white/15 rounded-2xl text-white shadow-2xl overflow-hidden">
              {/* Dock Header Bar with Collapse Toggle */}
              <div className="px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(Object.keys(ARENA_CAMERA_PRESETS) as ArenaStationId[]).map((stationKey) => {
                    const preset = ARENA_CAMERA_PRESETS[stationKey];
                    const isSelected = activeStation === stationKey;
                    return (
                      <button
                        key={stationKey}
                        onClick={() => handleSelectStation(stationKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#1a73e8] text-white font-semibold'
                            : 'bg-white/5 hover:bg-white/15 text-[#cbd5e1]'
                        }`}
                      >
                        {stationKey === 'overview' && <Compass className="w-3.5 h-3.5" />}
                        {stationKey === 'taekwondo' && <Target className="w-3.5 h-3.5" />}
                        {stationKey === 'workout' && <Dumbbell className="w-3.5 h-3.5" />}
                        {stationKey === 'dance' && <Music className="w-3.5 h-3.5" />}
                        {stationKey === 'belts' && <Trophy className="w-3.5 h-3.5" />}
                        <span>{preset.labelEn}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoRotate((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                      autoRotate
                        ? 'bg-[#34a853]/20 border-[#34a853]/50 text-[#86efac]'
                        : 'bg-white/5 border-white/10 text-[#94a3b8]'
                    }`}
                  >
                    {autoRotate ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}
                  </button>

                  <button
                    onClick={() => setControlsCollapsed((prev) => !prev)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1 transition-colors"
                  >
                    {controlsCollapsed ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>▴ Show Controls</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>▾ Hide Controls</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Interactive Action Deck */}
              {!controlsCollapsed && (
                <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Left 8 Cols: Station-Specific Interactive Controls */}
                  <div className="lg:col-span-8 flex flex-wrap items-center gap-2">
                    {/* Sparring Target Strike Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] mr-1">
                        WT Sparring Strikes:
                      </span>
                      <button
                        onClick={() => handleStrike('trunk_punch')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-white/10 text-xs font-medium text-white transition-colors"
                      >
                        Punch (1 pt)
                      </button>
                      <button
                        onClick={() => handleStrike('trunk_kick')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-xs font-medium text-white transition-colors"
                      >
                        Body Kick (2 pts)
                      </button>
                      <button
                        onClick={() => handleStrike('head_kick')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#ea4335] hover:bg-[#c5221f] text-xs font-medium text-white transition-colors"
                      >
                        Head Kick (3 pts)
                      </button>
                      <button
                        onClick={() => handleStrike('spinning_head_kick')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#fbbc04] hover:bg-[#f29900] text-[#1f1f1f] text-xs font-semibold transition-colors"
                      >
                        Spinning Hook Kick (5 pts)
                      </button>
                    </div>

                    <div className="h-5 w-px bg-white/15 hidden sm:block mx-1" />

                    {/* Olympic Barbell Weight Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]">Barbell:</span>
                      {([60, 100, 140, 180] as BarbellWeightKg[]).map((w) => (
                        <button
                          key={w}
                          onClick={() => handleChangeBarbellWeight(w)}
                          className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
                            barbellWeight === w
                              ? 'bg-[#34a853] text-white font-bold'
                              : 'bg-white/5 hover:bg-white/15 text-[#cbd5e1]'
                          }`}
                        >
                          {w}kg
                        </button>
                      ))}
                    </div>

                    {/* Belt Selector when on Belts station */}
                    {activeStation === 'belts' && (
                      <div className="w-full pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {TM3_BELT_RANKS.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSelectedBeltId(b.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                selectedBeltId === b.id
                                  ? 'bg-[#fbbc04] text-[#1f1f1f] font-semibold'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {b.rankName.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-[#cbd5e1]">
                          <strong className="text-[#fbbc04]">{currentBeltSpec.rankName}</strong> · Tenet:{' '}
                          <span className="text-white">{currentBeltSpec.tenet}</span> — {currentBeltSpec.focus}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right 4 Cols: Exploded View Slider & Dance Toggle */}
                  <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-4">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="explode-slider"
                        className="text-[11px] font-mono uppercase tracking-wider text-[#cbd5e1] flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#60a5fa]" />
                        <span>Exploded View: {Math.round(explodeFactor * 100)}%</span>
                      </label>
                      <input
                        id="explode-slider"
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={explodeFactor}
                        onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                        className="w-28 accent-[#1a73e8] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setDanceRhythmActive((prev) => !prev)}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                          danceRhythmActive
                            ? 'bg-[#a855f7]/30 border border-[#a855f7]/60 text-[#e9d5ff]'
                            : 'bg-white/5 border border-white/10 text-[#94a3b8]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{danceRhythmActive ? 'Dance Stage Pulse: ON' : 'Dance Stage Pulse: OFF'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSparringScore(0);
                          setComboStreak(0);
                          setLastStrike(null);
                          setExplodeFactor(0);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] text-[#cbd5e1]"
                      >
                        Reset Score
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Play, Pause, ChevronLeft, ChevronRight, MapPin, Building2, ArrowRight } from 'lucide-react';
import { resolveAsset } from '../../utils/assets';

interface TacticalGlobeHUDProps {
  onDeploySector?: (sector: string) => void;
}

export interface AttractiveOfferTarget {
  id: string;
  name: string;
  role: string;
  city: string;
  flag: string;
  country: string;
  coordsText: string;
  lat: number;
  lon: number;
  matchScore: number;
  framework: string;
  salary: string;
  requirements: string[];
  sectorKey: string;
  color: string;
  colorHex: number;
}

const ATTRACTIVE_OFFERS: AttractiveOfferTarget[] = [
  {
    id: 'off-bc3',
    name: 'BC3 Basque Centre for Climate Change',
    role: 'Investigador en Modelación de Carbono & Servicios Ecosistémicos',
    city: 'Bilbao',
    flag: '🇪🇸',
    country: 'Euskadi / España',
    coordsText: '43.33° N, 2.99° W',
    lat: 43.33,
    lon: -2.99,
    matchScore: 98,
    framework: '🇪🇸 Ley 14/2013 UGE • Vía nacionalidad en 2 años',
    salary: '42.000 € - 52.000 € / año',
    requirements: ['Biogeoquímica de Suelos', 'Modelación de Carbono', 'R / Python', 'GIS'],
    sectorKey: 'bilbao',
    color: '#059669',
    colorHex: 0x059669
  },
  {
    id: 'off-gfz',
    name: 'GFZ Helmholtz German Research Centre for Geosciences',
    role: 'Scientist in Quantitative Geodesy & Satellite Earth Observation',
    city: 'Potsdam',
    flag: '🇩🇪',
    country: 'Alemania',
    coordsText: '52.38° N, 13.06° E',
    lat: 52.38,
    lon: 13.06,
    matchScore: 95,
    framework: '🇩🇪 §20 AufenthG • Centros Federales Helmholtz',
    salary: 'TVöD Bund E14 (~54.000 € / año)',
    requirements: ['Geofísica Cuantitativa', 'InSAR / Sensores Remotos', 'Python', 'Series Temporales'],
    sectorKey: 'kiel',
    color: '#0369a1',
    colorHex: 0x0369a1
  },
  {
    id: 'off-tecnalia',
    name: 'Tecnalia Research & Innovation',
    role: 'Especialista en Teledetección Satelital & Transición Energética',
    city: 'Derio',
    flag: '🇪🇸',
    country: 'Euskadi / España',
    coordsText: '43.29° N, 2.87° W',
    lat: 43.29,
    lon: -2.87,
    matchScore: 95,
    framework: '🇪🇸 Ley 14/2013 • Ecosistema Tecnológico BRTA',
    salary: '40.000 € - 50.000 € / año',
    requirements: ['QGIS / ArcGIS Pro', 'Google Earth Engine', 'Balance Hídrico', 'Automatización'],
    sectorKey: 'bilbao',
    color: '#10b981',
    colorHex: 0x10b981
  },
  {
    id: 'off-idom',
    name: 'IDOM Consulting, Engineering & Architecture',
    role: 'Consultor Ambiental Senior en Hidrología & Salvaguardias',
    city: 'Bilbao',
    flag: '🇪🇸',
    country: 'Euskadi / Internacional',
    coordsText: '43.26° N, 2.93° W',
    lat: 43.26,
    lon: -2.93,
    matchScore: 94,
    framework: '🇪🇸 Ley 14/2013 • Licitaciones Banco Mundial / BID',
    salary: '42.000 € - 55.000 € / año',
    requirements: ['Modelación Hidrológica', 'Salvaguardias Socioambientales', 'Inglés C2', 'Gestión Multiactor'],
    sectorKey: 'bilbao',
    color: '#059669',
    colorHex: 0x059669
  },
  {
    id: 'off-unep',
    name: 'UNEP IMEO (International Methane Emissions Observatory)',
    role: 'IMEO Methane Alert & Response Implementation Coordinator',
    city: 'París',
    flag: '🌐',
    country: 'Internacional / Remoto UE',
    coordsText: '48.85° N, 2.35° E',
    lat: 48.85,
    lon: 2.35,
    matchScore: 92,
    framework: '🌐 Teletrabajo Transfronterizo UE • Naciones Unidas',
    salary: 'Consultoría Especializada ONU (Escala P3)',
    requirements: ['Monitoreo Satelital MARS', 'Mitigación de Metano', 'Diplomacia Climática', 'Español / Inglés'],
    sectorKey: 'offers',
    color: '#d97706',
    colorHex: 0xd97706
  },
  {
    id: 'off-uchile',
    name: 'Universidad de Chile (FCFM) / Red Andina',
    role: 'Cooperación Iberoamericana en Geofísica Aplicada & Riesgos',
    city: 'Santiago',
    flag: '🇨🇱',
    country: 'Chile',
    coordsText: '33.45° S, 70.67° W',
    lat: -33.45,
    lon: -70.67,
    matchScore: 90,
    framework: '🇨🇱 Pasaporte Chileno • Convenio Bilateral de Investigación',
    salary: 'Proyectos Bilaterales & Asesoría Estratégica',
    requirements: ['Geofísica FCFM', 'Mecánica de Suelos', 'Riesgos Naturales', 'Sistemas Andinos'],
    sectorKey: 'santiago',
    color: '#ca8a04',
    colorHex: 0xca8a04
  }
];

const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

export const TacticalGlobeHUD: React.FC<TacticalGlobeHUDProps> = ({ onDeploySector }) => {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const activeOffer = ATTRACTIVE_OFFERS[activeOfferIndex];
  const activeOfferRef = useRef(activeOffer);
  const activeIndexRef = useRef(activeOfferIndex);

  useEffect(() => {
    activeOfferRef.current = activeOffer;
    activeIndexRef.current = activeOfferIndex;
  }, [activeOffer, activeOfferIndex]);

  // Auto-cycle through attractive offers every 8 seconds
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveOfferIndex(prev => (prev + 1) % ATTRACTIVE_OFFERS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Three.js Photorealistic 3D Earth Globe HUD (Direct from Portfolio App)
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animId: number;
    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 480;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.7);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const updateSize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // 3. Earth Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 4. Textures Loading (NASA Blue Marble 4096 + Normal Relief 2048 + Specular 2048 + Clouds 1024)
    const textureLoader = new THREE.TextureLoader();
    const dayMap = textureLoader.load(resolveAsset('/earth/earth_day_4096.jpg'));
    dayMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const normalMap = textureLoader.load(resolveAsset('/earth/earth_normal_2048.jpg'));
    const specMap = textureLoader.load(resolveAsset('/earth/earth_specular_2048.jpg'));
    const cloudsMap = textureLoader.load(resolveAsset('/earth/earth_clouds_1024.png'));

    // 5. Main Earth Sphere (Real Continents, Oceans & Mountain Relief Shadows)
    const earthRadius = 2.05;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: dayMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(1.6, 1.6), // Pronounced 3D relief on Andes, Himalayas, Alps, Pyrenees!
      specularMap: specMap,
      specular: new THREE.Color(0x305075), // Realistic water specularity
      shininess: 28,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 6. Clouds Sphere (Drifting Atmospheric Cloud Layer)
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.014, 64, 64);
    const cloudsMat = new THREE.MeshLambertMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    // 7. Atmospheric Space Halo (Glowing Blue Edge)
    const haloGeo = new THREE.SphereGeometry(earthRadius * 1.035, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          gl_FragColor = vec4(0.32, 0.68, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    earthGroup.add(haloMesh);

    // 8. Cinematic Lighting
    // Directional Sunlight (Angle creating realistic mountain relief shadows)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.3);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    // Ambient space light for clear continent visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.68);
    scene.add(ambientLight);

    // Blue rim light for orbital depth
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
    rimLight.position.set(-6, -2, -3);
    scene.add(rimLight);

    // 9. Mission 3D Pushpins & Pennants
    const hitObjects: THREE.Object3D[] = [];
    ATTRACTIVE_OFFERS.forEach((m, mIdx) => {
      const pos = latLngToVector3(m.lat, m.lon, earthRadius * 1.002);
      const norm = pos.clone().normalize();

      const bGroup = new THREE.Group();
      bGroup.position.copy(pos);
      bGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);

      // 1. Base Grommet / Pinhole shadow on surface
      const holeGeo = new THREE.RingGeometry(0.008, 0.028, 24);
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.rotation.x = Math.PI / 2;
      bGroup.add(hole);

      // 2. Slender Metallic Steel Needle / Mast
      const needleGeo = new THREE.CylinderGeometry(0.0035, 0.0035, 0.20, 8);
      const needleMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.position.y = 0.10;
      bGroup.add(needle);

      // 3. Round Ball Pinhead
      const capGeo = new THREE.SphereGeometry(0.018, 16, 16);
      const capMat = new THREE.MeshBasicMaterial({ color: m.colorHex });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 0.205;
      bGroup.add(cap);

      // 4. Map Pushpin Flag Pennant
      const flagCanvas = document.createElement('canvas');
      flagCanvas.width = 144;
      flagCanvas.height = 84;
      const fCtx = flagCanvas.getContext('2d');
      if (fCtx) {
        fCtx.fillStyle = m.color;
        fCtx.fillRect(0, 0, 144, 84);
        fCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        fCtx.fillRect(0, 0, 144, 42);
        fCtx.lineWidth = 6;
        fCtx.strokeStyle = '#000000';
        fCtx.strokeRect(3, 3, 138, 78);
        fCtx.font = '34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        fCtx.textAlign = 'center';
        fCtx.textBaseline = 'middle';
        fCtx.fillText(m.flag, 42, 42);
        fCtx.fillStyle = '#ffffff';
        fCtx.font = 'bold 22px monospace';
        fCtx.fillText(m.city.slice(0, 4).toUpperCase(), 102, 43);

        const flagTex = new THREE.CanvasTexture(flagCanvas);
        const flagGeo = new THREE.PlaneGeometry(0.14, 0.082);
        const flagMat = new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide });
        const flagMesh = new THREE.Mesh(flagGeo, flagMat);
        flagMesh.position.set(0.070, 0.155, 0);
        bGroup.add(flagMesh);
      }

      // Invisible Hit-Test Sphere for easy mouse/touch click detection
      const hitGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitSphere = new THREE.Mesh(hitGeo, hitMat);
      hitSphere.position.y = 0.12;
      hitSphere.userData = { offerIndex: mIdx };
      bGroup.add(hitSphere);
      hitObjects.push(hitSphere);

      earthGroup.add(bGroup);
    });

    // 10. Active Target Reticle (Graphic Action Burst in Comic Yellow & Black)
    const reticleGroup = new THREE.Group();
    const pulseRingGeo = new THREE.RingGeometry(0.045, 0.075, 32);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15, // Comic Yellow #facc15
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.rotation.x = Math.PI / 2;
    reticleGroup.add(pulseRing);

    const outerBlackRingGeo = new THREE.RingGeometry(0.078, 0.094, 32);
    const outerBlackRingMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });
    const outerBlackRing = new THREE.Mesh(outerBlackRingGeo, outerBlackRingMat);
    outerBlackRing.rotation.x = Math.PI / 2;
    reticleGroup.add(outerBlackRing);

    earthGroup.add(reticleGroup);

    // 10.5 Energy Flight Beams connecting hubs (Bilbao <-> Kiel, Bilbao <-> Paris, Bilbao <-> Santiago)
    const flightGroup = new THREE.Group();
    const arcPairs = [
      { from: 0, to: 1, color: 0x10b981 }, // Bilbao <-> Kiel
      { from: 0, to: 5, color: 0xfbbf24 }, // Bilbao <-> Paris
      { from: 0, to: 6, color: 0x38bdf8 }, // Bilbao <-> Santiago
    ];

    interface BeamArc {
      curve: THREE.QuadraticBezierCurve3;
      speed: number;
      offset: number;
      headCore: THREE.Mesh;
      headGlow: THREE.Mesh;
    }
    const beamArcs: BeamArc[] = [];

    arcPairs.forEach((pair, pIdx) => {
      const fromM = ATTRACTIVE_OFFERS[pair.from];
      const toM = ATTRACTIVE_OFFERS[pair.to];
      const posA = latLngToVector3(fromM.lat, fromM.lon, earthRadius * 1.002);
      const posB = latLngToVector3(toM.lat, toM.lon, earthRadius * 1.002);

      const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
      const dist = posA.distanceTo(posB);
      mid.normalize().multiplyScalar(earthRadius + Math.max(0.18, dist * 0.22));

      const curve = new THREE.QuadraticBezierCurve3(posA, mid, posB);

      // Glowing tube
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.005, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: pair.color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      flightGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

      // Head core & glow
      const headCoreGeo = new THREE.SphereGeometry(0.015, 8, 8);
      const headCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending });
      const headCore = new THREE.Mesh(headCoreGeo, headCoreMat);
      flightGroup.add(headCore);

      const headGlowGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const headGlowMat = new THREE.MeshBasicMaterial({ color: pair.color, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
      const headGlow = new THREE.Mesh(headGlowGeo, headGlowMat);
      flightGroup.add(headGlow);

      beamArcs.push({
        curve,
        speed: 0.12 + pIdx * 0.02,
        offset: pIdx * 0.33,
        headCore,
        headGlow
      });
    });
    earthGroup.add(flightGroup);

    // Initial Globe Orientation (Focus on current target)
    const initVec = latLngToVector3(activeOfferRef.current.lat, activeOfferRef.current.lon, 1).normalize();
    const currentQuat = new THREE.Quaternion().setFromUnitVectors(initVec, new THREE.Vector3(0, 0, 1));
    const targetQuat = currentQuat.clone();
    earthGroup.quaternion.copy(currentQuat);

    // Interaction State: Drag to Rotate + Inertia Momentum + Click to Select
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let totalDrag = 0;
    let velX = 0;
    let velY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      totalDrag = 0;
      velX = 0;
      velY = 0;
      setIsAutoRotating(false);
      try {
        mount.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      totalDrag += Math.abs(dx) + Math.abs(dy);
      prevX = e.clientX;
      prevY = e.clientY;

      velX = dx * 0.005;
      velY = dy * 0.005;

      const rotY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * 0.005);
      const rotX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * 0.005);
      earthGroup.quaternion.premultiply(rotY);
      earthGroup.quaternion.premultiply(rotX);
      targetQuat.copy(earthGroup.quaternion);
    };

    const onPointerUp = (e: PointerEvent) => {
      try {
        mount.releasePointerCapture(e.pointerId);
      } catch {}

      if (isDragging && totalDrag < 8) {
        // Detect click on any beacon pin
        const rect = mount.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(hitObjects, false);
        if (intersects.length > 0) {
          const hitIdx = intersects[0].object.userData.offerIndex;
          if (typeof hitIdx === 'number') {
            setActiveOfferIndex(hitIdx);
            setIsAutoRotating(false);
          }
        }
      }
      isDragging = false;
    };

    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Continuous 60FPS Animation Loop
    let lastOfferId = activeOfferRef.current.id;
    const render = () => {
      // If target offer changed, smoothly slerp to target coordinates
      if (activeOfferRef.current.id !== lastOfferId) {
        lastOfferId = activeOfferRef.current.id;
        const v = latLngToVector3(activeOfferRef.current.lat, activeOfferRef.current.lon, 1).normalize();
        targetQuat.setFromUnitVectors(v, new THREE.Vector3(0, 0, 1));
        velX = 0;
        velY = 0;
      }

      if (isDragging) {
        // Direct pointer tracking
      } else if (Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001) {
        // Natural friction inertia
        const rotY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), velX);
        const rotX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), velY);
        earthGroup.quaternion.premultiply(rotY);
        earthGroup.quaternion.premultiply(rotX);
        targetQuat.copy(earthGroup.quaternion);
        velX *= 0.92;
        velY *= 0.92;
      } else {
        earthGroup.quaternion.slerp(targetQuat, 0.055);
      }

      // Atmospheric cloud drift
      cloudsMesh.rotation.y += 0.00035;

      // Update target reticle position and pulse animation
      const curTarget = activeOfferRef.current;
      const activePos = latLngToVector3(curTarget.lat, curTarget.lon, earthRadius * 1.004);
      reticleGroup.position.copy(activePos);
      reticleGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), activePos.clone().normalize());

      const pulse = (Date.now() % 1400) / 1400;
      pulseRing.scale.setScalar(1 + pulse * 2.0);
      pulseRingMat.opacity = 1 - pulse;

      // Update energy beams along arcs
      const fTime = Date.now() * 0.001;
      beamArcs.forEach(({ curve, speed, offset, headCore, headGlow }) => {
        const t = (fTime * speed + offset) % 1;
        const headPos = curve.getPoint(t);
        headCore.position.copy(headPos);
        headGlow.position.copy(headPos);
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
    };
  }, []);

  const handleSelectOffer = (idx: number) => {
    setActiveOfferIndex(idx);
    setIsAutoRotating(false);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#0c1322]/95 p-6 sm:p-8 shadow-xl text-slate-800 dark:text-slate-100 font-sans transition-colors"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.90) 45%, rgba(255, 255, 255, 0.76) 100%), url('/sunset_clouds_sky.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Subtle warm atmospheric glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />

      {/* Main Grid: Left Column (Paneles/Ofertas) + Right Column (Globo Ampliado) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column (lg:col-span-6): Telemetry Offer Dossier & Destination Chips */}
        <div className="lg:col-span-6 space-y-3.5 order-2 lg:order-1">
          
          {/* Quick Target Destination Chips */}
          <div className="flex flex-wrap gap-1.5">
            {ATTRACTIVE_OFFERS.map((target, idx) => (
              <button
                key={target.id}
                onClick={() => handleSelectOffer(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border ${
                  activeOfferIndex === idx
                    ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-md scale-102'
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 shadow-2xs backdrop-blur-xs'
                }`}
                title={`Rotar hacia ${target.city}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: target.color }} />
                <span>{target.flag} {target.city}</span>
                <span className="text-[10px] opacity-80 font-mono font-bold">({target.matchScore}%)</span>
              </button>
            ))}
          </div>

          {/* Active Attractive Offer Dossier Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-4 shadow-sm relative backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{activeOffer.flag} {activeOffer.city} • {activeOffer.country}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-400 font-normal">{activeOffer.coordsText}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-snug">
                  {activeOffer.role}
                </h3>
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mt-1">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{activeOffer.name}</span>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-black text-xs font-mono shrink-0 shadow-xs">
                {activeOffer.matchScore}% MATCH
              </div>
            </div>

            {/* Strategic Attributes Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Marco Legal & Visado</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">{activeOffer.framework}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Retribución Estimada</span>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-bold">{activeOffer.salary}</span>
              </div>
            </div>

            {/* Requirements / Tags */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Competencias Demandadas:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeOffer.requirements.map(req => (
                  <span key={req} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            {onDeploySector && (
              <div className="pt-2">
                <button
                  onClick={() => onDeploySector(activeOffer.sectorKey)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition uppercase tracking-wider cursor-pointer"
                >
                  <span>Explorar Ofertas de este Sector</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (lg:col-span-6): Enlarged Three.js 3D Earth Globe with Controls */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center select-none order-1 lg:order-2">
          <div className="relative cursor-grab active:cursor-grabbing flex items-center justify-center w-full max-w-[480px] aspect-square">
            
            {/* Soft Radial Ambient Drop Shadow on White Card */}
            <div className="absolute inset-x-10 bottom-2 h-14 bg-radial from-slate-900/35 via-slate-800/15 to-transparent rounded-full blur-md pointer-events-none transform scale-y-50" />

            {/* Three.js Mount Container */}
            <div
              ref={mountRef}
              className="w-full h-full flex items-center justify-center rounded-full overflow-hidden"
              title="Arrastra con el ratón para rotar el planeta libremente o haz clic en cualquier pin"
            />

            {/* Drag Hint Tooltip */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md px-3.5 py-1 rounded-full text-[11px] font-sans text-slate-700 dark:text-slate-200 pointer-events-none backdrop-blur-xs flex items-center gap-1.5 whitespace-nowrap">
              <span>🌍 Three.js NASA 4K</span>
              <span className="text-slate-400">•</span>
              <span>Arrastra para rotar</span>
            </div>
          </div>

          {/* Smooth Rotation Controls */}
          <div className="flex items-center gap-2 mt-4 justify-center">
            <button
              onClick={() => {
                setActiveOfferIndex((activeOfferIndex - 1 + ATTRACTIVE_OFFERS.length) % ATTRACTIVE_OFFERS.length);
                setIsAutoRotating(false);
              }}
              className="p-2 rounded-xl bg-white/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
              title="Oferta anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer border shadow-xs ${
                isAutoRotating
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Alternar rotación automática"
            >
              {isAutoRotating ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Pausar Rotación</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Activar Rotación</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setActiveOfferIndex((activeOfferIndex + 1) % ATTRACTIVE_OFFERS.length);
                setIsAutoRotating(false);
              }}
              className="p-2 rounded-xl bg-white/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
              title="Siguiente oferta"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

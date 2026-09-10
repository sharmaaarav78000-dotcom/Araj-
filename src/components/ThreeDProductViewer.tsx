import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Layers, Sparkles, Move, Eye } from 'lucide-react';
import { Product } from '../types';
import { playLuxuryChime } from '../utils/sound';

interface ThreeDProductViewerProps {
  product: Product;
  className?: string;
  autoRotateInit?: boolean;
}

export const ThreeDProductViewer: React.FC<ThreeDProductViewerProps> = ({
  product,
  className = '',
  autoRotateInit = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotateInit);
  const [isExploded, setIsExploded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // References to communicate with the Three.js scene
  const sceneContextRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    pouchGroup: THREE.Group;
    innerCore: THREE.Mesh;
    frontFace: THREE.Mesh;
    backFace: THREE.Mesh;
    goldSeal: THREE.Mesh;
    aromaParticles: THREE.Points;
    targetRotation: { x: number; y: number };
    currentRotation: { x: number; y: number };
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    autoRotate: boolean;
    zoom: number;
    exploded: boolean;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 320;
    let height = container.clientHeight || 360;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.5);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const frontKey = new THREE.DirectionalLight(0xfffae6, 2.2);
    frontKey.position.set(3, 5, 5);
    scene.add(frontKey);

    const goldRim = new THREE.DirectionalLight(0xd4af37, 2.0);
    goldRim.position.set(-4, -2, -3);
    scene.add(goldRim);

    const topSoft = new THREE.PointLight(0xf6e05e, 1.5, 12);
    topSoft.position.set(0, 4, 3);
    scene.add(topSoft);

    // Root Group for the 3D Product Pouch
    const pouchGroup = new THREE.Group();
    scene.add(pouchGroup);

    // --- Canvas Texture Generation for Front & Back Pouch ---
    // Front Label Canvas Texture
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 512;
    frontCanvas.height = 768;
    const fCtx = frontCanvas.getContext('2d');
    if (fCtx) {
      // Pouch background gradient
      const bgGrad = fCtx.createLinearGradient(0, 0, 512, 768);
      bgGrad.addColorStop(0, '#161622');
      bgGrad.addColorStop(0.5, '#0E0E14');
      bgGrad.addColorStop(1, '#0A0A0E');
      fCtx.fillStyle = bgGrad;
      fCtx.fillRect(0, 0, 512, 768);

      // Gold Foil Metallic Border
      fCtx.strokeStyle = '#D4AF37';
      fCtx.lineWidth = 14;
      fCtx.strokeRect(20, 20, 472, 728);

      fCtx.strokeStyle = '#E6CA65';
      fCtx.lineWidth = 3;
      fCtx.strokeRect(32, 32, 448, 704);

      // Top Header: Brand Name
      fCtx.fillStyle = '#D4AF37';
      fCtx.font = 'bold 34px serif';
      fCtx.textAlign = 'center';
      fCtx.fillText('मुंशी पन्ना मसाले', 256, 85);

      fCtx.fillStyle = '#F5DE88';
      fCtx.font = 'bold 16px sans-serif';
      fCtx.fillText('MUNSHI PANNA SPICES • ESTD. 1985', 256, 115);

      // Category / Certification Tag
      fCtx.fillStyle = '#48BB78';
      fCtx.font = 'bold 13px sans-serif';
      fCtx.fillText('★ 100% AGMARK CERTIFIED PURE ★', 256, 142);

      // Middle Window with product accent
      fCtx.fillStyle = '#1A1A24';
      fCtx.fillRect(50, 160, 412, 360);
      fCtx.strokeStyle = '#D4AF37';
      fCtx.lineWidth = 4;
      fCtx.strokeRect(50, 160, 412, 360);

      // Product Name in Hindi & English
      fCtx.fillStyle = '#FFFFFF';
      fCtx.font = 'bold 36px serif';
      fCtx.fillText(product.name.split('(')[0].trim(), 256, 220);

      fCtx.fillStyle = '#E6CA65';
      fCtx.font = 'italic bold 22px serif';
      fCtx.fillText(product.hindiName || product.name, 256, 260);

      // Volatile Oils Lock & Low Temp Grinding Stamp
      fCtx.fillStyle = '#CBD5E0';
      fCtx.font = '14px sans-serif';
      fCtx.fillText('• Natural Volatile Oils Locked •', 256, 320);
      fCtx.fillText('• Traditional Low-Temp Grinding •', 256, 345);
      fCtx.fillText('• 0% Starch & 0% Artificial Color •', 256, 370);

      // Imperial Gold Badge Emblem
      fCtx.beginPath();
      fCtx.arc(256, 440, 45, 0, Math.PI * 2);
      fCtx.fillStyle = '#D4AF37';
      fCtx.fill();
      fCtx.lineWidth = 3;
      fCtx.strokeStyle = '#FFFFFF';
      fCtx.stroke();

      fCtx.fillStyle = '#0A0A0E';
      fCtx.font = 'bold 14px sans-serif';
      fCtx.fillText('AGRA', 256, 435);
      fCtx.fillText('HERITAGE', 256, 452);

      // Price & Weight Footer Bar
      fCtx.fillStyle = '#1A1A24';
      fCtx.fillRect(40, 540, 432, 120);
      fCtx.strokeStyle = '#D4AF37';
      fCtx.lineWidth = 2;
      fCtx.strokeRect(40, 540, 432, 120);

      fCtx.fillStyle = '#D4AF37';
      fCtx.font = 'bold 36px sans-serif';
      fCtx.fillText(`₹${product.price}`, 256, 595);

      fCtx.fillStyle = '#A0AEC0';
      fCtx.font = 'bold 16px sans-serif';
      fCtx.fillText(`NET WEIGHT: ${product.weight}`, 256, 630);

      // Barcode simulation at bottom
      fCtx.fillStyle = '#FFFFFF';
      fCtx.fillRect(156, 680, 200, 40);
      fCtx.fillStyle = '#000000';
      for (let b = 165; b < 345; b += 7) {
        fCtx.fillRect(b, 685, Math.random() > 0.4 ? 4 : 2, 30);
      }
    }

    // Back Label Canvas Texture
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 512;
    backCanvas.height = 768;
    const bCtx = backCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#111118';
      bCtx.fillRect(0, 0, 512, 768);

      bCtx.strokeStyle = '#D4AF37';
      bCtx.lineWidth = 8;
      bCtx.strokeRect(20, 20, 472, 728);

      bCtx.fillStyle = '#D4AF37';
      bCtx.font = 'bold 24px serif';
      bCtx.textAlign = 'center';
      bCtx.fillText('MUNSHI PANNA QUALITY ASSURANCE', 256, 75);

      bCtx.fillStyle = '#FFFFFF';
      bCtx.font = '14px sans-serif';
      bCtx.fillText('FSSAI Lic. No: 10018051002598', 256, 110);
      bCtx.fillText('Agmark Grade: SPECIAL QUALITY', 256, 135);

      // Nutrition table simulation
      bCtx.fillStyle = '#1A1A26';
      bCtx.fillRect(50, 160, 412, 220);
      bCtx.strokeStyle = '#D4AF37';
      bCtx.strokeRect(50, 160, 412, 220);

      bCtx.fillStyle = '#F5DE88';
      bCtx.font = 'bold 16px sans-serif';
      bCtx.fillText('NUTRITIONAL VALUES (Per 100g)', 256, 190);

      bCtx.fillStyle = '#E2E8F0';
      bCtx.font = '13px sans-serif';
      bCtx.textAlign = 'left';
      bCtx.fillText('Energy (kcal) ......................... 340', 80, 230);
      bCtx.fillText('Protein (g) ............................. 12.8', 80, 260);
      bCtx.fillText('Dietary Fiber (g) ..................... 21.4', 80, 290);
      bCtx.fillText('Essential Curcumin / Oils ..... High Grade', 80, 320);
      bCtx.fillText('Synthetic Adulterants ............. ZERO', 80, 350);

      // Seal & batch stamp
      bCtx.textAlign = 'center';
      bCtx.fillStyle = '#48BB78';
      bCtx.font = 'bold 18px sans-serif';
      bCtx.fillText('✓ 100% VEGETARIAN & NATURAL', 256, 425);

      bCtx.fillStyle = '#CBD5E0';
      bCtx.font = '13px sans-serif';
      bCtx.fillText('Mfd. By: Munshi Panna Heritage Spice Mills', 256, 465);
      bCtx.fillText('Rawatpara, Agra, Uttar Pradesh - 282003', 256, 490);
      bCtx.fillText('Direct Consumer Help: +91 562 246 1985', 256, 515);

      // Holographic QR Simulation
      bCtx.fillStyle = '#FFFFFF';
      bCtx.fillRect(206, 550, 100, 100);
      bCtx.fillStyle = '#000000';
      bCtx.fillRect(216, 560, 30, 30);
      bCtx.fillRect(266, 560, 30, 30);
      bCtx.fillRect(216, 610, 30, 30);
      bCtx.fillStyle = '#D4AF37';
      bCtx.font = 'bold 11px sans-serif';
      bCtx.fillText('SCAN FOR LAB COA', 256, 675);
    }

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    const backTexture = new THREE.CanvasTexture(backCanvas);

    // Front Face (Curved Standup Pouch Geometry)
    const frontGeo = new THREE.PlaneGeometry(2.4, 3.4, 32, 32);
    // Add realistic curved pouch bulging
    const pos = frontGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Subtle pillow bulge in the center
      const bulge = Math.cos((x / 1.2) * (Math.PI / 2)) * Math.cos((y / 1.7) * (Math.PI / 2)) * 0.22;
      pos.setZ(i, bulge);
    }
    frontGeo.computeVertexNormals();

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.32,
      metalness: 0.45,
      side: THREE.FrontSide,
    });
    const frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.position.z = 0.05;
    pouchGroup.add(frontMesh);

    // Back Face
    const backGeo = frontGeo.clone();
    backGeo.rotateY(Math.PI);
    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.35,
      metalness: 0.4,
      side: THREE.FrontSide,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -0.05;
    pouchGroup.add(backMesh);

    // Top Crimped Seal Bar (Metallic Gold Zip Lock)
    const sealGeo = new THREE.BoxGeometry(2.48, 0.22, 0.14);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.9,
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.position.set(0, 1.78, 0);
    pouchGroup.add(sealMesh);

    // Bottom Gusset Stand
    const bottomGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.12, 24);
    bottomGeo.scale(1, 1, 0.32);
    const bottomMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      roughness: 0.6,
      metalness: 0.3,
    });
    const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat);
    bottomMesh.position.set(0, -1.72, 0);
    pouchGroup.add(bottomMesh);

    // Inner Core Layer (Aroma Barrier & Pure Spice Grain)
    const spiceColorHex = product.category.toLowerCase().includes('haldi') 
      ? 0xf6e05e 
      : product.name.toLowerCase().includes('mirch') 
      ? 0xdc2626 
      : 0xd97706;

    const innerGeo = new THREE.BoxGeometry(2.1, 3.0, 0.2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: spiceColorHex,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    innerCore.position.set(0, 0, 0);
    innerCore.visible = false; // Toggled via explode mode
    pouchGroup.add(innerCore);

    // Orbiting 3D Aroma Sparks
    const aromaGeo = new THREE.BufferGeometry();
    const aromaCount = 60;
    const aromaPos = new Float32Array(aromaCount * 3);
    for (let i = 0; i < aromaCount; i++) {
      const rad = 1.6 + Math.random() * 0.9;
      const th = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.5;
      aromaPos[i * 3] = Math.cos(th) * rad;
      aromaPos[i * 3 + 1] = y;
      aromaPos[i * 3 + 2] = Math.sin(th) * rad;
    }
    aromaGeo.setAttribute('position', new THREE.BufferAttribute(aromaPos, 3));

    const aromaMat = new THREE.PointsMaterial({
      color: 0xf5de88,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const aromaParticles = new THREE.Points(aromaGeo, aromaMat);
    pouchGroup.add(aromaParticles);

    // Subtle initial angle
    pouchGroup.rotation.y = 0.35;
    pouchGroup.rotation.x = 0.08;

    sceneContextRef.current = {
      scene,
      camera,
      renderer,
      pouchGroup,
      innerCore,
      frontFace: frontMesh,
      backFace: backMesh,
      goldSeal: sealMesh,
      aromaParticles,
      targetRotation: { x: 0.08, y: 0.35 },
      currentRotation: { x: 0.08, y: 0.35 },
      isDragging: false,
      prevMousePos: { x: 0, y: 0 },
      autoRotate: autoRotateInit,
      zoom: 1,
      exploded: false,
    };

    // --- Mouse & Touch Interaction Handlers ---
    const dom = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if (!sceneContextRef.current) return;
      sceneContextRef.current.isDragging = true;
      sceneContextRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
      setIsRotating(false);
      sceneContextRef.current.autoRotate = false;
      dom.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const ctx = sceneContextRef.current;
      if (!ctx || !ctx.isDragging) return;

      const deltaX = e.clientX - ctx.prevMousePos.x;
      const deltaY = e.clientY - ctx.prevMousePos.y;

      ctx.targetRotation.y += deltaX * 0.012;
      ctx.targetRotation.x = Math.max(-0.6, Math.min(0.6, ctx.targetRotation.x + deltaY * 0.012));

      ctx.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!sceneContextRef.current) return;
      sceneContextRef.current.isDragging = false;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const ctx = sceneContextRef.current;
      if (!ctx) return;
      const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
      const newZoom = Math.max(0.6, Math.min(1.8, ctx.zoom * zoomFactor));
      ctx.zoom = newZoom;
      setZoomLevel(newZoom);
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !sceneContextRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // --- Render Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const ctx = sceneContextRef.current;
      if (!ctx) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Auto rotation if active
      if (ctx.autoRotate && !ctx.isDragging) {
        ctx.targetRotation.y += delta * 0.45;
      }

      // Smooth lerp rotation
      ctx.currentRotation.x += (ctx.targetRotation.x - ctx.currentRotation.x) * 0.1;
      ctx.currentRotation.y += (ctx.targetRotation.y - ctx.currentRotation.y) * 0.1;

      ctx.pouchGroup.rotation.x = ctx.currentRotation.x;
      ctx.pouchGroup.rotation.y = ctx.currentRotation.y;

      // Floating bobbing effect
      ctx.pouchGroup.position.y = Math.sin(elapsed * 1.5) * 0.1;

      // Zoom smooth lerp
      camera.position.z = 7.5 / ctx.zoom;

      // Explode animation transition
      if (ctx.exploded) {
        ctx.frontFace.position.z = THREE.MathUtils.lerp(ctx.frontFace.position.z, 0.9, 0.1);
        ctx.backFace.position.z = THREE.MathUtils.lerp(ctx.backFace.position.z, -0.9, 0.1);
        ctx.innerCore.visible = true;
      } else {
        ctx.frontFace.position.z = THREE.MathUtils.lerp(ctx.frontFace.position.z, 0.05, 0.1);
        ctx.backFace.position.z = THREE.MathUtils.lerp(ctx.backFace.position.z, -0.05, 0.1);
        if (Math.abs(ctx.frontFace.position.z - 0.05) < 0.05) {
          ctx.innerCore.visible = false;
        }
      }

      // Orbit particles around the pouch
      ctx.aromaParticles.rotation.y = elapsed * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);

      renderer.dispose();
      frontGeo.dispose();
      backGeo.dispose();
      sealGeo.dispose();
      bottomGeo.dispose();
      innerGeo.dispose();
      aromaGeo.dispose();
      frontMat.dispose();
      backMat.dispose();
      sealMat.dispose();
      bottomMat.dispose();
      innerMat.dispose();
      aromaMat.dispose();
      frontTexture.dispose();
      backTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [product]);

  const toggleAutoRotate = () => {
    const nextState = !isRotating;
    setIsRotating(nextState);
    if (sceneContextRef.current) {
      sceneContextRef.current.autoRotate = nextState;
    }
    playLuxuryChime('sparkle');
  };

  const toggleExplode = () => {
    const nextState = !isExploded;
    setIsExploded(nextState);
    if (sceneContextRef.current) {
      sceneContextRef.current.exploded = nextState;
    }
    playLuxuryChime('sparkle');
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!sceneContextRef.current) return;
    const factor = direction === 'in' ? 1.2 : 0.83;
    const newZoom = Math.max(0.6, Math.min(1.8, sceneContextRef.current.zoom * factor));
    sceneContextRef.current.zoom = newZoom;
    setZoomLevel(newZoom);
    playLuxuryChime('sparkle');
  };

  const handleResetAngle = () => {
    if (!sceneContextRef.current) return;
    sceneContextRef.current.targetRotation = { x: 0.08, y: 0.35 };
    sceneContextRef.current.zoom = 1;
    setZoomLevel(1);
    playLuxuryChime('sparkle');
  };

  return (
    <div
      className={`relative w-full h-full min-h-[340px] flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#14141E]/90 to-[#0A0A0E]/95 border border-[#D4AF37]/35 shadow-2xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top 3D Indicator Badge & Controls */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/45 text-[#F5DE88] text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-md pointer-events-auto">
          <Eye className="w-3 h-3 text-[#D4AF37]" />
          <span>3D WebGL Pouch</span>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={toggleExplode}
            title={isExploded ? 'Collapse 3D Pouch' : 'Explode Pouch Aroma Layers'}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
              isExploded
                ? 'bg-[#D4AF37] text-[#0A0A0E]'
                : 'bg-black/50 text-[#DFDACD] hover:text-[#D4AF37] border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleAutoRotate}
            title={isRotating ? 'Pause 3D rotation' : 'Auto-rotate 3D'}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
              isRotating
                ? 'bg-[#D4AF37] text-[#0A0A0E]'
                : 'bg-black/50 text-[#DFDACD] hover:text-[#D4AF37] border border-white/10'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 rounded-full bg-black/50 text-[#DFDACD] hover:text-[#D4AF37] border border-white/10 backdrop-blur-md transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 rounded-full bg-black/50 text-[#DFDACD] hover:text-[#D4AF37] border border-white/10 backdrop-blur-md transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetAngle}
            title="Reset Perspective"
            className="px-2 py-1 rounded-full bg-black/50 text-[10px] font-mono text-[#DFDACD] hover:text-[#D4AF37] border border-white/10 backdrop-blur-md transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Mounting Point */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative z-10"
      />

      {/* Interactive Helper Hint at the bottom */}
      <div className="absolute bottom-2.5 inset-x-0 flex justify-center z-30 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-[#A6A295] font-medium backdrop-blur-md">
          <Move className="w-3 h-3 text-[#D4AF37]" />
          <span>Drag to rotate 360° • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};

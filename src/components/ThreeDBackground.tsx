import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
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

    const scene = new THREE.Scene();

    let width = window.innerWidth;
    let height = window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambientLight);

    const goldenKeyLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    goldenKeyLight.position.set(10, 12, 10);
    scene.add(goldenKeyLight);

    const crimsonRimLight = new THREE.DirectionalLight(0xe53e3e, 1.4);
    crimsonRimLight.position.set(-10, -8, -5);
    scene.add(crimsonRimLight);

    const saffronPoint = new THREE.PointLight(0xf59e0b, 2.5, 30);
    saffronPoint.position.set(0, 0, 5);
    scene.add(saffronPoint);

    // Group for all floating 3D spice objects
    const spiceGroup = new THREE.Group();
    scene.add(spiceGroup);

    // Materials
    const starAniseMat = new THREE.MeshStandardMaterial({
      color: 0x5c2c16,
      roughness: 0.65,
      metalness: 0.15,
      bumpScale: 0.05,
    });

    const cardamomMat = new THREE.MeshStandardMaterial({
      color: 0x4a7c39,
      roughness: 0.5,
      metalness: 0.1,
    });

    const cloveMat = new THREE.MeshStandardMaterial({
      color: 0x3d1c10,
      roughness: 0.7,
      metalness: 0.2,
    });

    const goldCrystalMat = new THREE.MeshStandardMaterial({
      color: 0xe6ca65,
      roughness: 0.25,
      metalness: 0.85,
    });

    const chiliRedMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.35,
      metalness: 0.15,
    });

    const chiliStemMat = new THREE.MeshStandardMaterial({
      color: 0x365314,
      roughness: 0.6,
      metalness: 0.05,
    });

    // Helper: Create 3D Star Anise
    const createStarAnise = (): THREE.Group => {
      const group = new THREE.Group();
      const centerGeo = new THREE.SphereGeometry(0.22, 12, 12);
      const centerMesh = new THREE.Mesh(centerGeo, starAniseMat);
      group.add(centerMesh);

      const rayCount = 8;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const petalGeo = new THREE.ConeGeometry(0.16, 0.85, 6);
        petalGeo.rotateX(Math.PI / 2);
        const petalMesh = new THREE.Mesh(petalGeo, starAniseMat);
        petalMesh.position.set(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0);
        petalMesh.rotation.z = angle - Math.PI / 2;
        petalMesh.rotation.x = (Math.random() - 0.5) * 0.25;
        group.add(petalMesh);
      }
      return group;
    };

    // Helper: Create 3D Cardamom Pod
    const createCardamom = (): THREE.Group => {
      const group = new THREE.Group();
      const podGeo = new THREE.SphereGeometry(0.3, 14, 14);
      podGeo.scale(0.7, 1.45, 0.7);
      const podMesh = new THREE.Mesh(podGeo, cardamomMat);
      group.add(podMesh);

      const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.25, 6);
      const stemMesh = new THREE.Mesh(stemGeo, cloveMat);
      stemMesh.position.y = 0.45;
      group.add(stemMesh);
      return group;
    };

    // Helper: Create 3D Clove
    const createClove = (): THREE.Group => {
      const group = new THREE.Group();
      const stemGeo = new THREE.CylinderGeometry(0.07, 0.05, 0.65, 8);
      const stemMesh = new THREE.Mesh(stemGeo, cloveMat);
      group.add(stemMesh);

      const headGeo = new THREE.SphereGeometry(0.14, 10, 10);
      const headMesh = new THREE.Mesh(headGeo, cloveMat);
      headMesh.position.y = 0.35;
      group.add(headMesh);

      // 4 calyx buds
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const budGeo = new THREE.ConeGeometry(0.05, 0.14, 4);
        const budMesh = new THREE.Mesh(budGeo, cloveMat);
        budMesh.position.set(Math.cos(angle) * 0.1, 0.32, Math.sin(angle) * 0.1);
        budMesh.rotation.z = Math.cos(angle) * 0.4;
        budMesh.rotation.x = Math.sin(angle) * 0.4;
        group.add(budMesh);
      }
      return group;
    };

    // Helper: Create 3D Curved Red Chili
    const createRedChili = (): THREE.Group => {
      const group = new THREE.Group();
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, -0.7, 0),
        new THREE.Vector3(0.25, 0, 0),
        new THREE.Vector3(0, 0.7, 0)
      );
      const chiliGeo = new THREE.TubeGeometry(curve, 16, 0.16, 8, false);
      const chiliMesh = new THREE.Mesh(chiliGeo, chiliRedMat);
      group.add(chiliMesh);

      const capGeo = new THREE.ConeGeometry(0.18, 0.25, 6);
      capGeo.rotateX(Math.PI);
      const capMesh = new THREE.Mesh(capGeo, chiliStemMat);
      capMesh.position.set(0, 0.75, 0);
      group.add(capMesh);

      return group;
    };

    // Helper: Create Golden Geometric Crystal
    const createGoldCrystal = (): THREE.Mesh => {
      const geo = Math.random() > 0.5 
        ? new THREE.IcosahedronGeometry(0.25, 0)
        : new THREE.DodecahedronGeometry(0.24, 0);
      return new THREE.Mesh(geo, goldCrystalMat);
    };

    // Spawn collection of 3D Spices in the environment
    interface SpiceItem {
      mesh: THREE.Object3D;
      rotSpeed: { x: number; y: number; z: number };
      floatSpeed: number;
      floatOffset: number;
      baseY: number;
    }

    const items: SpiceItem[] = [];
    const count = Math.min(22, Math.max(12, Math.floor(width / 75)));

    for (let i = 0; i < count; i++) {
      let obj: THREE.Object3D;
      const typeChoice = i % 5;
      if (typeChoice === 0) {
        obj = createStarAnise();
      } else if (typeChoice === 1) {
        obj = createCardamom();
      } else if (typeChoice === 2) {
        obj = createClove();
      } else if (typeChoice === 3) {
        obj = createRedChili();
      } else {
        obj = createGoldCrystal();
      }

      // Random position spread across 3D space
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 14 - 2;

      obj.position.set(x, y, z);
      const s = 0.8 + Math.random() * 0.6;
      obj.scale.set(s, s, s);

      obj.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      spiceGroup.add(obj);

      items.push({
        mesh: obj,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.012,
          y: (Math.random() - 0.5) * 0.016,
          z: (Math.random() - 0.5) * 0.012,
        },
        floatSpeed: 0.4 + Math.random() * 0.6,
        floatOffset: Math.random() * Math.PI * 2,
        baseY: y,
      });
    }

    // --- 3D Golden Dust Cloud (BufferGeometry) ---
    const dustCount = Math.min(180, Math.floor(width / 7));
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustScales = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 1;
      dustScales[i] = Math.random() * 0.8 + 0.4;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    // Circle texture for soft glowing particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 235, 150, 1)');
      grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
      grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const dustMat = new THREE.PointsMaterial({
      size: 0.35,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustCloud = new THREE.Points(dustGeo, dustMat);
    scene.add(dustCloud);

    // --- Mouse & Gyro Parallax Tracking ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        mouse.targetX = Math.min(1, Math.max(-1, e.gamma / 30));
        mouse.targetY = Math.min(1, Math.max(-1, (e.beta - 45) / 30));
      }
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    window.addEventListener('resize', onResize);

    // --- Animation Loop ---
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 2.2;
      camera.position.y = mouse.y * 1.6;
      camera.lookAt(0, 0, 0);

      // Rotate and float 3D spice objects
      items.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;

        item.mesh.position.y = item.baseY + Math.sin(elapsed * item.floatSpeed + item.floatOffset) * 0.45;
      });

      // Slowly rotate the golden dust field
      dustCloud.rotation.y = elapsed * 0.025;
      dustCloud.rotation.x = Math.sin(elapsed * 0.02) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      window.removeEventListener('resize', onResize);

      // Dispose resources
      renderer.dispose();
      starAniseMat.dispose();
      cardamomMat.dispose();
      cloveMat.dispose();
      goldCrystalMat.dispose();
      chiliRedMat.dispose();
      chiliStemMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      particleTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ opacity: 0.88 }}
    />
  );
};

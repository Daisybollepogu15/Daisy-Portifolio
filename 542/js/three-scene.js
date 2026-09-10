/* ==========================================================================
   THREE.JS 3D SCENES - DAISY BOLLEPOGU PORTFOLIO
   1. Cyber Cosmos Background (Particles, Gravitational Wave, Mouse Vortex)
   2. 3D Floating Polyhedra in Space Depth
   3. Interactive 3D Skill Galaxy Sphere (Draggable, Hover Raycaster, Orbitals)
   ========================================================================== */

(function () {
  'use strict';

  // --- Check Three.js availability ---
  if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded.');
    return;
  }

  /* ========================================================================
     1. BACKGROUND CYBER COSMOS SCENE
     ======================================================================== */
  const bgCanvas = document.getElementById('webgl-bg-canvas');
  if (!bgCanvas) return;

  const bgRenderer = new THREE.WebGLRenderer({
    canvas: bgCanvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  bgCamera.position.z = 500;

  // Mouse & Parallax Coordinates
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // Particle Cosmos Setup
  const particleCount = 1600;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const basePositions = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f0ff);
  const colorPurple = new THREE.Color(0xa855f7);
  const colorBlue = new THREE.Color(0x3b82f6);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = THREE.MathUtils.randFloat(150, 900);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = THREE.MathUtils.randFloat(0, Math.PI);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;

    // Distribute neon color gradients
    let chosenColor;
    const rVal = Math.random();
    if (rVal < 0.45) chosenColor = colorCyan;
    else if (rVal < 0.75) chosenColor = colorPurple;
    else if (rVal < 0.9) chosenColor = colorBlue;
    else chosenColor = colorWhite;

    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Custom Circular Glow Texture for Particles
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(0, 240, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  bgScene.add(particleSystem);

  // Floating Cyber Geometric Polyhedra
  const floatingObjects = [];

  function createFloatingShape(geometry, color, x, y, z, rotSpeed) {
    const wireMat = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const mesh = new THREE.Mesh(geometry, wireMat);
    mesh.position.set(x, y, z);
    bgScene.add(mesh);
    floatingObjects.push({ mesh, rotSpeed, baseX: x, baseY: y, baseZ: z });
  }

  createFloatingShape(new THREE.IcosahedronGeometry(60, 1), 0x00f0ff, -320, 140, 50, { x: 0.005, y: 0.007 });
  createFloatingShape(new THREE.OctahedronGeometry(50, 1), 0xa855f7, 340, -120, -40, { x: -0.006, y: 0.008 });
  createFloatingShape(new THREE.TorusGeometry(70, 2, 16, 100), 0x3b82f6, 260, 220, -100, { x: 0.008, y: 0.004 });
  createFloatingShape(new THREE.DodecahedronGeometry(45, 0), 0x10b981, -280, -200, -80, { x: 0.007, y: -0.005 });

  // Ambient lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  bgScene.add(ambientLight);

  // Event Listeners for background parallax
  window.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX - windowHalfX) * 0.4;
    targetMouseY = (e.clientY - windowHalfY) * 0.4;
  });

  window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    bgCamera.aspect = width / height;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(width, height);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /* ========================================================================
     2. 3D INTERACTIVE SKILL GALAXY SPHERE
     ======================================================================== */
  const skillCanvas = document.getElementById('skill-sphere-canvas');
  let skillRenderer, skillScene, skillCamera;
  const skillNodes = [];
  let isDraggingSkill = false;
  let previousPointerPosition = { x: 0, y: 0 };
  let skillSphereGroup;

  const skillsData = [
    { name: 'Python', category: 'Language', color: 0x00f0ff, size: 14 },
    { name: 'Java', category: 'Core', color: 0xa855f7, size: 14 },
    { name: 'C Language', category: 'Systems', color: 0x3b82f6, size: 13 },
    { name: 'HTML5 / Web', category: 'Full Stack', color: 0xec4899, size: 14 },
    { name: 'Quantum Comp', category: 'NPTEL Certified', color: 0x00f0ff, size: 16 },
    { name: 'VS Code', category: 'Dev Tool', color: 0x38bdf8, size: 12 },
    { name: 'Data Structures', category: 'Algorithms', color: 0x10b981, size: 13 },
    { name: 'SIH Hackathon', category: 'Innovation', color: 0xf59e0b, size: 15 },
    { name: 'Git & GitHub', category: 'VCS Tool', color: 0xa855f7, size: 12 },
    { name: 'Problem Solving', category: 'Soft Skill', color: 0x10b981, size: 12 },
    { name: 'MS Office', category: 'Productivity', color: 0x94a3b8, size: 11 },
    { name: 'Full Stack Dev', category: 'Architecture', color: 0x00f0ff, size: 15 }
  ];

  if (skillCanvas) {
    const container = skillCanvas.parentElement;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    skillRenderer = new THREE.WebGLRenderer({
      canvas: skillCanvas,
      alpha: true,
      antialias: true
    });
    skillRenderer.setSize(width, height);
    skillRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    skillScene = new THREE.Scene();
    skillCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    skillCamera.position.z = 240;

    skillSphereGroup = new THREE.Group();
    skillScene.add(skillSphereGroup);

    // Central Wireframe Quantum Core
    const coreGeo = new THREE.SphereGeometry(30, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    skillSphereGroup.add(coreMesh);

    // Orbital Quantum Rings
    function createOrbitRing(radius, tiltX, tiltY, color) {
      const ringGeo = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      skillSphereGroup.add(ring);
      return ring;
    }

    const ring1 = createOrbitRing(65, Math.PI / 3, 0, 0x00f0ff);
    const ring2 = createOrbitRing(75, -Math.PI / 4, Math.PI / 4, 0xa855f7);
    const ring3 = createOrbitRing(85, 0, Math.PI / 2.5, 0x3b82f6);

    // Function to create text badge texture
    function createSkillTexture(text, category, colorHex) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 128;
      const ctx = c.getContext('2d');

      // Pill Background
      ctx.fillStyle = 'rgba(7, 12, 32, 0.85)';
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(10, 20, 236, 88, 24);
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px Orbitron, sans-serif';
      ctx.fillText(text, 128, 54);

      ctx.fillStyle = colorHex;
      ctx.font = '500 18px "Fira Code", monospace';
      ctx.fillText(category, 128, 86);

      const texture = new THREE.CanvasTexture(c);
      return texture;
    }

    // Distribute Skills Spherically (Fibonacci Sphere Algorithm)
    const phiAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    const sphereRadius = 88;

    skillsData.forEach((skill, idx) => {
      const y = 1 - (idx / (skillsData.length - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiAngle * idx;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const posX = x * sphereRadius;
      const posY = y * sphereRadius;
      const posZ = z * sphereRadius;

      // Node Sphere
      const nodeGeo = new THREE.SphereGeometry(3.5, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: skill.color,
        wireframe: false
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(posX, posY, posZ);

      // Sprite Label for Skill
      const colorString = '#' + skill.color.toString(16).padStart(6, '0');
      const spriteMat = new THREE.SpriteMaterial({
        map: createSkillTexture(skill.name, skill.category, colorString),
        transparent: true,
        depthTest: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(posX * 1.08, posY * 1.08, posZ * 1.08);
      sprite.scale.set(38, 19, 1);

      skillSphereGroup.add(nodeMesh);
      skillSphereGroup.add(sprite);

      skillNodes.push({
        mesh: nodeMesh,
        sprite: sprite,
        data: skill,
        basePos: new THREE.Vector3(posX, posY, posZ)
      });
    });

    // Mouse Drag Controls for 3D Skill Sphere
    skillCanvas.addEventListener('mousedown', function (e) {
      isDraggingSkill = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', function () {
      isDraggingSkill = false;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDraggingSkill) return;
      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      skillSphereGroup.rotation.y += deltaX * 0.008;
      skillSphereGroup.rotation.x += deltaY * 0.008;

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    });

    // Touch Support for Mobile
    skillCanvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDraggingSkill = true;
        previousPointerPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDraggingSkill = false;
    });

    window.addEventListener('touchmove', function (e) {
      if (!isDraggingSkill || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousPointerPosition.x;
      const deltaY = e.touches[0].clientY - previousPointerPosition.y;

      skillSphereGroup.rotation.y += deltaX * 0.008;
      skillSphereGroup.rotation.x += deltaY * 0.008;

      previousPointerPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    // Resize Handler for Skill Sphere
    window.addEventListener('resize', function () {
      if (!skillCanvas.parentElement) return;
      const w = skillCanvas.parentElement.clientWidth;
      const h = skillCanvas.parentElement.clientHeight || 400;
      skillCamera.aspect = w / h;
      skillCamera.updateProjectionMatrix();
      skillRenderer.setSize(w, h);
    });
  }

  /* ========================================================================
     3. ANIMATION RENDER LOOP
     ======================================================================== */
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Parallax Camera Motion for Cyber Cosmos
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    bgCamera.position.x = mouseX * 0.5;
    bgCamera.position.y = -mouseY * 0.5;
    bgCamera.lookAt(bgScene.position);

    // Gentle rotation of the entire particle cosmos
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = elapsedTime * 0.015;

    // Fluid particle wave motion
    const positionsAttr = particleGeometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];

      positionsAttr.array[i3 + 1] = by + Math.sin(elapsedTime * 1.5 + bx * 0.01) * 8;
      positionsAttr.array[i3] = bx + Math.cos(elapsedTime * 1.2 + bz * 0.01) * 6;
    }
    positionsAttr.needsUpdate = true;

    // Rotate floating geometric polyhedra
    floatingObjects.forEach((obj) => {
      obj.mesh.rotation.x += obj.rotSpeed.x;
      obj.mesh.rotation.y += obj.rotSpeed.y;
      obj.mesh.position.y = obj.baseY + Math.sin(elapsedTime + obj.baseX) * 12;
    });

    bgRenderer.render(bgScene, bgCamera);

    // Render Skill Galaxy
    if (skillRenderer && skillScene && skillCamera && skillSphereGroup) {
      if (!isDraggingSkill) {
        skillSphereGroup.rotation.y += 0.005;
        skillSphereGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.15;
      }
      skillRenderer.render(skillScene, skillCamera);
    }
  }

  animate();

})();

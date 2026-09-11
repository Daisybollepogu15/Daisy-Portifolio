/* ==========================================================================
   MAIN CONTROLLER - DAISY BOLLEPOGU PORTFOLIO
   Includes:
   - Custom Cyber Cursor & Ambient Light
   - Web Audio API Sci-Fi Synthesizer (Hover / Click / Modal SFX)
   - Hero Role Typewriter
   - 3D Hologram Card Tilt & Glare Tracking
   - Interactive Project Details Modal System
   - Interactive Cyber Terminal CLI
   - Contact Form & 1-Click Clipboard Utilities
   - Telemetry Clock (IST / Vijayawada)
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. WEB AUDIO API SCI-FI SOUND SYNTHESIZER
     ======================================================================== */
  let audioCtx = null;
  let isMuted = localStorage.getItem('cyber_portfolio_muted') === 'true';

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSciFiSound(type) {
    if (isMuted) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        // High soft digital blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        // Futuristic cyber resonance
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'success') {
        // Double harmony ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.06); // A5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'terminal') {
        // Terminal keystroke chirp
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (err) {
      // Audio autoplay policy handled silently
    }
  }

  // Audio Mute Toggle Button
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  function updateAudioButtonUI() {
    if (!audioToggleBtn) return;
    if (isMuted) {
      audioToggleBtn.classList.remove('active');
      audioToggleBtn.setAttribute('title', 'Unmute Sci-Fi Audio');
      audioToggleBtn.innerHTML = '<i data-lucide="volume-x"></i>';
    } else {
      audioToggleBtn.classList.add('active');
      audioToggleBtn.setAttribute('title', 'Mute Sci-Fi Audio');
      audioToggleBtn.innerHTML = '<i data-lucide="volume-2"></i>';
    }
    if (window.lucide) window.lucide.createIcons();
  }

  if (audioToggleBtn) {
    updateAudioButtonUI();
    audioToggleBtn.addEventListener('click', () => {
      initAudioContext();
      isMuted = !isMuted;
      localStorage.setItem('cyber_portfolio_muted', isMuted);
      updateAudioButtonUI();
      if (!isMuted) playSciFiSound('click');
    });
  }

  /* ========================================================================
     2. CUSTOM DYNAMIC CYBER CURSOR & AMBIENT GLOW
     ======================================================================== */
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');
  const ambientOrb = document.getElementById('ambient-glow-orb');

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;

  window.addEventListener('mousemove', (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;

    if (cursorDot) {
      cursorDot.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
    }

    if (ambientOrb) {
      ambientOrb.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
    }
  });

  // Smooth lagging ring loop
  function updateCursorRing() {
    ringX += (pointerX - ringX) * 0.18;
    ringY += (pointerY - ringY) * 0.18;

    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateCursorRing);
  }
  updateCursorRing();

  // Attach hover sounds & cursor expanding to interactive elements
  const interactiveSelector = 'a, button, input, textarea, .tech-badge-chip, .skill-tag-pill, .project-card, .timeline-content-card, .holo-profile-card, .cert-hologram-card';

  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      playSciFiSound('hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
    el.addEventListener('click', () => {
      playSciFiSound('click');
    });
  });

  /* ========================================================================
     3. HERO ROLE TYPEWRITER
     ======================================================================== */
  const typingElement = document.querySelector('.typing-text');
  const roles = [
    'Full Stack Developer',
    'Quantum Computing Enthusiast',
    'B.Tech CSE Innovator',
    'Smart India Hackathon Participant',
    'Algorithmic Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    if (!typingElement) return;

    const currentRole = roles[roleIdx];
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeRole, typingSpeed);
  }

  typeRole();

  /* ========================================================================
     4. 3D HOLOGRAM CARD TILT & SPECULAR GLARE
     ======================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt="true"]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = -((y - centerY) / centerY) * 12; // Max 12 deg tilt
      const rotY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Set glare coordinates
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ========================================================================
     5. PROJECT MODAL DETAILS SYSTEM
     ======================================================================== */
  const projectDetails = {
    1: {
      title: 'Quantum Algorithm Simulator & Visualizer',
      subtitle: 'NPTEL Certified Quantum Computing Architecture',
      category: 'Quantum Computing / WebGL',
      image: 'assets/project-quantum.jpg',
      tags: ['Quantum Computing', 'Bloch Sphere', 'Python', 'Three.js', 'Complex Vectors', 'NPTEL'],
      description: 'An advanced interactive quantum computing simulator inspired by Daisy’s NPTEL Certification in Quantum Computing. Allows students and engineers to visualize single and multi-qubit state evolutions on the 3D Bloch sphere, execute quantum logic gates (Hadamard, Pauli-X, Phase-Shift, CNOT), and compute superposition collapse probability distributions in real time.',
      architecture: [
        'Interactive 3D Bloch Sphere rendered using Three.js with dynamic state vector coordinates (|ψ⟩ = α|0⟩ + β|1⟩).',
        'State probability analyzer calculating amplitude squares (|α|² + |β|² = 1) with quantum decoherence visualization.',
        'Quantum gate matrix visualizer demonstrating unitary transformations.'
      ],
      link: '#',
      github: 'https://github.com'
    },
    2: {
      title: 'Smart India Hackathon (SIH) Innovation Hub',
      subtitle: 'National Hackathon Project for Urban Intelligence',
      category: 'Civic Tech / Smart Cities / SIH 2024',
      image: 'assets/project-sih.jpg',
      tags: ['Hackathon Finalist', 'Java', 'Python', 'Web Dev', 'IoT Telemetry', 'Civic Solutions'],
      description: 'Developed under high-intensity competition in the Smart India Hackathon (SIH). This project addresses urban infrastructure bottlenecks by ingesting real-time civic reports and IoT sensor streams to route emergency response and public works teams efficiently with automated priority clustering.',
      architecture: [
        'Decentralized reporting portal with automatic geo-tagging and severity classification.',
        'Analytical dashboard tracking energy load, traffic heatmaps, and municipal incident resolution pipelines.',
        'Team collaboration pipeline demonstrating rapid prototyping and agile delivery.'
      ],
      link: '#',
      github: 'https://github.com'
    },
    3: {
      title: 'CyberSphere - 3D Developer Portfolio',
      subtitle: 'Award-Winning WebGL & GSAP Cyberpunk Showcase',
      category: 'Full Stack Web / Creative Tech',
      image: 'assets/project-portfolio.jpg',
      tags: ['Three.js', 'GSAP', 'HTML5', 'CSS3 Glassmorphism', 'Web Audio API', 'SEO'],
      description: 'A futuristic digital workspace floating in outer space engineered for Daisy Bollepogu. Built with custom WebGL particle networks, interactive 3D skill galaxies, holographic HUD glassmorphism, synthesized sound feedback, and high-performance smooth animations.',
      architecture: [
        'Custom WebGL particle cosmos with 1,600+ stars reacting to mouse gravity and camera parallax.',
        'Interactive 3D Skill Sphere built with Fibonacci spherical distribution and mouse drag physics.',
        'Zero-dependency Web Audio API synthesizer generating real-time sci-fi sound effects.'
      ],
      link: '#',
      github: 'https://github.com'
    },
    4: {
      title: 'Algorithmic Problem Solver & Code Analyzer',
      subtitle: 'Core Computational Systems in C, Java & Python',
      category: 'Data Structures / Core Computing',
      image: 'assets/project-algo.jpg',
      tags: ['C Language', 'Java', 'Python', 'Data Structures', 'Sorting Algorithms', 'Complexity Analysis'],
      description: 'A core computer science suite implementing fundamental data structures (Binary Search Trees, AVL Trees, Heaps, Graph traversals) and sorting algorithms (Quicksort, Mergesort) with live step-by-step memory and time complexity profiling.',
      architecture: [
        'Interactive Binary Tree visualizer supporting real-time insertions, deletions, and tree re-balancing.',
        'Comparative sorting engine tracking comparison swaps and asymptotic runtime.',
        'Robust foundational implementations across C, Java, and Python.'
      ],
      link: '#',
      github: 'https://github.com'
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openProjectModal(id) {
    const data = projectDetails[id];
    if (!data || !modalBody || !modalOverlay) return;

    modalBody.innerHTML = `
      <div style="position: relative; margin-bottom: 24px; border-radius: 14px; overflow: hidden; border: 1px solid var(--neon-cyan);">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 260px; object-fit: cover; display: block;" />
        <span class="project-category-tag" style="top: 14px; left: 14px;">${data.category}</span>
      </div>
      <h2 style="font-family: var(--font-cyber); font-size: 1.6rem; color: #fff; margin-bottom: 6px;">${data.title}</h2>
      <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-cyan); margin-bottom: 18px;">// ${data.subtitle}</p>
      
      <p style="font-size: 1rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 24px;">${data.description}</p>
      
      <h4 style="font-family: var(--font-cyber); font-size: 1rem; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="cpu" style="color: var(--neon-purple); width: 18px; height: 18px;"></i>
        Key Architectural Modules
      </h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
        ${data.architecture.map((item) => `
          <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; color: #94a3b8;">
            <i data-lucide="check-circle-2" style="color: var(--neon-cyan); width: 16px; height: 16px; flex-shrink: 0; margin-top: 4px;"></i>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>

      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
        ${data.tags.map((t) => `<span class="tech-mini-chip" style="color: var(--neon-cyan); border-color: var(--border-neon);">${t}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 14px; align-items: center;">
        <a href="#contact" class="btn-primary-neon" onclick="document.getElementById('project-modal').classList.remove('active');" style="padding: 10px 20px; font-size: 0.8rem;">
          <i data-lucide="send" style="width: 16px; height: 16px;"></i> Inquire About Project
        </a>
        <a href="${data.github}" target="_blank" class="btn-secondary-glass" style="padding: 10px 18px; font-size: 0.8rem;">
          <i data-lucide="github" style="width: 16px; height: 16px;"></i> GitHub Repo
        </a>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    modalOverlay.classList.add('active');
    playSciFiSound('success');
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      playSciFiSound('click');
    }
  }

  document.querySelectorAll('[data-project-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ========================================================================
     6. INTERACTIVE CYBER TERMINAL CLI
     ======================================================================== */
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  const termCommands = {
    help: () => `
<span class="highlight">AVAILABLE CYBER COMMANDS:</span>
  • <span class="purple">about</span>      - Access Daisy Bollepogu's identity dossier
  • <span class="purple">skills</span>     - Query technical proficiencies & developer tools
  • <span class="purple">projects</span>   - Enumerate key projects & architectural achievements
  • <span class="purple">quantum</span>    - Display NPTEL Quantum Computing credentials
  • <span class="purple">sih</span>        - Display Smart India Hackathon participation records
  • <span class="purple">education</span>  - Retrieve academic timeline (B.Tech CSE, MPC, SSC)
  • <span class="purple">contact</span>    - Show direct transmission coordinates (phone, email)
  • <span class="purple">download</span>   - Download Daisy's verified resume
  • <span class="purple">clear</span>      - Clear HUD terminal screen
`,
    about: () => `
<span class="highlight">[IDENTITY DOSSIER: DAISY BOLLEPOGU]</span>
B.Tech Computer Science & Engineering student at Dhanekula Institute of Engineering & Technology.
Passionate Full Stack Developer and Quantum Computing explorer.
Eager to contribute analytical rigor and innovative problem-solving to forward-thinking engineering teams.
`,
    skills: () => `
<span class="highlight">[SKILL MATRIX ANALYSIS]</span>
• Languages: C, Java, Python (Core & Scripting)
• Web Stack: HTML5, CSS3, JavaScript, Full Stack Development
• Tools: VS Code, Git, GitHub, MS Office Suite
• Advanced: Quantum Computing (NPTEL Certified), Algorithmic Data Structures
• Soft Skills: Teamwork, Problem Solving, Rapid Skill Acquisition, Communication
`,
    projects: () => `
<span class="highlight">[FEATURED PROJECTS]</span>
1. Quantum Algorithm Simulator (Bloch Sphere 3D Visualizer)
2. Smart India Hackathon Civic Operating Hub
3. CyberSphere 3D Developer Portfolio
4. Algorithmic Problem Solver & Code Suite (C, Java, Python)
`,
    quantum: () => `
<span class="highlight">[NPTEL QUANTUM COMPUTING CERTIFICATION]</span>
STATUS: VERIFIED // GRADE: CERTIFIED
Curriculum: Qubit State Vectors, Superposition (|ψ⟩ = α|0⟩ + β|1⟩), Hadamard & Pauli Gates, Entanglement, Quantum Algorithms.
`,
    sih: () => `
<span class="highlight">[SMART INDIA HACKATHON PARTICIPANT]</span>
STATUS: COMPETITOR & INNOVATION TEAM MEMBER
Contributed to idea brainstorming, rapid UI prototyping, and collaborative algorithmic problem solving.
`,
    education: () => `
<span class="highlight">[ACADEMIC CREDENTIALS]</span>
• B.Tech CSE (2024–2028) - Dhanekula Institute of Engineering & Technology, Ganguru
• Intermediate MPC (2022–2024) - Sri Bhavishya Junior College
• SSC (2021–2022) - ASNRA ZPHS, Kanuru
`,
    contact: () => `
<span class="highlight">[COMMUNICATION PROTOCOLS]</span>
• Email:    <a href="mailto:daisybollepogu15@gmail.com" style="color:var(--neon-cyan);">daisybollepogu15@gmail.com</a>
• Phone:    <a href="tel:+918688808104" style="color:var(--neon-purple);">+91 8688808104</a>
• Location: Vijayawada, Andhra Pradesh, India
`,
    download: () => {
      window.open('assets/Daisy_Resume_FSD.docx', '_blank');
      return '<span class="success">>> INITIATING RESUME DOWNLOAD PROTOCOL...</span>';
    },
    clear: () => {
      if (terminalBody) {
        terminalBody.innerHTML = '';
      }
      return '';
    }
  };

  if (terminalInput && terminalBody) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim().toLowerCase();
        playSciFiSound('terminal');

        // Append user line
        const userLine = document.createElement('div');
        userLine.className = 'term-line';
        userLine.innerHTML = `<span class="term-prompt">daisy@space-terminal:~$</span> ${rawCmd}`;
        terminalBody.appendChild(userLine);

        if (rawCmd) {
          if (termCommands[rawCmd]) {
            const output = termCommands[rawCmd]();
            if (output) {
              const respLine = document.createElement('div');
              respLine.className = 'term-line';
              respLine.innerHTML = output;
              terminalBody.appendChild(respLine);
            }
          } else {
            const errLine = document.createElement('div');
            errLine.className = 'term-line';
            errLine.style.color = '#ef4444';
            errLine.innerHTML = `Command not recognized: "${rawCmd}". Type <span class="highlight">help</span> for available commands.`;
            terminalBody.appendChild(errLine);
          }
        }

        terminalInput.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  }

  /* ========================================================================
     7. CONTACT FORM & 1-CLICK CLIPBOARD UTILITIES
     ======================================================================== */
  const contactForm = document.getElementById('cyber-contact-form');
  const toast = document.getElementById('cyber-toast');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    playSciFiSound('success');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('TRANSMISSION RECEIVED // THANK YOU FOR REACHING OUT!');
      contactForm.reset();
    });
  }

  // 1-Click Copy Utility
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-target');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`COPIED TO CLIPBOARD: ${textToCopy}`);
      }).catch(() => {
        showToast('COPIED!');
      });
    });
  });

  /* ========================================================================
     8. TELEMETRY CLOCK (VIJAYAWADA / IST LOCAL TIME)
     ======================================================================== */
  const clockElement = document.getElementById('telemetry-clock');

  function updateTelemetryClock() {
    if (!clockElement) return;
    const now = new Date();
    // Format in IST (Vijayawada)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockElement.textContent = `${timeStr} IST`;
  }

  setInterval(updateTelemetryClock, 1000);
  updateTelemetryClock();

  /* ========================================================================
     9. MOBILE NAVIGATION DRAWER
     ======================================================================== */
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('mobile-open');
      playSciFiSound('click');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('mobile-open');
      });
    });
  }

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.cyber-nav');
    if (nav) {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // Initialize Lucide icons on load
  if (window.lucide) {
    window.lucide.createIcons();
  }

})();

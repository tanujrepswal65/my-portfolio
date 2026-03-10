
    // Project data with ALL LIVE LINKS CONNECTED
    const projects = [
      {
        title: "Weather Dashboard",
        description: "Real-time weather application with location detection, 5-day forecast, and beautiful visualizations.",
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&h=400&fit=crop",
        tags: ["React", "API", "CSS3"],
        github: "#",
        live: "weather-app.html"
      },
      {
        title: "Task Management App",
        description: "Full-stack task manager with drag-and-drop, categories, and progress tracking. Features user authentication.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
        tags: ["Node.js", "MongoDB", "Express"],
        github: "#",
        live: "task-managment.html" // LINKED
      },
      {
        title: "E-Commerce Frontend",
        description: "Modern e-commerce interface with product filtering, cart functionality, and responsive design.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        tags: ["React", "Stripe", "Tailwind"],
        github: "#",
        live: "ecommerce-app.html" // LINKED
      },
      {
        title: "Portfolio Generator",
        description: "CLI tool that generates beautiful portfolio websites from a JSON config.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        tags: ["Node.js", "CLI", "EJS"],
        github: "#",
        live: "#"
      }
    ];

    // Render projects
    function renderProjects() {
      const grid = document.getElementById('projectsGrid');
      grid.innerHTML = projects.map((project, index) => `
        <div class="project-card reveal" style="transition-delay: ${0.1 + index * 0.1}s;">
          <div class="overflow-hidden">
            <img src="${project.image}" alt="${project.title}" class="project-image w-full h-48 object-cover">
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">${project.title}</h3>
            <p class="mb-4" style="color: var(--muted);">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
            </div>
            <div class="flex gap-4">
              <a href="${project.github}" class="flex items-center gap-2 text-sm hover:text-[var(--accent)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Code
              </a>
              <a href="${project.live}" class="flex items-center gap-2 text-sm hover:text-[var(--accent)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
                Live Demo
              </a>
            </div>
          </div>
        </div>
      `).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderProjects();
      initScrollObserver();
      initNavigation();
      initMobileMenu();
      initContactForm();
      initSkillBars();
      
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    });

    function initScrollObserver() {
      const revealElements = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
              const progress = bar.style.getPropertyValue('--progress');
              if (progress) {
                bar.style.transform = `scaleX(${progress})`;
                bar.classList.add('animate');
              }
            });
          }
        });
      }, { threshold: 0.1 });
      revealElements.forEach(el => observer.observe(el));
    }

    function initNavigation() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');
      const navDots = document.querySelectorAll('.nav-dot');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === id));
            navDots.forEach(dot => dot.classList.toggle('active', dot.dataset.section === id));
          }
        });
      }, { threshold: 0.3 });
      sections.forEach(section => observer.observe(section));
    }

    function initMobileMenu() {
      const menuBtn = document.getElementById('menuBtn');
      const closeMenuBtn = document.getElementById('closeMenu');
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileLinks = document.querySelectorAll('.mobile-link');

      if (!menuBtn || !closeMenuBtn || !mobileMenu) return;

      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      });

      closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    function initContactForm() {
      const form = document.getElementById('contactForm');
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = 'Message Sent!';
          btn.style.background = '#28ca41';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
          }, 2000);
        }, 1500);
      });
    }

    function initSkillBars() {
      const skillItems = document.querySelectorAll('.skill-item');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target.querySelector('.skill-progress');
            if (bar) {
              const progress = bar.style.getPropertyValue('--progress');
              if (progress) {
                setTimeout(() => {
                  bar.style.transform = `scaleX(${progress})`;
                }, 100);
              }
            }
          }
        });
      }, { threshold: 0.5 });
      skillItems.forEach(item => observer.observe(item));
    }
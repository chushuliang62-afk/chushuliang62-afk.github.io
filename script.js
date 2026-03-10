/* ===== Interactive Particle Canvas ===== */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '91,141,239' : '232,123,232';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const alpha = (1 - dist / 120) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(140,160,255,${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* ===== Cursor Glow ===== */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

/* ===== Typing Effect ===== */
const typingEl = document.getElementById('typingText');
const phrases = [
    'console.log("Hello World!");',
    '热爱底层技术与创造性开发',
    'C++ / Python / OpenGL / AI',
    '从渲染管线到数据分析',
    '纽卡斯尔大学 · 专业前5%'
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
    const current = phrases[phraseIdx];
    if (!deleting) {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            setTimeout(() => { deleting = true; typeEffect(); }, 2000);
            return;
        }
        setTimeout(typeEffect, 60 + Math.random() * 40);
    } else {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(typeEffect, 400);
            return;
        }
        setTimeout(typeEffect, 30);
    }
}
setTimeout(typeEffect, 800);

/* ===== Navbar ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav on scroll
const sections = document.querySelectorAll('.section, .hero');
const navAnchors = document.querySelectorAll('.nav-links a');
function updateNav() {
    let cur = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) cur = s.id;
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
}
window.addEventListener('scroll', updateNav);

/* ===== Project Image Switcher ===== */
window.switchProj = function(id, thumb) {
    const img = document.getElementById('projImg' + id);
    if (img) {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = thumb.src;
            img.style.opacity = 1;
        }, 250);
    }
    thumb.parentElement.querySelectorAll('.proj-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
};

/* ===== Experience Tabs ===== */
const tabs = document.querySelectorAll('.exp-tab');
const tabContents = document.querySelectorAll('.exp-tab-content');
const tabIndicator = document.querySelector('.tab-indicator');

function updateIndicator(tab) {
    tabIndicator.style.left = tab.offsetLeft + 'px';
    tabIndicator.style.width = tab.offsetWidth + 'px';
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateIndicator(tab);
        const target = tab.dataset.tab;
        tabContents.forEach(c => c.classList.remove('active'));
        document.getElementById('tab-' + target).classList.add('active');
    });
});

// Init indicator
if (tabs.length) updateIndicator(tabs[0]);

/* ===== Skill Card Glow Follow ===== */
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
    });
});

/* ===== Scroll Reveal ===== */
function initReveal() {
    document.querySelectorAll('.skill-card, .proj-detail, .proj-visual, .exp-item, .c-card, .about-text, .about-terminal').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 4) * 0.1 + 's';
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate skill bars
                entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                    bar.classList.add('visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== Smooth img transition ===== */
document.querySelectorAll('.proj-img').forEach(img => {
    img.style.transition = 'opacity .35s ease, transform .6s cubic-bezier(.4,0,.2,1)';
});

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    updateNav();
});

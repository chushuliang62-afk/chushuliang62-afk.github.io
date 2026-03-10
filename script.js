/* ===== Organic Blob Canvas (light bg) ===== */
const canvas = document.getElementById('blobCanvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Blob {
    constructor(x, y, r, color, speed) {
        this.x = x; this.y = y; this.r = r;
        this.color = color;
        this.vx = (Math.random() - .5) * speed;
        this.vy = (Math.random() - .5) * speed;
        this.phase = Math.random() * Math.PI * 2;
    }
    update() {
        this.phase += 0.008;
        this.x += this.vx + Math.sin(this.phase) * 0.3;
        this.y += this.vy + Math.cos(this.phase * 0.7) * 0.3;
        if (this.x < -this.r) this.x = W + this.r;
        if (this.x > W + this.r) this.x = -this.r;
        if (this.y < -this.r) this.y = H + this.r;
        if (this.y > H + this.r) this.y = -this.r;
    }
    draw() {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        g.addColorStop(0, this.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

const blobs = [
    new Blob(W * 0.2, H * 0.3, 350, 'rgba(255,107,107,0.07)', 0.5),
    new Blob(W * 0.7, H * 0.2, 300, 'rgba(168,85,247,0.06)', 0.4),
    new Blob(W * 0.5, H * 0.7, 280, 'rgba(6,214,160,0.05)', 0.3),
    new Blob(W * 0.8, H * 0.6, 260, 'rgba(244,114,182,0.05)', 0.45),
    new Blob(W * 0.3, H * 0.8, 240, 'rgba(255,159,67,0.04)', 0.35),
];

function animateBlobs() {
    ctx.clearRect(0, 0, W, H);
    blobs.forEach(b => { b.update(); b.draw(); });
    requestAnimationFrame(animateBlobs);
}
animateBlobs();

/* ===== Cursor blob follow ===== */
const blobCur = document.getElementById('blobCursor');
let cx = -500, cy = -500;
document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
});
function followCursor() {
    blobCur.style.left = cx + 'px';
    blobCur.style.top = cy + 'px';
    requestAnimationFrame(followCursor);
}
followCursor();

/* ===== Hero chip text rotation ===== */
const chipTexts = [
    'console.log("Hello!");',
    'C++ / Python / OpenGL / AI',
    '纽卡斯尔大学 · 前5%',
    '热爱底层技术与创造',
    '从渲染管线到数据分析',
];
const chipEl = document.getElementById('chipText');
let cIdx = 0;
function rotateChip() {
    chipEl.style.opacity = 0;
    chipEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
        cIdx = (cIdx + 1) % chipTexts.length;
        chipEl.textContent = chipTexts[cIdx];
        chipEl.style.opacity = 1;
        chipEl.style.transform = 'translateY(0)';
    }, 300);
}
chipEl.style.transition = 'opacity .3s, transform .3s';
setInterval(rotateChip, 3000);
setTimeout(() => { chipEl.textContent = chipTexts[0]; chipEl.style.opacity = 1; }, 500);

/* ===== Name char bounce on hover ===== */
document.querySelectorAll('.name-char').forEach(ch => {
    ch.addEventListener('mouseenter', () => {
        ch.style.transform = 'translateY(-12px) rotate(-5deg) scale(1.15)';
        setTimeout(() => {
            ch.style.transform = '';
        }, 400);
    });
});

/* ===== Nav ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active nav
const secs = document.querySelectorAll('.sec, .hero');
const navAs = document.querySelectorAll('.nav-links a');
function updateNav() {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}
window.addEventListener('scroll', updateNav);

/* ===== Image switcher ===== */
window.swImg = function(id, thumb) {
    const img = document.getElementById('pImg' + id);
    if (!img) return;
    img.style.opacity = 0;
    setTimeout(() => { img.src = thumb.src; img.style.opacity = 1; }, 250);
    thumb.parentElement.querySelectorAll('.pt').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
};

/* ===== Tabs ===== */
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById('t-' + tab.dataset.t).classList.add('active');
    });
});

/* ===== Counting numbers ===== */
function animateNums() {
    document.querySelectorAll('.num-item').forEach(item => {
        const target = +item.dataset.target;
        const valEl = item.querySelector('.num-val');
        let current = 0;
        const step = target / 40;
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            valEl.textContent = Math.round(current) + '+';
        }, 30);
    });
}

/* ===== Skill card tilt ===== */
document.querySelectorAll('.s-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ===== Scroll Reveal ===== */
function initReveal() {
    const els = document.querySelectorAll('.s-card, .proj, .tl-item, .c-item, .about-left, .about-right, .contact-hero');
    els.forEach((el, i) => {
        el.classList.add('rv');
        el.style.transitionDelay = (i % 4) * 0.08 + 's';
    });

    let numsCounted = false;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                if (!numsCounted && entry.target.classList.contains('about-left')) {
                    numsCounted = true;
                    animateNums();
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
}

/* ===== Parallax on scroll for hero blobs ===== */
window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight) {
        canvas.style.transform = `translateY(${sy * 0.3}px)`;
    }
});

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    updateNav();
});

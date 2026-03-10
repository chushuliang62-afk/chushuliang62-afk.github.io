document.addEventListener('DOMContentLoaded', () => {

/* ===== Nav ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active link
const secs = document.querySelectorAll('[id]');
const navAs = document.querySelectorAll('.nav-links a');
function activeNav() {
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}
window.addEventListener('scroll', activeNav);

/* ===== Profile Modal ===== */
const logoBtn = document.getElementById('logoBtn');
const profileOverlay = document.getElementById('profileOverlay');
const profileClose = document.getElementById('profileClose');

logoBtn.addEventListener('click', () => profileOverlay.classList.add('active'));
profileClose.addEventListener('click', () => profileOverlay.classList.remove('active'));
profileOverlay.addEventListener('click', (e) => {
    if (e.target === profileOverlay) profileOverlay.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') profileOverlay.classList.remove('active');
});

/* ===== Language Toggle ===== */
let lang = 'zh';
const langToggle = document.getElementById('langToggle');
const marqueeTrack = document.getElementById('marqueeTrack');

langToggle.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    langToggle.textContent = lang === 'zh' ? 'EN' : '中';
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update all translatable elements
    document.querySelectorAll('[data-lang-' + lang + ']').forEach(el => {
        // Skip marquee track (handled separately)
        if (el.id === 'marqueeTrack') return;
        // For elements with data-split, update attribute and re-split
        if (el.hasAttribute('data-split')) {
            el.textContent = el.getAttribute('data-lang-' + lang);
            initSplitEl(el);
            return;
        }
        el.textContent = el.getAttribute('data-lang-' + lang);
    });

    // Update marquee
    const marqueeText = marqueeTrack.getAttribute('data-lang-' + lang);
    marqueeTrack.innerHTML = '<span>' + marqueeText + '</span><span>' + marqueeText + '</span>';

    // Re-run scroll lighting
    lightWords();
});

/* ===== Split big-p into words & light on scroll ===== */
function initSplitEl(el) {
    const text = el.textContent.trim();
    el.innerHTML = '';
    const segments = text.match(/[\u4e00-\u9fff]|[a-zA-Z0-9/+\-·.,'()]+|[^\u4e00-\u9fff\sa-zA-Z0-9/+\-·.,'()]+|\s+/g) || [];
    segments.forEach(seg => {
        if (/^\s+$/.test(seg)) {
            el.appendChild(document.createTextNode(' '));
        } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = seg;
            el.appendChild(span);
        }
    });
}

document.querySelectorAll('[data-split]').forEach(el => initSplitEl(el));

function lightWords() {
    document.querySelectorAll('[data-split]').forEach(el => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = 1 - (rect.top / (vh * 0.65));
        const words = el.querySelectorAll('.word');
        words.forEach((w, i) => {
            const wordProgress = progress - (i / words.length) * 0.4;
            w.classList.toggle('lit', wordProgress > 0);
        });
    });
}
window.addEventListener('scroll', lightWords);
lightWords();

/* ===== Reveal on scroll ===== */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('show');
            e.target.querySelectorAll('.dot-bar i').forEach(bar => bar.classList.add('go'));
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== Stagger reveal for cards ===== */
document.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
});
document.querySelectorAll('.skill-col').forEach((col, i) => {
    col.style.transitionDelay = (i * 0.1) + 's';
});
document.querySelectorAll('.exp-block').forEach((bl, i) => {
    bl.style.transitionDelay = (i * 0.12) + 's';
});

/* ===== Card parallax + cursor glow on mouse ===== */
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-4px) perspective(1000px) rotateX(' + (-y * 3) + 'deg) rotateY(' + (x * 3) + 'deg)';
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ===== Smooth scroll progress bar ===== */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = 'scaleX(' + (scrollY / h) + ')';
});

}); // DOMContentLoaded

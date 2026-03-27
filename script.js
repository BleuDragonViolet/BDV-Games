/* ===========================
   SCROLL FADE
=========================== */
const faders = document.querySelectorAll(".fade");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

faders.forEach(el => observer.observe(el));

// Fade-child : décalage progressif
const childFaders = document.querySelectorAll(".fade-child");
const childObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const siblings = entry.target.parentElement.querySelectorAll(".fade-child");
            siblings.forEach((el, idx) => {
                setTimeout(() => el.classList.add("visible"), idx * 100);
            });
            childObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

childFaders.forEach(el => childObserver.observe(el));

/* ===========================
   NAV ACTIVE STATE
=========================== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove("active"));
            const id = entry.target.getAttribute("id");
            const active = document.querySelector(`nav a[href="#${id}"]`);
            if (active) active.classList.add("active");
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => navObserver.observe(s));

/* ===========================
   PARTICLES
=========================== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let W, H, particles = [];

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", () => { resize(); initParticles(); });

function rand(min, max) { return Math.random() * (max - min) + min; }

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x  = rand(0, W);
        this.y  = rand(0, H);
        this.r  = rand(0.5, 1.8);
        this.vx = rand(-0.12, 0.12);
        this.vy = rand(-0.2, -0.05);
        this.alpha = rand(0.2, 0.7);
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle   = "#c678dd";
        ctx.shadowColor = "#c678dd";
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    const count = Math.floor((W * H) / 18000);
    particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

let animId;
function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
}
loop();

// --- THEME TOGGLE SCRIPT ---
const themeToggle = document.getElementById('theme-toggle');
const lightIcon = document.getElementById('theme-icon-light');
const darkIcon = document.getElementById('theme-icon-dark');
const userTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    }
};

if (userTheme === 'dark' || (!userTheme && systemTheme)) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme(isDark ? 'dark' : 'light');
    setTimeout(() => {
        animationController.start();
    }, 100);
});

// --- MOBILE MENU SCRIPT ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOtherButton = document.getElementById('mobile-other-button');
const mobileOtherMenu = document.getElementById('mobile-other-menu');
const mobileOtherArrow = document.getElementById('mobile-other-arrow');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

mobileOtherButton.addEventListener('click', () => {
    mobileOtherMenu.classList.toggle('hidden');
    mobileOtherArrow.classList.toggle('rotate-180');
});

const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        // Also hide the "Other" submenu if it's open
        if (!mobileOtherMenu.classList.contains('hidden')) {
            mobileOtherMenu.classList.add('hidden');
            mobileOtherArrow.classList.remove('rotate-180');
        }
    });
});

// --- DYNAMIC WAVE BACKGROUND SCRIPT ---
const animationController = {

    // --- CONFIGURATION ---
    dotRadius: 1.5,
    dotSpacing: 30,
    waveSpeed: 1.0,
    waveWidth: 100,
    waveAmplitude: 15,

    time: 0,
    animationFrameId: null,
    canvases: [],

    // --- HELPER FUNCTIONS ---
    getCssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },

    // --- SETUP ---
    addCanvas(canvas, side) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        let dots = [];
        for (let y = this.dotSpacing / 2; y < rect.height; y += this.dotSpacing) {
            for (let x = this.dotSpacing / 2; x < rect.width; x += this.dotSpacing) {
                dots.push({ x, y, originalY: y });
            }
        }
        this.canvases.push({ canvas, ctx, side, dots, rect });
    },

    // --- ANIMATION LOOP ---
    animate() {
        this.time++;

        this.canvases.forEach(c => {
            c.ctx.clearRect(0, 0, c.canvas.width, c.canvas.height);
            const dotColor = this.getCssVar('--dot-base-color');
            c.ctx.fillStyle = dotColor;

            const travelDistance = c.rect.width + this.waveWidth;
            const waveX = (this.time * this.waveSpeed) % travelDistance - (this.waveWidth / 2);

            c.dots.forEach(dot => {
                let currentWaveX = (c.side === 'left') ? waveX : c.rect.width - waveX;
                const dist = Math.abs(dot.x - currentWaveX);

                let yOffset = 0;

                const factor = Math.exp(-Math.pow(dist / (this.waveWidth * 0.4), 2));
                yOffset = this.waveAmplitude * factor;

                c.ctx.beginPath();
                c.ctx.arc(dot.x, dot.originalY - yOffset, this.dotRadius, 0, Math.PI * 2);
                c.ctx.fill();
            });
        });

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    start() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.canvases = []; // Clear old canvas data
        this.addCanvas(document.getElementById('left-wave'), 'left');
        this.addCanvas(document.getElementById('right-wave'), 'right');
        this.animate();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    animationController.start();

    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    sections.forEach(section => {
        observer.observe(section);
    });
});

window.addEventListener('resize', () => {
        animationController.start();
});

// --- PROJECTS TOGGLE SCRIPT ---
const toggleBtn = document.getElementById('toggle-projects-btn');
const btnText = document.getElementById('toggle-btn-text');
const chevronDown = document.getElementById('chevron-down');
const chevronUp = document.getElementById('chevron-up');
const extraProjects = document.querySelectorAll('.extra-project');

toggleBtn.addEventListener('click', () => {
    const isExpanding = btnText.textContent === 'View More';

    if (isExpanding) {
        // EXPAND
        extraProjects.forEach(project => {
            project.classList.remove('hidden');
            // Use a timeout to allow the 'display' property to change before adding the 'visible' class
            setTimeout(() => {
                project.classList.remove('fade-in-section');
                project.classList.add('visible');
            }, 10);
        });
        btnText.textContent = 'View Less';
        chevronDown.classList.add('hidden');
        chevronUp.classList.remove('hidden');
    } else {
        // COLLAPSE
        extraProjects.forEach(project => {
            project.classList.remove('visible');
        });

        // Do not wait for the transition to finish before hiding the elements
        extraProjects.forEach(project => {
                project.classList.add('fade-in-section');
                project.classList.add('hidden');
        });

        btnText.textContent = 'View More';
        chevronDown.classList.remove('hidden');
        chevronUp.classList.add('hidden');
    }
});
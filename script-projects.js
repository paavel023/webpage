// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');

// Theme Management
let currentTheme = localStorage.getItem('theme');

// Check if this is the first visit (no theme stored)
if (!currentTheme) {
    // Set dark mode as default for first-time visitors
    currentTheme = 'dark';
    localStorage.setItem('theme', currentTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Apply theme immediately to all elements
    applyThemeToElements(theme);
}

function applyThemeToElements(theme) {
    // Update navbar background based on theme
    if (window.scrollY > 100) {
        if (theme === 'dark') {
            navbar.style.background = 'rgba(13, 17, 23, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    } else {
        if (theme === 'dark') {
            navbar.style.background = 'rgba(13, 17, 23, 0.8)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        }
    }
}

// Initialize theme
setTheme(currentTheme);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Mobile Navigation
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    applyThemeToElements(currentTheme);
}

// Add scroll event listener
window.addEventListener('scroll', handleNavbarScroll);

// Initialize navbar state
handleNavbarScroll();

// Initialize AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
}

console.log('Project page script loaded successfully!'); 
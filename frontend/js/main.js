document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    // Check Auth State
    updateNavigation();
});

function updateNavigation() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navDashboard = document.getElementById('nav-dashboard');

    if (token && navLogin && navRegister && navDashboard) {
        navLogin.style.display = 'none';
        navRegister.textContent = 'Logout';
        navRegister.classList.remove('btn-primary');
        navRegister.classList.add('btn-outline');
        navRegister.href = '#';
        navRegister.onclick = (e) => {
            e.preventDefault();
            logout();
        };
        
        navDashboard.style.display = 'block';
        if (role === 'ADMIN') {
            navDashboard.href = 'admin.html';
        } else {
            navDashboard.href = 'dashboard.html';
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

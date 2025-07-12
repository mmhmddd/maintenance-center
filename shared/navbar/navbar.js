document.addEventListener('DOMContentLoaded', () => {
    // Highlight active link
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.includes(href) || (href === '../../index.html' && currentPath.endsWith('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Add scroll effect to navbar
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Check token and toggle logout button
    const user = JSON.parse(localStorage.getItem('user'));
    const logoutButton = document.getElementById('logoutButton'); // Fixed ID
    if (logoutButton) {
        if (!user || !user.token) {
            logoutButton.style.display = 'none';
        } else {
            logoutButton.style.display = 'block';
        }
    }
});

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}
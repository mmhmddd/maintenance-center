document.addEventListener('DOMContentLoaded', () => {
    // Highlight active link
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
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

    // Handle dropdown submenu hover
    const dropdowns = document.querySelectorAll('.dropdown-submenu');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.style.display = 'block';
        });
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.style.display = 'none';
        });
    });
});
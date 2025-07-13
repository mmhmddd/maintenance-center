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
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        if (!user || !user.token) {
            logoutButton.style.display = 'none';
        } else {
            logoutButton.style.display = 'block';
        }
    }

    // Navbar toggle fix
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            const isExpanded = navbarCollapse.classList.contains('show');
            if (isExpanded) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            } else {
                navbarCollapse.classList.add('show');
                navbarToggler.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Animation on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated');
                const delay = entry.target.getAttribute('data-animation-delay');
                if (delay) {
                    entry.target.style.animationDelay = delay;
                }
                entry.target.classList.add(entry.target.classList.contains('section-title') ? 'animate__fadeInDown' : 'animate__fadeInUp');
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('.section-title, .service-card').forEach(el => {
        observer.observe(el);
    });
});

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}
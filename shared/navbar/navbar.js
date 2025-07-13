document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');
    const sliderContainer = document.getElementById('clientSlider');

    // Close navbar when clicking the toggle button again
    navbarToggler.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from bubbling to document
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });

    // Close navbar when clicking anywhere on the page, except slider
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = navbarCollapse.contains(event.target);
        const isClickOnToggler = navbarToggler.contains(event.target);
        const isClickInsideSlider = sliderContainer && sliderContainer.contains(event.target);

        if (!isClickInsideNavbar && !isClickOnToggler && !isClickInsideSlider && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});
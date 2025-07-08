document.addEventListener('DOMContentLoaded', () => {
    // Update copyright year dynamically
    const yearElement = document.querySelector('.footer p.mb-0');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `© ${currentYear} دليل الأمان للصيانة. جميع الحقوق محفوظة.`;
    }
});
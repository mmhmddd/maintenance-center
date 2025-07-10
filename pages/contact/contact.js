document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            showSuccess();
            form.reset();
        } else {
            showError();
        }
    });

    // Real-time validation
    form.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-control')) {
            e.target.classList.remove('error');
        }
    });
});

function validateForm() {
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        field.classList.remove('error');
        
        if (!value) {
            field.classList.add('error');
            isValid = false;
        }
    });

    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        document.getElementById('email').classList.add('error');
        isValid = false;
    }

    const phone = document.getElementById('phone').value;
    const phoneRegex = /^(?:\+966|0)5[0-9]{8}$/;
    if (phone && !phoneRegex.test(phone)) {
        document.getElementById('phone').classList.add('error');
        isValid = false;
    }

    return isValid;
}

function showSuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = 'تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.';
    
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    document.getElementById('contactForm').prepend(successDiv);
    
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showError() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
    
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    document.getElementById('contactForm').prepend(errorDiv);
    
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const spinner = submitBtn.querySelector('.spinner');
    const btnText = submitBtn.querySelector('.btn-text');
    
    // Track field impurity (touched state) and form validity
    const fieldStates = {
        name: { impure: false, valid: false },
        email: { impure: false, valid: false },
        phone: { impure: false, valid: false },
        subject: { impure: false, valid: false },
        message: { impure: false, valid: false }
    };

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
    
    // Enhanced form validation
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'يرجى إدخال اسمك الكامل';
            if (value.trim().length < 2) return 'الاسم قصير جداً';
            if (!/^[\u0600-\u06FF\s]+$/.test(value.trim())) return 'يرجى إدخال اسم صحيح بالعربية';
            return null;
        },
        email: (value) => {
            if (!value.trim()) return 'يرجى إدخال البريد الإلكتروني';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'يرجى إدخال بريد إلكتروني صحيح';
            return null;
        },
        phone: (value) => {
            if (!value.trim()) return 'يرجى إدخال رقم الهاتف';
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'يرجى إدخال رقم هاتف صحيح';
            return null;
        },
        subject: (value) => {
            if (!value) return 'يرجى اختيار موضوع الرسالة';
            return null;
        },
        message: (value) => {
            if (!value.trim()) return 'يرجى كتابة رسالتك';
            if (value.trim().length < 10) return 'الرسالة قصيرة جداً (10 أحرف على الأقل)';
            if (value.trim().length > 1000) return 'الرسالة طويلة جداً (1000 حرف كحد أقصى)';
            return null;
        }
    };
    
    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            // Mark field as impure on focus
            field.addEventListener('focus', () => {
                fieldStates[fieldName].impure = true;
                validateField(fieldName);
                checkFormValidity();
            });
            // Validate on input or change (for select) if impure
            field.addEventListener('input', () => {
                if (fieldStates[fieldName].impure) {
                    validateField(fieldName);
                    checkFormValidity();
                }
            });
            field.addEventListener('change', () => {
                if (fieldStates[fieldName].impure) {
                    validateField(fieldName);
                    checkFormValidity();
                }
            });
            // Validate on blur if impure
            field.addEventListener('blur', () => {
                if (fieldStates[fieldName].impure) {
                    validateField(fieldName);
                    checkFormValidity();
                }
            });
        }
    });
    
    function validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const error = validators[fieldName](field.value);
        const validFeedback = field.nextElementSibling;
        const invalidFeedback = validFeedback && validFeedback.classList.contains('valid-feedback')
            ? validFeedback.nextElementSibling
            : field.nextElementSibling;
        
        // Only update feedback if field is impure
        if (fieldStates[fieldName].impure) {
            if (error) {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                fieldStates[fieldName].valid = false;
                
                // Show invalid feedback and hide valid feedback
                if (invalidFeedback && invalidFeedback.classList.contains('invalid-feedback')) {
                    invalidFeedback.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${error}`;
                    invalidFeedback.style.display = 'block';
                }
                if (validFeedback && validFeedback.classList.contains('valid-feedback')) {
                    validFeedback.style.display = 'none';
                }
                return false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                fieldStates[fieldName].valid = true;
                
                // Show valid feedback and hide invalid feedback
                if (validFeedback && validFeedback.classList.contains('valid-feedback')) {
                    validFeedback.style.display = 'block';
                }
                if (invalidFeedback && invalidFeedback.classList.contains('invalid-feedback')) {
                    invalidFeedback.style.display = 'none';
                }
                return true;
            }
        }
        return fieldStates[fieldName].valid;
    }
    
    function checkFormValidity() {
        const allValid = Object.keys(fieldStates).every(fieldName => fieldStates[fieldName].valid);
        const allImpure = Object.keys(fieldStates).every(fieldName => fieldStates[fieldName].impure);
        const existingAlert = form.querySelector('.alert');
        
        if (allValid && allImpure) {
            if (!existingAlert || !existingAlert.classList.contains('alert-success')) {
                showAlert('النموذج صحيح', 'success');
            }
        } else if (existingAlert && existingAlert.classList.contains('alert-success')) {
            existingAlert.remove();
        }
    }
    
    function validateForm() {
        let isValid = true;
        Object.keys(validators).forEach(fieldName => {
            // Validate all fields on submit
            fieldStates[fieldName].impure = true; // Mark all as impure on submit
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }
    
    // Form submission
    form.addEventListener('cen', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showAlert('يرجى تصحيح الأخطاء المذكورة أعلاه', 'danger');
            return;
        }
        
        // Show success alert for valid form
        showAlert('تم التحقق من النموذج بنجاح!', 'success');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        try {
            // Prepare WhatsApp message
            const formData = new FormData(form);
            const message = `
رسالة جديدة من النموذج:
الاسم: ${formData.get('name')}
البريد الإلكتروني: ${formData.get('email')}
رقم الهاتف: ${formData.get('phone')}
الموضوع: ${formData.get('subject')}
الرسالة: ${formData.get('message')}
            `.trim();
            
            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/+20113631968?text=${encodedMessage}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
            
            // Success
            form.reset();
            
            // Reset field states
            Object.keys(fieldStates).forEach(fieldName => {
                fieldStates[fieldName].impure = false;
                fieldStates[fieldName].valid = false;
                const field = document.getElementById(fieldName);
                field.classList.remove('is-valid', 'is-invalid');
                const validFeedback = field.nextElementSibling;
                const invalidFeedback = validFeedback && validFeedback.classList.contains('valid-feedback')
                    ? validFeedback.nextElementSibling
                    : field.nextElementSibling;
                if (validFeedback && validFeedback.classList.contains('valid-feedback')) {
                    validFeedback.style.display = 'none';
                }
                if (invalidFeedback && invalidFeedback.classList.contains('invalid-feedback')) {
                    invalidFeedback.style.display = 'none';
                }
            });
            
            // Track form submission (for analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'Contact',
                    event_label: 'Contact Form WhatsApp'
                });
            }
            
        } catch (error) {
            showAlert('حدث خطأ أثناء إعداد الرسالة. يرجى المحاولة مرة أخرى.', 'danger');
        } finally {
            // Hide loading state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
    
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        form.insertBefore(alertDiv, form.firstChild);
        
        // Scroll to alert
        alertDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('20') && value.length > 2) {
            value = '+' + value;
        } else if (value.startsWith('966')) {
            value = '+' + value;
        } else if (value.startsWith('05')) {
            value = '+966' + value.substring(1);
        } else if (value.startsWith('5') && value.length <= 9) {
            value = '+966' + value;
        }
        
        e.target.value = value;
    });
    
    // Character counter for message
    const messageInput = document.getElementById('message');
    const messageGroup = messageInput.closest('.form-group');
    const counter = document.createElement('small');
    counter.className = 'text-muted mt-1';
    counter.style.display = 'block';
    messageGroup.appendChild(counter);
    
    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        counter.textContent = `${length}/1000 حرف`;
        
        if (length > 1000) {
            counter.className = 'text-danger mt-1';
        } else if (length > 800) {
            counter.className = 'text-warning mt-1';
        } else {
            counter.className = 'text-muted mt-1';
        }
    });
    
    // Initialize counter
    messageInput.dispatchEvent(new Event('input'));
});

// Load Navbar and Footer
async function loadComponent(elementId, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`خطأ في تحميل ${path}:`, error);
    }
}

// Load components
loadComponent('navbar-placeholder', 'shared/navbar/navbar.html');
loadComponent('footer-placeholder', 'shared/footer/footer.html');

// Add current time display
function updateCurrentTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Cairo'
    };
    
    const timeString = now.toLocaleDateString('ar-SA', options);
    
    // Add to hero section if not exists
    const heroSection = document.querySelector('.hero-section .container');
    let timeDisplay = document.querySelector('.current-time');
    
    if (!timeDisplay) {
        timeDisplay = document.createElement('div');
        timeDisplay.className = 'current-time mt-3';
        timeDisplay.style.opacity = '0.8';
        timeDisplay.style.fontSize = '0.9rem';
        heroSection.appendChild(timeDisplay);
    }
    
    timeDisplay.innerHTML = `<i class="fas fa-clock me-2"></i>${timeString} (توقيت القاهرة)`;
}

// Update time every minute
updateCurrentTime();
setInterval(updateCurrentTime, 60000);
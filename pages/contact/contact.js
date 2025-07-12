        document.addEventListener('DOMContentLoaded', function() {
            // Load components with timeout and fallback
            async function loadComponent(elementId, htmlPath, jsPath, fallbackHtml) {
                const timeout = 5000; // 5 seconds timeout
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), timeout);

                    const response = await fetch(htmlPath + '?v=' + new Date().getTime(), { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (!response.ok) throw new Error(`Failed to load ${htmlPath}: ${response.status}`);
                    
                    const html = await response.text();
                    const element = document.getElementById(elementId);
                    element.innerHTML = html;

                    // Load associated JS if exists
                    if (jsPath) {
                        const script = document.createElement('script');
                        script.src = jsPath + '?v=' + new Date().getTime();
                        script.async = true;
                        script.onload = () => {
                            // Reinitialize Bootstrap components
                            bootstrap.Dropdown && document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
                                new bootstrap.Dropdown(dropdown);
                            });
                            bootstrap.Collapse && document.querySelectorAll('.navbar-collapse').forEach(collapse => {
                                new bootstrap.Collapse(collapse, { toggle: false });
                            });
                        };
                        script.onerror = () => console.error(`Failed to load ${jsPath}`);
                        document.body.appendChild(script);
                    }
                } catch (error) {
                    console.error(`Error loading ${htmlPath}:`, error);
                    document.getElementById(elementId).innerHTML = fallbackHtml;
                }
            }

            // Fallback HTML for navbar and footer
            const navbarFallback = `
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container">
                        <a class="navbar-brand" href="/">دليل الأمان</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav ms-auto">
                                <li class="nav-item"><a class="nav-link" href="/">الرئيسية</a></li>
                                <li class="nav-item"><a class="nav-link" href="/services">الخدمات</a></li>
                                <li class="nav-item"><a class="nav-link active" href="/contact">اتصل بنا</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            `;
            const footerFallback = `
                <footer class="bg-dark text-white text-center py-3">
                    <div class="container">
                        <p>جميع الحقوق محفوظة © ${new Date().getFullYear()} دليل الأمان للصيانة</p>
                    </div>
                </footer>
            `;

            // Load navbar and footer
            Promise.all([
                loadComponent('navbar-placeholder', '/shared/navbar/navbar.html', '/shared/navbar/navbar.js', navbarFallback),
                loadComponent('footer-placeholder', '/shared/footer/footer.html', '/shared/footer/footer.js', footerFallback)
            ]).then(() => {
                // Form handling
                const form = document.getElementById('contactForm');
                if (!form) return;

                const submitBtn = form.querySelector('.submit-btn');
                const spinner = submitBtn.querySelector('.spinner');
                const btnText = submitBtn.querySelector('.btn-text');

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

                document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
                    observer.observe(el);
                });

                // Form validation
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

                Object.keys(validators).forEach(fieldName => {
                    const field = document.getElementById(fieldName);
                    if (field) {
                        field.addEventListener('focus', () => {
                            fieldStates[fieldName].impure = true;
                            validateField(fieldName);
                            checkFormValidity();
                        });
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

                    if (fieldStates[fieldName].impure) {
                        if (error) {
                            field.classList.remove('is-valid');
                            field.classList.add('is-invalid');
                            fieldStates[fieldName].valid = false;
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
                        fieldStates[fieldName].impure = true;
                        if (!validateField(fieldName)) {
                            isValid = false;
                        }
                    });
                    return isValid;
                }

                form.addEventListener('submit', async function(e) {
                    e.preventDefault();

                    if (!validateForm()) {
                        showAlert('يرجى تصحيح الأخطاء المذكورة أعلاه', 'danger');
                        return;
                    }

                    showAlert('تم التحقق من النموذج بنجاح!', 'success');
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');

                    try {
                        const formData = new FormData(form);
                        const message = `
                            رسالة جديدة من النموذج:
                            الاسم: ${formData.get('name')}
                            البريد الإلكتروني: ${formData.get('email')}
                            رقم الهاتف: ${formData.get('phone')}
                            الموضوع: ${formData.get('subject')}
                            الرسالة: ${formData.get('message')}
                        `.trim();

                        const encodedMessage = encodeURIComponent(message);
                        const whatsappUrl = `https://wa.me/+966577659202?text=${encodedMessage}`;
                        window.open(whatsappUrl, '_blank');

                        form.reset();
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

                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'form_submit', {
                                event_category: 'Contact',
                                event_label: 'Contact Form WhatsApp'
                            });
                        }
                    } catch (error) {
                        showAlert('حدث خطأ أثناء إعداد الرسالة. يرجى المحاولة مرة أخرى.', 'danger');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('loading');
                    }
                });

                function showAlert(message, type) {
                    const existingAlert = form.querySelector('.alert');
                    if (existingAlert) existingAlert.remove();

                    const alertDiv = document.createElement('div');
                    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
                    alertDiv.innerHTML = `
                        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    form.insertBefore(alertDiv, form.firstChild);
                    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        if (alertDiv.parentNode) alertDiv.remove();
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
                    counter.className = length > 1000 ? 'text-danger mt-1' : length > 800 ? 'text-warning mt-1' : 'text-muted mt-1';
                });
                messageInput.dispatchEvent(new Event('input'));
            });

            // Current time display
            function updateCurrentTime() {
                const now = new Date();
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Riyadh'
                };
                const timeString = now.toLocaleDateString('ar-SA', options);
                const heroSection = document.querySelector('.hero-section .container');
                let timeDisplay = document.querySelector('.current-time');

                if (!timeDisplay) {
                    timeDisplay = document.createElement('div');
                    timeDisplay.className = 'current-time mt-3';
                    timeDisplay.style.opacity = '0.8';
                    timeDisplay.style.fontSize = '0.9rem';
                    heroSection.appendChild(timeDisplay);
                }
                timeDisplay.innerHTML = `<i class="fas fa-clock me-2"></i>${timeString} (توقيت المدينة المنورة)`;
            }

            updateCurrentTime();
            setInterval(updateCurrentTime, 60000);
        });
let currentStep = 1;
let selectedDevice = '';
let selectedIcon = '';

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    updateStepIndicator();
});

// ضبط الحد الأدنى لتاريخ الموعد على الغد
function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('appointmentDate').setAttribute('min', minDate);
}

// تحديث مؤشر الخطوات
function updateStepIndicator() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.querySelector('.step-circle').innerHTML = '<i class="fas fa-check"></i>';
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.querySelector('.step-circle').textContent = stepNum;
        } else {
            step.querySelector('.step-circle').textContent = stepNum;
        }
    });
}

// اختيار الجهاز وعرض النموذج
function selectDevice(deviceType, iconClass) {
    selectedDevice = deviceType;
    selectedIcon = iconClass;
    
    document.getElementById('selectedDeviceType').textContent = deviceType;
    document.getElementById('selectedDeviceIcon').className = iconClass;
    
    document.getElementById('deviceSelection').style.display = 'none';
    document.getElementById('bookingForm').classList.add('active');
    document.getElementById('bookingForm').classList.remove('hidden');
    document.getElementById('successMessage').classList.add('hidden');
    
    currentStep = 2;
    updateStepIndicator();
    
    // التمرير السلس للنموذج
    document.getElementById('bookingForm').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// العودة لاختيار الجهاز
function goBack() {
    document.getElementById('bookingForm').classList.remove('active');
    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('deviceSelection').style.display = 'block';
    
    currentStep = 1;
    updateStepIndicator();
    
    // التمرير السلس للأعلى
    document.querySelector('.hero-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// إعادة تعيين الكل
function resetAll() {
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('bookingForm').classList.remove('active');
    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('deviceSelection').style.display = 'block';
    document.getElementById('mainForm').reset();
    
    currentStep = 1;
    updateStepIndicator();
    
    // التمرير السلس للأعلى
    document.querySelector('.hero-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// التحقق من صحة النموذج
function validateForm() {
    const requiredFields = ['name', 'email', 'phone', 'city', 'address', 'appointmentDate', 'appointmentTime', 'brand', 'problem'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        // إزالة تنسيق الخطأ السابق
        field.classList.remove('error');
        
        if (!value) {
            field.classList.add('error');
            isValid = false;
        }
    });
    
    // التحقق من البريد الإلكتروني
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        document.getElementById('email').classList.add('error');
        isValid = false;
    }
    
    // التحقق من رقم الهاتف (أرقام مصرية)
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^01[0-2,5][0-9]{8}$/;
    if (phone && !phoneRegex.test(phone)) {
        document.getElementById('phone').classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// عرض حالة التحميل
function showLoading(button) {
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('i');
    
    btnText.textContent = 'جاري الإرسال...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    button.disabled = true;
}

// إخفاء حالة التحميل
function hideLoading(button) {
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('i');
    
    btnText.textContent = 'تأكيد الحجز';
    btnIcon.className = 'fas fa-check';
    button.disabled = false;
}

// عرض رسالة النجاح وملء بطاقة الملخص
function showSuccess() {
    document.getElementById('deviceSelection').style.display = 'none';
    document.getElementById('bookingForm').classList.remove('active');
    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('successMessage').classList.remove('hidden');
    document.getElementById('successMessage').classList.add('active');
    
    currentStep = 3;
    updateStepIndicator();
    
    // ملء بطاقة الملخص
    document.getElementById('summaryDevice').textContent = selectedDevice;
    document.getElementById('summaryName').textContent = document.getElementById('name').value;
    document.getElementById('summaryEmail').textContent = document.getElementById('email').value;
    document.getElementById('summaryPhone').textContent = document.getElementById('phone').value;
    document.getElementById('summaryCity').textContent = document.getElementById('city').value;
    document.getElementById('summaryAddress').textContent = document.getElementById('address').value;
    document.getElementById('summaryDate').textContent = document.getElementById('appointmentDate').value;
    document.getElementById('summaryTime').textContent = document.getElementById('appointmentTime').value;
    document.getElementById('summaryBrand').textContent = document.getElementById('brand').value;
    document.getElementById('summaryProblem').textContent = document.getElementById('problem').value;
    
    // التمرير السلس لرسالة النجاح
    document.getElementById('successMessage').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// تحميل التأكيد كملف نصي
function downloadConfirmation() {
    const formData = {
        deviceType: selectedDevice,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        brand: document.getElementById('brand').value,
        problem: document.getElementById('problem').value
    };
    const text = `تأكيد الحجز\n\n` +
                 `الجهاز: ${formData.deviceType}\n` +
                 `الاسم: ${formData.name}\n` +
                 `البريد الإلكتروني: ${formData.email}\n` +
                 `رقم الهاتف: ${formData.phone}\n` +
                 `المدينة: ${formData.city}\n` +
                 `العنوان: ${formData.address}\n` +
                 `التاريخ: ${formData.appointmentDate}\n` +
                 `الوقت: ${formData.appointmentTime}\n` +
                 `الماركة: ${formData.brand}\n` +
                 `المشكلة: ${formData.problem}\n\n` +
                 `شكراً لاختيارك خدمة الصيانة المتخصصة!`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'تأكيد_الحجز.txt';
    link.click();
    URL.revokeObjectURL(link.href);
}

// إرسال رسالة تأكيد لواتساب
function sendConfirmationMessage() {
    const formData = {
        deviceType: selectedDevice,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        brand: document.getElementById('brand').value,
        problem: document.getElementById('problem').value
    };
    const text = `تأكيد حجز جديد:\n\n` +
                 `الجهاز: ${formData.deviceType}\n` +
                 `الاسم: ${formData.name}\n` +
                 `البريد الإلكتروني: ${formData.email}\n` +
                 `رقم الهاتف: ${formData.phone}\n` +
                 `المدينة: ${formData.city}\n` +
                 `العنوان: ${formData.address}\n` +
                 `التاريخ: ${formData.appointmentDate}\n` +
                 `الوقت: ${formData.appointmentTime}\n` +
                 `الماركة: ${formData.brand}\n` +
                 `المشكلة: ${formData.problem}`;
    const phoneNumber = '+201103631968';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    
    // فتح واتساب مع الرسالة الجاهزة
    window.open(whatsappUrl, '_blank');
}

// التعامل مع إرسال النموذج
document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        // عرض رسالة خطأ
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
        
        // إزالة أي رسائل خطأ موجودة
        const existingError = document.querySelector('.alert-error');
        if (existingError) {
            existingError.remove();
        }
        
        // إدراج رسالة الخطأ أعلى النموذج
        const form = document.getElementById('mainForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        // التمرير لرسالة الخطأ
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // إزالة رسالة الخطأ بعد 5 ثوان
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
        
        return;
    }
    
    // عرض حالة التحميل
    const submitBtn = document.querySelector('.btn-success');
    showLoading(submitBtn);
    
    // محاكاة استدعاء API
    setTimeout(() => {
        hideLoading(submitBtn);
        showSuccess();
        
        // تسجيل بيانات النموذج (في التطبيق الفعلي، هيتم إرسالها للسيرفر)
        const formData = {
            deviceType: selectedDevice,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            appointmentDate: document.getElementById('appointmentDate').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            brand: document.getElementById('brand').value,
            problem: document.getElementById('problem').value
        };
        
        console.log('تم إرسال الحجز:', formData);
    }, 2000);
});

// إضافة تنسيق الخطأ للتحقق
const style = document.createElement('style');
style.textContent = `
    .form-control.error {
        border-color: var(--error) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .form-control.error:focus {
        border-color: var(--error) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
    }
`;
document.head.appendChild(style);

// التحقق في الوقت الفعلي
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('form-control')) {
        e.target.classList.remove('error');
    }
});

// التمرير السلس للروابط الداخلية
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
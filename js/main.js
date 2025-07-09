class ContinuousSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.track = document.getElementById('sliderTrack');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.directionBtn = document.getElementById('directionBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');

        this.isPlaying = true;
        this.direction = -1; // Right to left
        this.baseSpeed = 50;
        this.currentTranslate = 0;
        this.animId = null;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.startTranslate = 0;

        this.init();
    }

    init() {
        if (!this.container || !this.track || !this.playPauseBtn || !this.directionBtn || !this.speedSlider || !this.speedValue) {
            console.error('One or more slider elements not found');
            return;
        }
        this.duplicateFlags();
        this.setupEventListeners();
        this.updateSpeedDisplay();
        this.startAnimation();
    }

    duplicateFlags() {
        const originalFlags = this.track.innerHTML;
        this.track.innerHTML = originalFlags + originalFlags + originalFlags;
        const flagWidth = 180; // Width + gap
        const flagCount = 6; // Number of original images
        this.currentTranslate = -(flagWidth * flagCount);
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.directionBtn.addEventListener('click', () => this.toggleDirection());
        this.speedSlider.addEventListener('input', () => this.updateSpeed());

        this.container.addEventListener('mouseenter', () => this.pauseAnimation());
        this.container.addEventListener('mouseleave', () => this.resumeOnLeave());
        this.container.addEventListener('mousedown', (e) => this.handleStart(e));
        this.container.addEventListener('mousemove', (e) => this.handleMove(e));
        this.container.addEventListener('mouseup', () => this.handleEnd());
        this.container.addEventListener('mouseleave', () => this.handleEnd());

        this.container.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
        this.container.addEventListener('touchend', () => this.handleEnd());

        this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));
        this.track.addEventListener('dragstart', (e) => e.preventDefault());
    }

    handleStart(e) {
        this.isDragging = true;
        this.startX = this.getPositionX(e);
        this.startTranslate = this.currentTranslate;
        this.pauseAnimation();
        this.container.style.cursor = 'grabbing';
    }

    handleMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        this.currentX = this.getPositionX(e);
        const deltaX = this.currentX - this.startX;
        this.currentTranslate = this.startTranslate + deltaX;
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    handleEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        this.checkBounds();
        if (this.isPlaying) this.startAnimation();
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    handleKeyboard(e) {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.direction = -1;
                this.updateDirectionButton();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.direction = 1;
                this.updateDirectionButton();
                break;
        }
    }

    startAnimation() {
        if (!this.isPlaying || this.isDragging) return;
        const anim = () => {
            this.currentTranslate += this.direction * (parseInt(this.speedSlider.value) * 0.3);
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            this.checkBounds();
            if (this.isPlaying && !this.isDragging) this.animId = requestAnimationFrame(anim);
        };
        this.animId = requestAnimationFrame(anim);
    }

    checkBounds() {
        const flagWidth = 180; // Width + gap
        const flagCount = 6; // Number of original images
        const resetPoint = flagWidth * flagCount;
        if (this.currentTranslate <= -resetPoint * 2) {
            this.currentTranslate = -resetPoint;
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        } else if (this.currentTranslate >= 0) {
            this.currentTranslate = -resetPoint;
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }

    pauseAnimation() {
        if (this.animId) cancelAnimationFrame(this.animId);
    }

    resumeOnLeave() {
        if (this.isPlaying && !this.isDragging) this.startAnimation();
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        this.playPauseBtn.setAttribute('aria-label', this.isPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل التشغيل التلقائي');
        if (this.isPlaying) this.startAnimation();
    }

    toggleDirection() {
        this.direction *= -1;
        this.updateDirectionButton();
    }

    updateDirectionButton() {
        this.directionBtn.textContent = this.direction === -1 ? '⬅️' : '➡️';
        this.directionBtn.setAttribute('aria-label', this.direction === -1 ? 'التمرير من اليمين إلى اليسار' : 'التمرير من اليسار إلى اليمين');
    }

    updateSpeed() {
        const speed = parseInt(this.speedSlider.value);
        const speedLabels = ['بطيء جداً', 'بطيء', 'متوسط', 'سريع', 'سريع جداً'];
        this.speedValue.textContent = speedLabels[speed - 1];
        this.startAnimation();
    }

    updateSpeedDisplay() {
        const speed = parseInt(this.speedSlider.value);
        const speedLabels = ['بطيء جداً', 'بطيء', 'متوسط', 'سريع', 'سريع جداً'];
        this.speedValue.textContent = speedLabels[speed - 1];
    }
}
new ContinuousSlider('clientSlider');

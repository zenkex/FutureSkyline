(function () {
    // 全局变量
    let canvas, ctx;
    let rotationCenter;
    let stars = [];
    let shootingStars = [];
    let nextShootingStarTime;
    let hasEffectStarted = false;
    const scriptStartTime = Date.now();

    // ====================== 【全局可调参数】 ======================
    const EFFECT_START_DELAY = 5000;
    const STAR_ROTATION_SPEED_BASE = 0.0001;
    const STAR_ROTATION_SPEED_RANDOM = 0.00005;
    const STAR_FADE_SPEED_BASE = 0.002;
    const STAR_FADE_SPEED_RANDOM = 0.001;
    const SHOOTING_MIN_INTERVAL = 8000;
    const SHOOTING_MAX_INTERVAL = 18000;
    const SHOOTING_VX_BASE = -4;
    const SHOOTING_VX_RANDOM = 2;
    const SHOOTING_VY_BASE = 3;
    const SHOOTING_VY_RANDOM = 1.5;
    const SHOOTING_OPACITY_BASE = 0.3;
    const SHOOTING_OPACITY_RANDOM = 0.3;

    // 初始化 Canvas（动态创建）
    function initCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'starfield';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateRotationCenter();
        initStars();      // 重置所有星星（避免位置错乱）
    }

    function updateRotationCenter() {
        rotationCenter = {
            x: canvas.width * 1.3,
            y: canvas.height * -0.3,
        };
    }

    // 星星类
    class Star {
        constructor() {
            this.reset();
        }
        reset() {
            const distance = Math.random() * Math.max(canvas.width, canvas.height) * 2.5 + 500;
            this.angle = Math.random() * Math.PI * 2;
            this.distance = distance;
            this.x = rotationCenter.x + Math.cos(this.angle) * this.distance;
            this.y = rotationCenter.y + Math.sin(this.angle) * this.distance;
            this.rotationSpeed = STAR_ROTATION_SPEED_BASE + Math.random() * STAR_ROTATION_SPEED_RANDOM;
            this.size = 0.5 + Math.random() * 1.5;
            this.maxOpacity = 0.4 + Math.random() * 0.6;
            this.opacity = Math.random() * this.maxOpacity;
            this.fadeSpeed = STAR_FADE_SPEED_BASE + Math.random() * STAR_FADE_SPEED_RANDOM;
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.angle += this.rotationSpeed;
            this.x = rotationCenter.x + Math.cos(this.angle) * this.distance;
            this.y = rotationCenter.y + Math.sin(this.angle) * this.distance;
            this.opacity += this.fadeSpeed * this.fadeDirection;
            if (this.opacity >= this.maxOpacity) {
                this.opacity = this.maxOpacity;
                this.fadeDirection = -1;
            } else if (this.opacity <= 0) {
                this.opacity = 0;
                this.fadeDirection = 1;
            }
            if (this.x < -200 || this.x > canvas.width + 200 || this.y < -200 || this.y > canvas.height + 200) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(0.4, `rgba(255, 255, 255, ${this.opacity * 0.6})`);
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // 流星类
    class ShootingStar {
        constructor() {
            this.active = false;
            this.reset();
        }
        reset() {
            this.x = canvas.width + Math.random() * 200;
            this.y = -100 - Math.random() * 200;
            this.vx = SHOOTING_VX_BASE - Math.random() * SHOOTING_VX_RANDOM;
            this.vy = SHOOTING_VY_BASE + Math.random() * SHOOTING_VY_RANDOM;
            this.length = 40 + Math.random() * 60;
            this.opacity = SHOOTING_OPACITY_BASE + Math.random() * SHOOTING_OPACITY_RANDOM;
            if (this.opacity > 1) this.opacity = 1;
            this.size = 1.5 + Math.random() * 1;
            this.trail = [];
            this.trailLength = 8;
        }
        spawn() {
            this.active = true;
            this.reset();
        }
        update() {
            if (!this.active) return;
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.trailLength) this.trail.shift();
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -200 || this.y > canvas.height + 200) {
                this.active = false;
                this.trail = [];
            }
        }
        draw() {
            if (!this.active) return;
            for (let i = 0; i < this.trail.length; i++) {
                const point = this.trail[i];
                const trailOpacity = (i / this.trail.length) * this.opacity * 0.5;
                const trailSize = (i / this.trail.length) * this.size;
                ctx.beginPath();
                ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
                ctx.fill();
            }
            const angle = Math.atan2(this.vy, this.vx);
            const endX = this.x - Math.cos(angle) * this.length;
            const endY = this.y - Math.sin(angle) * this.length;
            const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(200, 220, 255, ${this.opacity * 0.6})`);
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size * 2;
            ctx.lineCap = "round";
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < 99; i++) {
            stars.push(new Star());
        }
    }

    function initShootingStars() {
        shootingStars = [];
        for (let i = 0; i < 3; i++) {
            shootingStars.push(new ShootingStar());
        }
    }

    function spawnShootingStar() {
        const inactive = shootingStars.find(s => !s.active);
        if (inactive) inactive.spawn();
        nextShootingStarTime = Date.now() + Math.random() * (SHOOTING_MAX_INTERVAL - SHOOTING_MIN_INTERVAL) + SHOOTING_MIN_INTERVAL;
    }

    function animate() {
        if (!canvas || !ctx) return;
        // 始终绘制黑色背景
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!hasEffectStarted) {
            if (Date.now() - scriptStartTime >= EFFECT_START_DELAY) {
                hasEffectStarted = true;
                nextShootingStarTime = Date.now() + Math.random() * (SHOOTING_MAX_INTERVAL - SHOOTING_MIN_INTERVAL) + SHOOTING_MIN_INTERVAL;
            } else {
                requestAnimationFrame(animate);
                return;
            }
        }

        stars.forEach(star => { star.update(); star.draw(); });
        shootingStars.forEach(ss => { ss.update(); ss.draw(); });

        if (Date.now() > nextShootingStarTime) spawnShootingStar();
        requestAnimationFrame(animate);
    }

    // 启动整个效果（等待 DOM 就绪）
    function start() {
        initCanvas();
        updateRotationCenter();
        initStars();
        initShootingStars();
        nextShootingStarTime = Date.now() + Math.random() * (SHOOTING_MAX_INTERVAL - SHOOTING_MIN_INTERVAL) + SHOOTING_MIN_INTERVAL;
        animate();
    }

    // 关键：自适应 DOM 加载状态
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
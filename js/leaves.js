/**
 * ==========================================================================
 * KESHAVEDA // VIBRANT FLOATING GREEN LEAVES & BOTANICAL PARTICLE SYSTEM
 * Realistic 2.5D tumbling green herbal leaves (Neem, Amla, Tulsi, Mint) & golden motes
 * with natural physics, 3D tumbling, wind currents, and interactive mouse breeze.
 * ==========================================================================
 */

class FloatingGreenLeavesEngine {
    constructor(canvasId = 'botanical-canvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.particles = [];
        this.maxParticles = 36;
        this.mouseX = -2000;
        this.mouseY = -2000;
        this.lastMouseX = 0;
        this.mouseSpeed = 0;

        this.wind = {
            target: 0.8,
            current: 0.8,
            gustTimer: 0
        };

        this.isRunning = true;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse interaction for wind breeze deflection
        window.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.lastMouseX;
            this.mouseSpeed = Math.abs(dx);
            this.lastMouseX = e.clientX;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        // Tab focus/blur optimization
        document.addEventListener('visibilitychange', () => {
            this.isRunning = !document.hidden;
            if (this.isRunning) {
                requestAnimationFrame(this.animate);
            }
        });

        // Generate initial batch spread across the viewport
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createLeaf(true));
        }

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.maxParticles = window.innerWidth < 768 ? 20 : 42;
    }

    createLeaf(randomY = false) {
        // Types: 'neem' (lanceolate serrated), 'amla' (oval), 'tulsi' (broad leaf), 'mote' (golden pollen)
        const types = ['neem', 'neem', 'amla', 'tulsi', 'tulsi', 'mote'];
        const type = types[Math.floor(Math.random() * types.length)];

        const depth = Math.random(); // 0 = far/smaller, 1 = foreground/larger
        const size = type === 'mote' 
            ? (2 + depth * 3.5)
            : (14 + depth * 22);

        return {
            type: type,
            x: Math.random() * (this.width + 200) - 100,
            y: randomY ? Math.random() * this.height : -60 - Math.random() * 80,
            z: depth,
            size: size,
            vx: (0.45 + Math.random() * 0.75) * (0.8 + depth * 0.5),
            vy: (0.75 + Math.random() * 1.1) * (0.8 + depth * 0.6),
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.025,
            pitch: Math.random() * Math.PI,
            pitchSpeed: 0.02 + Math.random() * 0.03,
            roll: Math.random() * Math.PI,
            rollSpeed: 0.015 + Math.random() * 0.025,
            opacity: 0.45 + depth * 0.5,
            greenShade: Math.random() // Used to vary between emerald, jade, and fresh herbal green
        };
    }

    drawNeemLeaf(ctx, p) {
        // Slender curved herbal Neem leaf with serrated margin and delicate vein
        const w = p.size * 0.42;
        const h = p.size * 1.6;

        ctx.beginPath();
        ctx.moveTo(0, -h * 0.5);
        ctx.bezierCurveTo(w * 1.3, -h * 0.2, w * 1.5, h * 0.2, 0, h * 0.5);
        ctx.bezierCurveTo(-w * 1.5, h * 0.2, -w * 1.3, -h * 0.2, 0, -h * 0.5);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
        if (p.greenShade > 0.5) {
            // Deep rich forest emerald
            grad.addColorStop(0, '#34A853');
            grad.addColorStop(0.5, '#1E7E34');
            grad.addColorStop(1, '#0F5132');
        } else {
            // Fresh vibrant Ayurvedic herbal green
            grad.addColorStop(0, '#5BB348');
            grad.addColorStop(0.5, '#287D32');
            grad.addColorStop(1, '#155724');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Central leaf vein
        ctx.strokeStyle = 'rgba(230, 250, 210, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.46);
        ctx.lineTo(0, h * 0.46);
        ctx.stroke();

        // Lateral secondary veins
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(230, 250, 210, 0.25)';
        for (let y = -h * 0.3; y <= h * 0.3; y += h * 0.15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w * 0.6, y - 4);
            ctx.moveTo(0, y);
            ctx.lineTo(-w * 0.6, y - 4);
            ctx.stroke();
        }
    }

    drawAmlaLeaf(ctx, p) {
        // Delicate oval Ayurvedic Amla leaflet
        const w = p.size * 0.6;
        const h = p.size * 1.15;

        ctx.beginPath();
        ctx.ellipse(0, 0, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, h * 0.5);
        grad.addColorStop(0, '#4CAF50');
        grad.addColorStop(0.7, '#2E7D32');
        grad.addColorStop(1, '#1B5E20');
        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle midrib
        ctx.strokeStyle = 'rgba(200, 240, 180, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.45);
        ctx.lineTo(0, h * 0.45);
        ctx.stroke();
    }

    drawTulsiLeaf(ctx, p) {
        // Sacred broad Tulsi leaf with soft pointed tip
        const w = p.size * 0.75;
        const h = p.size * 1.3;

        ctx.beginPath();
        ctx.moveTo(0, -h * 0.5);
        ctx.quadraticCurveTo(w * 0.9, -h * 0.1, 0, h * 0.5);
        ctx.quadraticCurveTo(-w * 0.9, -h * 0.1, 0, -h * 0.5);
        ctx.closePath();

        const grad = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
        grad.addColorStop(0, '#2E7D32');
        grad.addColorStop(0.5, '#43A047');
        grad.addColorStop(1, '#1B5E20');
        ctx.fillStyle = grad;
        ctx.fill();

        // Center spine
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.45);
        ctx.lineTo(0, h * 0.45);
        ctx.stroke();
    }

    drawGoldenMote(ctx, p) {
        // Golden sunlit botanical pollen sparkle
        const radius = p.size;
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        grad.addColorStop(0, 'rgba(255, 245, 200, 0.95)');
        grad.addColorStop(0.4, 'rgba(212, 175, 55, 0.7)');
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(this.animate);

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Sinusoidal wind gust
        this.wind.gustTimer += 0.015;
        this.wind.current = this.wind.target + Math.sin(this.wind.gustTimer) * 0.4;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // 3D physics tumbling
            p.rotation += p.rotSpeed;
            p.pitch += p.pitchSpeed;
            p.roll += p.rollSpeed;

            // Sway and descent
            const sway = Math.sin(p.pitch) * 1.3;
            p.x += (p.vx * this.wind.current) + sway;
            p.y += p.vy;

            // Interactive mouse breeze deflection
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 150;

            if (dist < repelRadius) {
                const force = (1 - dist / repelRadius) * 4.5;
                p.x += (dx / dist) * force;
                p.y += (dy / dist) * force;
                p.rotation += 0.06;
            }

            // Draw with 3D projection scaling
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.globalAlpha = p.opacity;

            if (p.type === 'mote') {
                this.drawGoldenMote(this.ctx, p);
            } else {
                this.ctx.rotate(p.rotation);
                // 3D roll and pitch creates the illusion of leaf tumbling in the air
                const scaleX = Math.cos(p.roll);
                const scaleY = Math.abs(Math.sin(p.pitch));
                this.ctx.scale(scaleX, Math.max(0.18, scaleY));

                if (p.type === 'neem') {
                    this.drawNeemLeaf(this.ctx, p);
                } else if (p.type === 'amla') {
                    this.drawAmlaLeaf(this.ctx, p);
                } else if (p.type === 'tulsi') {
                    this.drawTulsiLeaf(this.ctx, p);
                }
            }

            this.ctx.restore();

            // Reset when off screen
            if (p.y > this.height + 60 || p.x > this.width + 120 || p.x < -120) {
                this.particles[i] = this.createLeaf(false);
            }
        }
    }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('botanical-canvas')) {
        window.KeshavedaGreenLeaves = new FloatingGreenLeavesEngine('botanical-canvas');
    }
});

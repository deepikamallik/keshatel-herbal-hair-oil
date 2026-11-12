/**
 * ==========================================================================
 * KESHAVEDA // THREE.JS 3D LUXURY ROTATING HERBAL HAIR OIL BOTTLE
 * Interactive 3D Optical Glass Flacon with Golden Oil, Suspended Green
 * Botanical Leaves, Shimmering Gold Flakes, Embossed Label & Rotating Pedestal
 * ==========================================================================
 */

class LuxuryBottleExperience {
    constructor(containerId = 'bottle-3d-stage') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.bottleGroup = null;
        this.pedestalGroup = null;
        this.liquidMesh = null;
        this.glassMesh = null;
        this.floatingLeavesInside = [];
        this.floatingGoldFlakes = [];
        this.goldDustParticles = null;
        this.labelMesh = null;

        // Interaction state
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.targetRotation = { x: 0.05, y: 0 };
        this.currentRotation = { x: 0.05, y: 0 };
        this.isAutoRotating = true;
        this.autoRotateSpeed = 0.007; // Smooth continuous 360° rotation
        this.glowIntensity = 1.0;
        this.targetGlow = 1.0;
        this.glassHue = 'emerald'; // 'emerald' or 'amber'

        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        // 1. Scene setup
        this.scene = new THREE.Scene();

        // 2. Camera setup
        const width = this.container.clientWidth || 500;
        const height = this.container.clientHeight || 560;
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.camera.position.set(0, 0.25, 4.6);

        // 3. Renderer setup
        const canvas = document.getElementById('bottle-3d-canvas');
        if (!canvas) return;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.35;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 4. Studio Lighting Rig
        this.setupStudioLighting();

        // 5. Construct 3D Bottle Assembly
        this.bottleGroup = new THREE.Group();
        this.scene.add(this.bottleGroup);
        this.buildBottle();

        // 6. Rotating Botanical Mandala Pedestal under the bottle
        this.buildPedestal();

        // 7. Floating Botanical Aura & Golden Pollen Dust
        this.createBotanicalAura();

        // 8. Event Listeners
        this.setupEvents();

        // 9. Animation Loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupStudioLighting() {
        // Soft warm ambient base
        const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.3);
        this.scene.add(ambientLight);

        // Key Light (Warm Golden Studio Softbox)
        const keyLight = new THREE.DirectionalLight(0xffecd2, 2.8);
        keyLight.position.set(3.5, 4.5, 3.5);
        keyLight.castShadow = true;
        this.scene.add(keyLight);

        // Fill Light (Cool Emerald Forest Softbox)
        const fillLight = new THREE.DirectionalLight(0x78d4b0, 1.4);
        fillLight.position.set(-3.5, 2.5, 2.5);
        this.scene.add(fillLight);

        // Rim / Backlight for glistening glass contour
        const rimLight = new THREE.DirectionalLight(0xffe299, 3.6);
        rimLight.position.set(0, 4, -4.5);
        this.scene.add(rimLight);

        // Warm bottom uplight for liquid luminescence
        this.liquidPointLight = new THREE.PointLight(0xffaa22, 2.2, 7);
        this.liquidPointLight.position.set(0, -0.6, 0);
        this.scene.add(this.liquidPointLight);
    }

    // Generate Procedural High-Res Gold Embossed Label Texture
    createGoldFoilLabelTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Background: Deep Forest Green Matte Parchment
        const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
        bgGrad.addColorStop(0, '#071D14');
        bgGrad.addColorStop(0.5, '#0E2E20');
        bgGrad.addColorStop(1, '#06170F');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Subtle parchment micro-grain
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        for (let i = 0; i < 22000; i++) {
            ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
        }

        // Gold Foil Filigree Outer Border
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 6;
        ctx.strokeRect(40, 40, 944, 944);

        ctx.strokeStyle = '#F3E5AB';
        ctx.lineWidth = 2;
        ctx.strokeRect(52, 52, 920, 920);

        // Corner Mandalas / Ornaments
        this.drawCornerOrnament(ctx, 60, 60);
        this.drawCornerOrnament(ctx, 964, 60, Math.PI / 2);
        this.drawCornerOrnament(ctx, 964, 964, Math.PI);
        this.drawCornerOrnament(ctx, 60, 964, -Math.PI / 2);

        // Brand Crest / Sacred Geometry Symbol
        ctx.save();
        ctx.translate(512, 195);
        this.drawSacredLotusCrest(ctx);
        ctx.restore();

        // Typography: KESHATEL
        ctx.textAlign = 'center';
        ctx.fillStyle = '#F3E5AB';
        ctx.font = '600 58px "Cinzel", Georgia, serif';
        ctx.letterSpacing = '14px';
        ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
        ctx.shadowBlur = 10;
        ctx.fillText('KESHATEL', 512, 330);
        ctx.shadowBlur = 0;

        // Subtitle: AYURVEDIC HERBAL HAIR OIL
        ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#C5A059';
        ctx.letterSpacing = '8px';
        ctx.fillText('AYURVEDIC HERBAL HAIR OIL', 512, 375);

        // Gold Divider Bar
        const barGrad = ctx.createLinearGradient(250, 0, 774, 0);
        barGrad.addColorStop(0, 'transparent');
        barGrad.addColorStop(0.5, '#ECC880');
        barGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = barGrad;
        ctx.fillRect(250, 410, 524, 3);

        // Flagship Product Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 44px "Cormorant Garamond", Georgia, serif';
        ctx.fillText('HERBAL HAIR OIL', 512, 490);

        ctx.font = 'italic 28px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#E8CD8C';
        ctx.fillText('Naturally Beautiful Hair', 512, 535);

        // Botanical Formula Bulletins
        ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#B4C4BA';
        ctx.letterSpacing = '3px';
        ctx.fillText('BHRINGRAJ • AMLA • NEEM • HIBISCUS • ALOE', 512, 630);

        ctx.font = '400 17px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#7E9689';
        ctx.letterSpacing = '2px';
        ctx.fillText('14-DAY SLOW-COOKED TAILA PAKA VIDHI', 512, 675);

        // Seal / Bottom Badges
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(512, 785, 45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ECC880';
        ctx.fillText('100% ORGANIC', 512, 782);
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('VEDIC PURITY', 512, 798);

        // Volume
        ctx.font = '500 21px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#C5A059';
        ctx.letterSpacing = '4px';
        ctx.fillText('100 ML e 3.4 FL. OZ.', 512, 890);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 16;
        return texture;
    }

    drawCornerOrnament(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.strokeStyle = '#C5A059';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(30, 0);
        ctx.bezierCurveTo(45, 0, 45, 45, 0, 30);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    drawSacredLotusCrest(ctx) {
        ctx.strokeStyle = '#ECC880';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.lineWidth = 3;

        for (let i = 0; i < 8; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI) / 4);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(14, -28, 0, -48);
            ctx.quadraticCurveTo(-14, -28, 0, 0);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }

        ctx.fillStyle = '#ECC880';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    buildBottle() {
        // --- 1. Outer Heavy Glass Flacon ---
        const glassGeometry = new THREE.CylinderGeometry(0.92, 0.94, 2.4, 64, 1, false);

        this.glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0e3626, // Deep emerald forest glass
            roughness: 0.03,
            metalness: 0.05,
            transmission: 0.92,
            ior: 1.54, // Flint glass refraction
            reflectivity: 0.95,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04,
            thickness: 0.9,
            transparent: true,
            opacity: 0.92
        });

        this.glassMesh = new THREE.Mesh(glassGeometry, this.glassMaterial);
        this.glassMesh.position.y = -0.1;
        this.glassMesh.castShadow = true;
        this.glassMesh.receiveShadow = true;
        this.bottleGroup.add(this.glassMesh);

        // Heavy Base of Glass
        const baseGeom = new THREE.CylinderGeometry(0.94, 0.92, 0.25, 64);
        const baseMesh = new THREE.Mesh(baseGeom, this.glassMaterial);
        baseMesh.position.y = -1.35;
        this.bottleGroup.add(baseMesh);

        // Glass Shoulder Taper
        const shoulderGeom = new THREE.ConeGeometry(0.92, 0.45, 64, 1, true);
        const shoulderMesh = new THREE.Mesh(shoulderGeom, this.glassMaterial);
        shoulderMesh.position.y = 1.25;
        this.bottleGroup.add(shoulderMesh);

        // Glass Neck
        const neckGeom = new THREE.CylinderGeometry(0.38, 0.42, 0.55, 48);
        const neckMesh = new THREE.Mesh(neckGeom, this.glassMaterial);
        neckMesh.position.y = 1.6;
        this.bottleGroup.add(neckMesh);

        // --- 2. Inner Golden Herbal Oil Liquid ---
        const liquidGeom = new THREE.CylinderGeometry(0.85, 0.86, 2.05, 48);
        this.liquidMaterial = new THREE.MeshStandardMaterial({
            color: 0xdf9a1e, // Rich radiant golden amber
            emissive: 0x824e05,
            emissiveIntensity: 0.48,
            roughness: 0.15,
            metalness: 0.25,
            transparent: true,
            opacity: 0.88
        });

        this.liquidMesh = new THREE.Mesh(liquidGeom, this.liquidMaterial);
        this.liquidMesh.position.y = -0.22;
        this.bottleGroup.add(this.liquidMesh);

        // Meniscus on top of liquid
        const meniscusGeom = new THREE.CylinderGeometry(0.85, 0.85, 0.04, 48);
        const meniscusMesh = new THREE.Mesh(meniscusGeom, this.liquidMaterial);
        meniscusMesh.position.y = 0.82;
        this.bottleGroup.add(meniscusMesh);

        // --- 3. Suspended Green Herbal Leaves & Golden Flecks Inside the Oil ---
        this.createFloatingBotanicalsInside();

        // --- 4. Dropper Pipette (Glass Tube reaching down inside the oil) ---
        const pipetteGeom = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 24);
        const pipetteMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.1,
            transmission: 0.95,
            ior: 1.5,
            transparent: true,
            opacity: 0.65
        });
        const pipette = new THREE.Mesh(pipetteGeom, pipetteMat);
        pipette.position.y = 0.8;
        this.bottleGroup.add(pipette);

        // Oil Droplet at bottom of pipette
        const dropletGeom = new THREE.SphereGeometry(0.08, 16, 16);
        dropletGeom.scale(1, 1.4, 1);
        const dropletMesh = new THREE.Mesh(dropletGeom, this.liquidMaterial);
        dropletMesh.position.y = -0.35;
        this.bottleGroup.add(dropletMesh);

        // --- 5. Metallic Gold Collar & Dropper Cap Assembly ---
        const goldCapMat = new THREE.MeshStandardMaterial({
            color: 0xe5bf6d,
            roughness: 0.2,
            metalness: 0.94,
            envMapIntensity: 1.5
        });

        // Ribbed Gold Collar
        const collarGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.5, 48);
        const collarMesh = new THREE.Mesh(collarGeom, goldCapMat);
        collarMesh.position.y = 1.95;
        collarMesh.castShadow = true;
        this.bottleGroup.add(collarMesh);

        // Gold Trim Ring
        const ringGeom = new THREE.TorusGeometry(0.49, 0.03, 16, 48);
        ringGeom.rotateX(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeom, goldCapMat);
        ringMesh.position.y = 1.72;
        this.bottleGroup.add(ringMesh);

        // Black Rubber Squeeze Bulb
        const bulbMat = new THREE.MeshStandardMaterial({
            color: 0x111e17,
            roughness: 0.7,
            metalness: 0.1
        });
        const bulbGeom = new THREE.SphereGeometry(0.38, 32, 32);
        bulbGeom.scale(1, 1.45, 1);
        const bulbMesh = new THREE.Mesh(bulbGeom, bulbMat);
        bulbMesh.position.y = 2.45;
        this.bottleGroup.add(bulbMesh);

        // --- 6. Luxury Embossed Gold Foil Label ---
        const labelTexture = this.createGoldFoilLabelTexture();
        const labelGeom = new THREE.CylinderGeometry(
            0.945, 0.945, 1.6, 64, 1, true,
            -Math.PI * 0.45, Math.PI * 0.9
        );

        const labelMaterial = new THREE.MeshStandardMaterial({
            map: labelTexture,
            roughness: 0.35,
            metalness: 0.4,
            bumpMap: labelTexture,
            bumpScale: 0.015,
            side: THREE.DoubleSide
        });

        this.labelMesh = new THREE.Mesh(labelGeom, labelMaterial);
        this.labelMesh.position.y = -0.15;
        this.bottleGroup.add(this.labelMesh);

        // Initial orientation
        this.bottleGroup.rotation.x = 0.08;
        this.bottleGroup.rotation.y = -0.15;
    }

    createFloatingBotanicalsInside() {
        // 1. Suspended Green Herbal Leaves (Neem & Tulsi sprigs inside the oil)
        const leafGeom = new THREE.PlaneGeometry(0.12, 0.22);
        const greenLeafMat = new THREE.MeshStandardMaterial({
            color: 0x2e7d32, // Fresh Ayurvedic herbal green
            roughness: 0.4,
            metalness: 0.1,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });

        for (let i = 0; i < 12; i++) {
            const leaf = new THREE.Mesh(leafGeom, greenLeafMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.55;
            leaf.position.x = Math.cos(angle) * radius;
            leaf.position.z = Math.sin(angle) * radius;
            leaf.position.y = -0.9 + Math.random() * 1.6;
            leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

            leaf.userData = {
                wobbleOffset: Math.random() * Math.PI * 2,
                rotSpeedX: 0.008 + Math.random() * 0.015,
                rotSpeedY: 0.008 + Math.random() * 0.015
            };

            this.bottleGroup.add(leaf);
            this.floatingLeavesInside.push(leaf);
        }

        // 2. Shimmering Gold Ayurvedic Flecks
        const flakeCount = 24;
        const flakeGeom = new THREE.CircleGeometry(0.035, 6);
        const flakeMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.2,
            metalness: 0.95,
            side: THREE.DoubleSide,
            emissive: 0x997700,
            emissiveIntensity: 0.35
        });

        for (let i = 0; i < flakeCount; i++) {
            const flake = new THREE.Mesh(flakeGeom, flakeMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.65;
            flake.position.x = Math.cos(angle) * radius;
            flake.position.z = Math.sin(angle) * radius;
            flake.position.y = -1.0 + Math.random() * 1.7;
            flake.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

            flake.userData = {
                wobbleOffset: Math.random() * Math.PI * 2,
                rotSpeedX: 0.01 + Math.random() * 0.02,
                rotSpeedY: 0.01 + Math.random() * 0.02
            };

            this.bottleGroup.add(flake);
            this.floatingGoldFlakes.push(flake);
        }
    }

    buildPedestal() {
        // Rotating Botanical Mandala Pedestal under the bottle
        this.pedestalGroup = new THREE.Group();

        // Pedestal Disc
        const discGeom = new THREE.CylinderGeometry(1.6, 1.75, 0.12, 64);
        const discMat = new THREE.MeshStandardMaterial({
            color: 0x092017,
            metalness: 0.8,
            roughness: 0.3
        });
        const disc = new THREE.Mesh(discGeom, discMat);
        disc.position.y = -1.6;
        this.pedestalGroup.add(disc);

        // Gold Filigree Ring on Pedestal
        const ringGeom = new THREE.RingGeometry(1.2, 1.55, 64);
        ringGeom.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.y = -1.53;
        this.pedestalGroup.add(ring);

        this.scene.add(this.pedestalGroup);
    }

    createBotanicalAura() {
        // Golden Pollen & Herbal Dust Particles orbiting bottle
        const particleCount = 140;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = 1.3 + Math.random() * 1.6;
            const y = -1.8 + Math.random() * 4.2;

            positions[i * 3] = Math.cos(theta) * r;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = Math.sin(theta) * r;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const pCtx = pCanvas.getContext('2d');
        const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 235, 170, 1)');
        grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.6)');
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 64, 64);
        const pTexture = new THREE.CanvasTexture(pCanvas);

        const material = new THREE.PointsMaterial({
            size: 0.08,
            map: pTexture,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.goldDustParticles = new THREE.Points(geometry, material);
        this.scene.add(this.goldDustParticles);
    }

    setupEvents() {
        const canvas = this.renderer.domElement;

        // Mouse Drag to manually spin
        canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

            if (this.isDragging) {
                const deltaX = e.clientX - this.previousMousePosition.x;
                const deltaY = e.clientY - this.previousMousePosition.y;

                this.targetRotation.y += deltaX * 0.008;
                this.targetRotation.x += deltaY * 0.004;
                this.targetRotation.x = Math.max(-0.4, Math.min(0.4, this.targetRotation.x));

                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        // Touch support for mobile devices
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
                const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

                this.targetRotation.y += deltaX * 0.008;
                this.targetRotation.x += deltaY * 0.004;
                this.targetRotation.x = Math.max(-0.4, Math.min(0.4, this.targetRotation.x));

                this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        // Window resize
        window.addEventListener('resize', () => this.onResize());

        // Setup Bottle HUD UI Buttons
        this.bindHUDButtons();
    }

    bindHUDButtons() {
        const rotateBtn = document.getElementById('hud-rotate-toggle');
        const glowBtn = document.getElementById('hud-glow-toggle');
        const glassBtn = document.getElementById('hud-glass-toggle');

        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.isAutoRotating = !this.isAutoRotating;
                rotateBtn.textContent = this.isAutoRotating ? 'Pause 360°' : 'Resume 360°';
            });
        }

        if (glowBtn) {
            let glowActive = false;
            glowBtn.addEventListener('click', () => {
                glowActive = !glowActive;
                this.targetGlow = glowActive ? 2.5 : 1.0;
                glowBtn.style.background = glowActive ? '#C5A059' : 'transparent';
                glowBtn.style.color = glowActive ? '#091D15' : '#E8CD8C';
            });
        }

        if (glassBtn) {
            glassBtn.addEventListener('click', () => {
                if (this.glassHue === 'emerald') {
                    this.glassHue = 'amber';
                    this.glassMaterial.color.setHex(0x3a2410);
                    glassBtn.textContent = 'Emerald Glass';
                } else {
                    this.glassHue = 'emerald';
                    this.glassMaterial.color.setHex(0x0e3626);
                    glassBtn.textContent = 'Amber Glass';
                }
            });
        }
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate);

        // 1. Continuous 360° Auto-Rotation
        if (this.isAutoRotating && !this.isDragging) {
            this.targetRotation.y += this.autoRotateSpeed;
        }

        // Smooth damping
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

        if (this.bottleGroup) {
            this.bottleGroup.rotation.x = this.currentRotation.x;
            this.bottleGroup.rotation.y = this.currentRotation.y;
        }

        // Pedestal subtle counter-rotation for visual depth
        if (this.pedestalGroup) {
            this.pedestalGroup.rotation.y = -this.currentRotation.y * 0.35;
        }

        // 2. Parallax Camera Movement on Mouse Hover
        if (!this.isDragging) {
            this.camera.position.x += ((this.mouse.x * 0.25) - this.camera.position.x) * 0.05;
            this.camera.position.y += ((0.25 + this.mouse.y * 0.15) - this.camera.position.y) * 0.05;
            this.camera.lookAt(0, 0.1, 0);
        }

        // 3. Animate Suspended Green Leaves & Gold Flecks inside Oil
        const time = performance.now() * 0.001;
        this.floatingLeavesInside.forEach((leaf) => {
            leaf.position.y += Math.sin(time + leaf.userData.wobbleOffset) * 0.001;
            leaf.rotation.x += leaf.userData.rotSpeedX;
            leaf.rotation.y += leaf.userData.rotSpeedY;
        });

        this.floatingGoldFlakes.forEach((flake) => {
            flake.position.y += Math.sin(time + flake.userData.wobbleOffset) * 0.0012;
            flake.rotation.x += flake.userData.rotSpeedX;
            flake.rotation.y += flake.userData.rotSpeedY;
        });

        // 4. Animate Golden Aura Dust
        if (this.goldDustParticles) {
            this.goldDustParticles.rotation.y = time * 0.06;
        }

        // 5. Dynamic Glow Interpolation
        this.glowIntensity += (this.targetGlow - this.glowIntensity) * 0.05;
        if (this.liquidMaterial) {
            this.liquidMaterial.emissiveIntensity = 0.48 * this.glowIntensity;
        }
        if (this.liquidPointLight) {
            this.liquidPointLight.intensity = 2.2 * this.glowIntensity;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Auto-initialize when canvas is in DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bottle-3d-canvas')) {
        window.Keshaveda3DBottle = new LuxuryBottleExperience('bottle-3d-stage');
        window.Keshatel3DBottle = window.Keshaveda3DBottle;
    }
});

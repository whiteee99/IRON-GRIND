// ==========================================
// IRON GRIND - EPIC VFX ENGINE (PART 1)
// Canvas Particles, Physics, Camera Rig, Post FX
// ==========================================

const CinematicEngine = {
    canvas: null,
    ctx: null,
    snow: [],
    embers: [],
    ash: [],
    windForce: 2,
    isRunning: false,
    animationFrameId: null,
    cameraRig: null,

    init: function() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cameraRig = document.getElementById('camera-rig');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.generateBlizzard(400);
        this.generateAsh(50);
        // Always run the particle loop (low cost); cinematic timeline controls intensity
        this.isRunning = true;
        this.renderLoop();
    },


    resizeCanvas: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    // Epic Blizzard Particle System
    generateBlizzard: function(count) {
        for(let i=0; i<count; i++) {
            this.snow.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 0.5,
                speedY: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: '#ffffff',
                wobble: Math.random() * 2 - 1,
                depth: Math.random() * 0.5 + 0.5 // For parallax
            });
        }
    },

    // Background Ash/Debris
    generateAsh: function(count) {
        for(let i=0; i<count; i++) {
            this.ash.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 2,
                speedY: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.3 + 0.1,
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 0.05 - 0.025
            });
        }
    },

    // Frost Embers for energy bursts
    spawnEmbers: function(count, originX, originY, intensity = 1) {
        for(let i=0; i<count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 * intensity + 3;
            this.embers.push({
                x: originX, y: originY,
                speedX: Math.cos(angle) * speed + this.windForce,
                speedY: Math.sin(angle) * speed,
                size: Math.random() * 4 + 1,
                life: 100,
                decay: Math.random() * 0.02 + 0.005,
                color: Math.random() > 0.5 ? '#90e0ef' : '#caf0f8',
                trail: []
            });
        }
    },

    vfx: {
        triggerShake: function(intensity = 'soft') {
            const rig = CinematicEngine.cameraRig;
            if (!rig) return;
            rig.classList.add(intensity === 'hard' ? 'shake-hard' : 'shake-soft');
            setTimeout(() => rig.classList.remove('shake-hard', 'shake-soft'), 500);
        },
        triggerChromaticAberration: function(duration = 200) {
            const ca = document.getElementById('chromatic-aberration');
            if (!ca) return;
            ca.classList.add('ca-active');
            setTimeout(() => ca.classList.remove('ca-active'), duration);
        },
        triggerLightning: function() {
            const flash = document.getElementById('lightning-flash');
            if (!flash) return;
            flash.style.opacity = '0.8';
            setTimeout(() => { flash.style.opacity = '0'; }, 100);
            setTimeout(() => { flash.style.opacity = '0.4'; }, 200);
            setTimeout(() => { flash.style.opacity = '0'; }, 300);
        },
        triggerLightSweep: function() {
            const sweep = document.getElementById('light-sweep');
            if (!sweep) return;
            sweep.style.transition = 'none';
            sweep.style.left = '-100%';
            sweep.style.opacity = '1';
            setTimeout(() => {
                sweep.style.transition = 'left 1.2s linear, opacity 1.2s';
                sweep.style.left = '200%';
                sweep.style.opacity = '0';
            }, 50);
        },
        triggerDOF: function(active) {
            const dof = document.getElementById('depth-of-field');
            if (!dof) return;
            if(active) dof.classList.add('dof-active');
            else dof.classList.remove('dof-active');
        },
        triggerPowerSurge: function() {
            const logo = document.getElementById('logo-container');
            const frost = document.getElementById('frost-overlay');
            if (logo) logo.classList.add('power-surge');
            if (frost) frost.style.opacity = '1';
            this.triggerChromaticAberration(500);
            this.triggerShake('hard');
            this.triggerLightning();
            setTimeout(() => {
                if (logo) logo.classList.remove('power-surge');
                if (frost) frost.style.opacity = '0.3';
            }, 1200);
        },
        moveCamera: function(x, y, z) {
            const rig = CinematicEngine.cameraRig;
            if (!rig) return;
            rig.style.transform = `translate(${x}px, ${y}px) translateZ(${z}px)`;
        }
    },


    renderLoop: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render Background Ash
        this.ash.forEach(p => {
            p.y += p.speedY;
            p.x += this.windForce * 0.2;
            p.rotation += p.rotSpeed;
            if(p.y > this.canvas.height) p.y = 0;
            if(p.x > this.canvas.width) p.x = 0;
            
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = '#111';
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            this.ctx.restore();
        });
        this.ctx.globalAlpha = 1;

        // Render Blizzard
        this.snow.forEach(p => {
            p.x += this.windForce + (p.size * 0.5) + p.wobble; // Wind & wobble
            p.y += p.speedY;
            if(p.x > this.canvas.width) p.x = 0;
            if(p.x < 0) p.x = this.canvas.width;
            if(p.y > this.canvas.height) p.y = 0;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity * p.depth;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = '#caf0f8';
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1; 
        this.ctx.shadowBlur = 0;

        // Render Embers (Sparks)
        for(let i = this.embers.length - 1; i >= 0; i--) {
            let e = this.embers[i];
            
            // Save trail
            e.trail.push({x: e.x, y: e.y});
            if(e.trail.length > 5) e.trail.shift();
            
            e.x += e.speedX; 
            e.y += e.speedY; 
            e.speedY += 0.15; // Gravity
            e.life -= e.decay * 100;
            
            if(e.life <= 0) { 
                this.embers.splice(i, 1); 
                continue; 
            }
            
            // Draw trail
            for(let j = 0; j < e.trail.length; j++) {
                this.ctx.beginPath();
                this.ctx.arc(e.trail[j].x, e.trail[j].y, e.size * (j / e.trail.length), 0, Math.PI * 2);
                this.ctx.fillStyle = e.color;
                this.ctx.globalAlpha = (e.life / 100) * (j / e.trail.length);
                this.ctx.fill();
            }
            
            this.ctx.beginPath();
            this.ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            this.ctx.fillStyle = e.color;
            this.ctx.globalAlpha = e.life / 100;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#90e0ef';
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1; 
        this.ctx.shadowBlur = 0;

        if(this.isRunning) {
            this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
        }
    }
};

// ==========================================
// IRON GRIND - EPIC TIMELINE & CONTROLS (PT2)
// Timeline, Camera Movements, Gauges, Audio, UI
// ==========================================

const TimelineController = {
    timeouts: [],

    startTimeline: function() {
        CinematicEngine.isRunning = true;
        Audio.play('ambience');
        
        // Init Letterbox
        document.getElementById('letterbox-top').style.height = '10%';
        document.getElementById('letterbox-bottom').style.height = '10%';

        // PHASE 1: DIGITAL VOID / FROZEN WASTELAND (0-2s)
        this.addTimeout(() => {
            document.getElementById('mountain-back').style.opacity = '0.8';
            document.getElementById('mountain-mid').style.opacity = '0.9';
            document.getElementById('mountain-front').style.opacity = '1';
            document.getElementById('horizon-glow').style.opacity = '0.5';
            document.getElementById('sky-aurora').style.opacity = '0.4';
            document.getElementById('volumetric-light').style.opacity = '0.8';
            CinematicEngine.vfx.triggerLightning();
            CinematicEngine.vfx.moveCamera(0, 0, 50); // Subtle dolly in
        }, 500);

        // PHASE 2: THE VANGUARD STRIKES (2-4s)
        this.addTimeout(() => {
            Audio.play('boot');
            const vanguard = document.getElementById('vanguard-container');
            const spear = document.getElementById('iron-spear');
            const crater = document.getElementById('impact-crater');
            
            vanguard.style.opacity = '1';
            spear.style.height = '75%';
            
            this.addTimeout(() => {
                spear.style.transition = 'transform 0.2s';
                spear.style.transform = 'translateY(0)';
                crater.style.transform = 'scale(1)';
                
                // Animate crater rings
                const rings = document.querySelectorAll('.crater-ring');
                rings.forEach((ring, index) => {
                    setTimeout(() => {
                        ring.style.opacity = '1';
                        ring.style.transition = 'transform 1s, opacity 1s';
                        ring.style.transform = 'scale(1.5)';
                    }, index * 100);
                });

                CinematicEngine.vfx.triggerShake('hard');
                CinematicEngine.spawnEmbers(80, window.innerWidth/2, window.innerHeight * 0.8, 2);
                CinematicEngine.vfx.moveCamera(0, 0, 0); // Pull back on impact
            }, 500);
        }, 2000);

        // PHASE 3: RUNES OF WAR / GAUGES (4-6s)
        this.addTimeout(() => {
            const gauges = document.getElementById('gauges-container');
            gauges.style.opacity = '1';
            gauges.style.transform = 'translateY(0) scale(1)';
            
            GaugeController.activateStrength();
            this.addTimeout(() => GaugeController.activateGrind(), 600);
            this.addTimeout(() => GaugeController.activateProgress(), 1200);
            
            CinematicEngine.vfx.triggerLightning();
            CinematicEngine.vfx.moveCamera(20, 0, 20); // Slight pan
        }, 4000);

        // PHASE 4: FORGING THE EMBLEM (6-8s)
        this.addTimeout(() => {
            Audio.play('gauge');
            const wireframe = document.getElementById('ig-emblem-wireframe');
            const emblem = document.getElementById('ig-emblem');
            const frost = document.getElementById('emblem-frost');
            
            wireframe.style.opacity = '0.8';
            CinematicEngine.vfx.triggerDOF(true); // Focus blur
            
            this.addTimeout(() => {
                wireframe.style.opacity = '0';
                emblem.style.opacity = '1';
                emblem.style.transform = 'scale(1) rotate(0deg)';
                frost.style.opacity = '1';
                CinematicEngine.vfx.triggerLightSweep();
                CinematicEngine.spawnEmbers(120, window.innerWidth/2, window.innerHeight/2, 2.5);
                CinematicEngine.vfx.triggerShake('soft');
                CinematicEngine.vfx.triggerDOF(false); // Remove blur
            }, 1000);
        }, 6000);

        // PHASE 5: BLIZZARD SURGE (8-10s)
        this.addTimeout(() => {
            Audio.play('surge');
            CinematicEngine.vfx.triggerPowerSurge();
            CinematicEngine.windForce = 15; // Blizzard intensifies massively
            
            this.addTimeout(() => { CinematicEngine.windForce = 4; }, 1200); // Settles down
            
            // Force all gauges to max
            document.querySelectorAll('.gauge-needle').forEach(n => {
                n.style.transform = 'translate(-50%, -100%) rotate(90deg)';
            });
            document.querySelectorAll('.gauge-value').forEach(v => {
                v.innerHTML = '100';
                v.style.color = '#caf0f8';
            });
            CinematicEngine.vfx.moveCamera(0, 0, 0);
        }, 8000);

        // PHASE 6: HERO SHOT (10-12s)
        this.addTimeout(() => {
            document.getElementById('brand-text').style.opacity = '1';
            CinematicEngine.vfx.triggerLightning();
        }, 10000);

        // PHASE 7: FINAL BRANDING (12-15s)
        this.addTimeout(() => {
            Audio.play('impact');
            document.getElementById('tagline-text').style.opacity = '1';
            CinematicEngine.vfx.triggerLightSweep();
            CinematicEngine.vfx.triggerShake('soft');
            CinematicEngine.vfx.triggerChromaticAberration(200);
        }, 12000);

        this.addTimeout(() => this.transitionToDashboard(), 14500);
    },

    addTimeout: function(fn, delay) {
        const id = setTimeout(fn, delay);
        this.timeouts.push(id);
    },

    clearTimeouts: function() {
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts = [];
    },

    transitionToDashboard: function() {
        const container = document.getElementById('cinematic-container');
        container.style.transition = 'opacity 1s';
        container.style.opacity = '0';
        this.addTimeout(() => {
            console.log("Loading IRON GRIND Dashboard...");
            document.body.innerHTML = '<div style="background:#05070a;color:#90e0ef;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;font-size:24px;letter-spacing:2px;">DASHBOARD LOADED</div>';
        }, 1000);
    }
};

const GaugeController = {
    animateValue: function(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    activateStrength: function() {
        const g = document.getElementById('gauge-strength');
        g.classList.add('active');
        g.querySelector('.gauge-needle').style.transform = 'translate(-50%, -100%) rotate(45deg)';
        this.animateValue(g.querySelector('.gauge-value'), 0, 45, 1000);
        Audio.play('gauge');
    },
    activateGrind: function() {
        const g = document.getElementById('gauge-grind');
        g.classList.add('active');
        g.querySelector('.gauge-needle').style.transform = 'translate(-50%, -100%) rotate(60deg)';
        this.animateValue(g.querySelector('.gauge-value'), 0, 60, 1000);
        Audio.play('gauge');
    },
    activateProgress: function() {
        const g = document.getElementById('gauge-progress');
        g.classList.add('active');
        g.querySelector('.gauge-needle').style.transform = 'translate(-50%, -100%) rotate(90deg)';
        this.animateValue(g.querySelector('.gauge-value'), 0, 90, 1000);
        Audio.play('gauge');
    }
};

const Audio = {
    play: function(trackName) {
        const audio = document.getElementById('audio-' + trackName);
        if(audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio blocked:", e));
        }
    },
    stopAll: function() {
        document.querySelectorAll('audio').forEach(a => { a.pause(); a.currentTime = 0; });
    }
};

function bootApp() {
    CinematicEngine.init();

    const startBtn = document.getElementById('start-btn');
    const skipBtn = document.getElementById('skip-btn');
    const loadingText = document.getElementById('loading-text');
    const startContainer = document.getElementById('start-container');

    if (!startBtn || !skipBtn || !loadingText) {
        console.error('IRON GRIND: missing UI elements');
        return;
    }

    let started = false;
    let bootProgress = 0;

    // Keep button disabled until boot finishes
    startBtn.style.opacity = '0.45';
    startBtn.style.pointerEvents = 'none';
    startBtn.setAttribute('aria-disabled', 'true');

    const bootInterval = setInterval(() => {
        bootProgress += 10;
        if (bootProgress >= 100) {
            clearInterval(bootInterval);
            loadingText.innerHTML = 'SYSTEM READY — TAP TO BEGIN';
            loadingText.style.color = '#90e0ef';
            startBtn.style.opacity = '1';
            startBtn.style.pointerEvents = 'auto';
            startBtn.removeAttribute('aria-disabled');
            startBtn.classList.add('ready');
        } else {
            loadingText.innerHTML = `CALIBRATING SYSTEMS... ${bootProgress}%`;
        }
    }, 80);

    function beginCinematic(e) {
        if (started) return;
        // Only allow after boot is ready
        if (startBtn.getAttribute('aria-disabled') === 'true') return;
        started = true;

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        startContainer.classList.add('hidden');
        skipBtn.classList.remove('hidden');
        TimelineController.startTimeline();
    }

    // Support both click and touch (mobile)
    startBtn.addEventListener('click', beginCinematic);
    startBtn.addEventListener('touchend', beginCinematic, { passive: false });

    skipBtn.addEventListener('click', () => {
        TimelineController.clearTimeouts();
        Audio.stopAll();
        CinematicEngine.isRunning = false;
        if (CinematicEngine.animationFrameId) cancelAnimationFrame(CinematicEngine.animationFrameId);
        TimelineController.transitionToDashboard();
    });

    skipBtn.classList.add('hidden');
}

// Robust init: works whether DOMContentLoaded already fired or not
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}

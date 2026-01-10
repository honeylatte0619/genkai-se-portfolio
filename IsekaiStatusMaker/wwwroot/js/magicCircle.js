window.magicCircle = {
    canvas: null,
    ctx: null,
    animationId: null,
    userImage: null,

    // State
    config: {
        color: '#00e5ff',
        textMode: 'rune',
        speed: 1.0,
        particleCount: 50
    },

    // Assets
    particles: [],
    rotation: 0,

    // Init
    init: function (canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Init Particles
        this.initParticles();

        // Start Loop
        this.animate();
    },

    updateParams: function (newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.initParticles(); // Re-init particles if count changes
    },

    loadImage: function (src) {
        const img = new Image();
        img.onload = () => {
            this.userImage = img;
        };
        img.src = src;
    },

    initParticles: function () {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedY: Math.random() * -1 - 0.5,
                alpha: Math.random()
            });
        }
    },

    // --- Drawing Logic ---

    animate: function () {
        this.drawFrame();
        this.animationId = requestAnimationFrame(() => this.animate());
    },

    drawFrame: function () {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;
        const cx = w / 2;
        const cy = h / 2;
        const color = this.config.color;
        const time = Date.now() * 0.001 * this.config.speed;

        // 1. Clear & Background
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0f172a'; // Deep Blue
        // ctx.fillRect(0, 0, w, h); // Transparent canvas is better for component? No, paper has bg.
        // Let's keep it transparent so the CSS grid bg shows through unless exporting.
        // Actually for GIF export we need a background.
        // Let's fill a semi-transparent dark during preview, opaque during export?
        // For simplicity, always fill dark.
        // Wait, the Razor paper has a grid background. 
        // Let's clearRect to show that, but draw background for the magic circle glows to work well?
        // If we want Glow, we need darker bg.
        // Let's just create a radial gradient background for the magic circle
        const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 300);
        bgGrad.addColorStop(0, 'rgba(0, 20, 40, 0)');
        bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Common Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        // 2. Magic Circle Layers

        // Outer Ring (Hexagon)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.2);
        this.drawPolygon(ctx, 0, 0, 250, 6);
        this.drawCircle(ctx, 0, 0, 260); // Outline
        this.drawRunes(ctx, 270, 24, -time * 0.2); // Outer Runes
        ctx.restore();

        // Middle Ring (Text)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-time * 0.3);
        ctx.shadowBlur = 5;
        this.drawTextRing(ctx, 190, this.getTextContent());
        this.drawCircle(ctx, 0, 0, 210);
        // Inner Decoration
        this.drawPolygon(ctx, 0, 0, 180, 3); // Triangle
        ctx.restore();

        // Inner Ring (Fast)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.8);
        this.drawComplexCircle(ctx, 110);
        ctx.restore();

        // 3. Character Image
        if (this.userImage) {
            ctx.save();
            ctx.shadowBlur = 50;
            ctx.shadowColor = 'rgba(0,0,0,0.8)'; // Black glow behind
            // Clip circle
            ctx.beginPath();
            ctx.arc(cx, cy, 100, 0, Math.PI * 2);
            ctx.clip();
            // Draw Image
            // Calculate aspect fill
            const imgRatio = this.userImage.width / this.userImage.height;
            let dw = 200;
            let dh = 200 / imgRatio;
            if (dh < 200) { dh = 200; dw = 200 * imgRatio; }
            ctx.drawImage(this.userImage, cx - dw / 2, cy - dh / 2, dw, dh);
            ctx.restore();

            // Rim light
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, 100, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.restore();
        }

        // 4. Particles (Foreground)
        this.drawParticles(ctx, w, h);
    },

    // --- Helpers ---

    drawPolygon: function (ctx, x, y, radius, sides) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    },

    drawCircle: function (ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    },

    drawComplexCircle: function (ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius);
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.stroke();

        // Small circles on rim
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.rotate(i * Math.PI / 2);
            ctx.translate(radius, 0);
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    },

    getTextContent: function () {
        switch (this.config.textMode) {
            case 'code': return "sudo init magic --force -rf /reality ";
            case 'hex': return "0xDEAD 0xBEEF 0xCAFE 0xBABE ";
            default: return "᚛᚛ ᚠᚢᚦᚩᚱᚳ ᚷᚹᚺᚻᚾᛁᚦ ᛋ ᛏᛒᛖᛗᛚᛝ ᛟᛞ ᚪᚫᚣ ᛠ ᚛᚛ "; // Runic
        }
    },

    drawTextRing: function (ctx, radius, text) {
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const step = (Math.PI * 2) / text.length;
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            ctx.rotate(i * step);
            ctx.translate(0, -radius);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
    },

    drawRunes: function (ctx, radius, count, rotationOffset) {
        // Placeholder dots/lines for outer runes to save performance/logic
        ctx.save();
        for (let i = 0; i < count; i++) {
            ctx.rotate((Math.PI * 2) / count);
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(radius + 10, 0);
            ctx.stroke();
        }
        ctx.restore();
    },

    drawParticles: function (ctx, w, h) {
        this.particles.forEach(p => {
            p.y += p.speedY;
            if (p.y < 0) p.y = h;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = this.config.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    },

    // --- Export ---

    createGif: async function () {
        if (!window.GIF) {
            console.error("GIF.js not loaded");
            return;
        }

        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: 600,
            height: 600,
            workerScript: 'js/gif.worker.js' // Must match deployed path
        });

        // Capture Frames
        const fps = 20;
        const duration = 3.0; // seconds
        const frames = fps * duration;
        const dt = 1.0 / fps; // normalized time step? No, requestAnimationFrame is based on real time.
        // To record a perfect loop, we need to manually step the animation or capture real time?
        // Capturing real-time is easier but 'time' variable logic must be consistent.
        // My 'time' uses Date.now(). This is bad for Loop recording.
        // We should switch 'drawFrame' to accept a 'timestamp' or 'explicit time'.

        // Let's modify drawFrame to use this.rotation or passed time if possible, or just hack it.
        // Hack: Override Date.now just during recording? No.
        // Better: Refactor drawFrame to take 'simulatedTime' argument.

        // Temporarily pause main loop
        cancelAnimationFrame(this.animationId);

        const w = this.canvas.width;
        const h = this.canvas.height;

        // Rendering Loop
        for (let i = 0; i < frames; i++) {
            // Mock time: i * (duration / frames)
            const recTime = i * (duration / frames);

            // Note: My drawFrame uses Date.now().
            // I will inject a temporary override for 'time' calculation in drawFrame context?
            // Actually, let's just create a version of drawFrame that accepts 'timeOffset'.
            // OR simpler: just capture as is? No, loop won't be perfect.

            // To make it simple for now (and since user didn't STRICTLY demand perfect loop math, just "loop gif"):
            // I will capture real-time behavior.
            // But 'SpinSpeed' affects time.

            // Let's do this: 
            this.drawFrameForRecording(recTime);

            gif.addFrame(this.ctx, { copy: true, delay: 1000 / fps });
        }

        // Render
        gif.on('finished', function (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'summon_ritual.gif';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Restart loop
            window.magicCircle.animate();
        });

        gif.render();
    },

    // Modified Draw for explicit time
    drawFrameForRecording: function (timeInSeconds) {
        // Mock this.config.speed
        // Effectivley replace "Date.now() * 0.001 * speed" with "timeInSeconds * speed"
        // But I need to refactor drawFrame to accept input.
        // I'll duplicate the draw logic briefly for safety or refactor drawFrame above. 
        // Let's Refactor drawFrame above to accept 'customTime'.
        this.drawFrame(timeInSeconds * this.config.speed);
    }
};

// Patch drawFrame to accept time
window.magicCircle.drawFrame = function (customTime) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;
    const cx = w / 2;
    const cy = h / 2;
    const color = this.config.color;
    // Use customTime if provided, else Date.now
    const time = (customTime !== undefined) ? customTime : (Date.now() * 0.001 * this.config.speed);

    // 1. Clear & Background
    ctx.clearRect(0, 0, w, h);
    // Draw Dark BG for GIF (or preview stability)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Common Glow Settings
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    // 2. Magic Circle Layers

    // Outer Ring (Hexagon)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 0.5); // Fixed speed relative to time
    this.drawPolygon(ctx, 0, 0, 250, 6);
    this.drawCircle(ctx, 0, 0, 260);
    this.drawRunes(ctx, 270, 24);
    ctx.restore();

    // Middle Ring (Text)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-time * 0.3);
    ctx.shadowBlur = 5;
    this.drawTextRing(ctx, 190, this.getTextContent());
    this.drawCircle(ctx, 0, 0, 210);
    this.drawPolygon(ctx, 0, 0, 180, 3);
    ctx.restore();

    // Inner Ring (Fast)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 1.5);
    this.drawComplexCircle(ctx, 110);
    ctx.restore();

    // 3. Character Image
    if (this.userImage) {
        ctx.save();
        ctx.shadowBlur = 50;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.clip();

        const imgRatio = this.userImage.width / this.userImage.height;
        let dw = 200;
        let dh = 200 / imgRatio;
        if (dh < 200) { dh = 200; dw = 200 * imgRatio; }
        ctx.drawImage(this.userImage, cx - dw / 2, cy - dh / 2, dw, dh);
        ctx.restore();

        // Rim
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
    }

    // 4. Particles (Foreground)
    // Particles are hard to loop perfectly without seed. 
    // We just simulate them normally even in recording, they won't loop perfectly but it's acceptable for "Ritual Record".
    if (customTime !== undefined) {
        // During recording, we just sim forward by delta? 
        // Or just draw them static? Moving is better.
        // Let's just run update logic.
        this.updateParticles(w, h); // Logic moved out
    } else {
        this.updateParticles(w, h);
    }
    this.drawParticles(ctx);
};

window.magicCircle.updateParticles = function (w, h) {
    this.particles.forEach(p => {
        p.y += p.speedY; // Simple movement
        if (p.y < 0) p.y = h;
    });
};

window.magicCircle.drawParticles = function (ctx) {
    this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
};

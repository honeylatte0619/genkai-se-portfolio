window.novelPromo = {
    canvas: null,
    ctx: null,
    images: {},

    init: function (canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    },

    loadImage: function (key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    },

    drawFrame: function (state) {
        if (!this.canvas || !this.ctx) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // 1. Background
        if (this.images['bg']) {
            ctx.drawImage(this.images['bg'], 0, 0, width, height);
        } else {
            ctx.fillStyle = '#0f172a'; // Default dark
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Character
        if (this.images['char']) {
            ctx.save();
            const scale = state.charScale || 1.0;
            const x = state.charX || width / 2;
            const y = height; // Bottom align

            // Flip
            if (state.charFlip) {
                ctx.translate(x, y);
                ctx.scale(-1, 1);
                ctx.translate(-x, -y);
            }

            const img = this.images['char'];
            const w = img.width * scale;
            const h = img.height * scale;

            // Draw bottom centered at X
            // Adjust X for flip logic if needed, but simple translate handles flip axis
            // Standard draw: x is center
            ctx.drawImage(img, x - w / 2, y - h, w, h);
            ctx.restore();
        }

        // 3. Message Window
        const winH = height * 0.3; // 30% height
        const winY = height - winH - 20;
        const winX = 20;
        const winW = width - 40;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        // Round Rect
        this.roundRect(ctx, winX, winY, winW, winH, 10);
        ctx.fill();
        ctx.stroke();

        // Cyber accents
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(winX + 10, winY + winH - 5);
        ctx.lineTo(winX + winW - 10, winY + winH - 5);
        ctx.stroke();

        ctx.restore();

        // 4. Name
        if (state.name) {
            ctx.fillStyle = '#00ffff'; // Cyan
            ctx.font = 'bold 24px "Noto Sans JP", sans-serif';
            ctx.fillText(state.name, winX + 20, winY + 40);
        }

        // 5. Body Text (Typewriter)
        if (state.text) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px "Noto Sans JP", sans-serif';

            const lines = this.wrapText(ctx, state.text, winX + 20, winW - 40);
            const totalChars = state.text.length;
            const visibleChars = Math.floor(totalChars * state.progress); // 0.0 to 1.0

            let charCount = 0;
            let lineY = winY + 80;

            for (let line of lines) {
                let lineText = "";
                for (let char of line) {
                    if (charCount < visibleChars) {
                        lineText += char;
                        charCount++;
                    }
                }
                ctx.fillText(lineText, winX + 20, lineY);
                lineY += 30; // Line height
            }

            // 6. Waiting Cursor (at end)
            if (state.progress >= 1.0) {
                const now = Date.now();
                const bounce = Math.sin(now / 200) * 3;

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                const cx = winX + winW - 30;
                const cy = winY + winH - 20 + bounce;
                ctx.moveTo(cx - 5, cy - 5); // Inverted triangle
                ctx.lineTo(cx + 5, cy - 5);
                ctx.lineTo(cx, cy + 5);
                ctx.fill();
            }
        }
    },

    wrapText: function (ctx, text, maxWidth) {
        // Simple manual split for demo. 
        // For production, complex wrap logic is needed.
        // Assuming text contains manual newlines for now or basic splitting.
        // This is a simplified wrapper that respects explicit newlines
        // and does basic char width checking.

        const textLines = text.split('\n');
        let lines = [];

        for (let t of textLines) {
            let line = '';
            for (let i = 0; i < t.length; i++) {
                let testLine = line + t[i];
                let metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && i > 0) {
                    lines.push(line);
                    line = t[i];
                } else {
                    line = testLine;
                }
            }
            lines.push(line);
        }
        return lines;
    },

    roundRect: function (ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    },

    createGif: function (config, dotNetRef) {
        return new Promise(async (resolve, reject) => {
            try {
                // Config: { text, speedMs, ... }
                // gif.js config
                const gif = new GIF({
                    workers: 2,
                    quality: 10,
                    width: this.canvas.width,
                    height: this.canvas.height
                });

                const totalFrames = config.totalFrames || 50;
                const frameDelay = config.frameDelay || 100; // ms

                // Need precise control for typewriter:
                // Total duration = text.length * speedMs
                // Frames = Duration / frameDelay

                // Let's use simple progress loop
                // 0.0 -> 1.0 (Text appearing)
                // + 1.0 -> ... (Waiting cursor animation)

                // Text Part
                const textLen = config.text.length;
                const textDuration = textLen * config.charSpeed; // speed in ms per char
                const textFrames = Math.ceil(textDuration / frameDelay);

                for (let i = 0; i <= textFrames; i++) {
                    const progress = i / textFrames;
                    config.state.progress = Math.min(progress, 1.0);

                    // Force redraw
                    this.drawFrame(config.state);
                    gif.addFrame(this.canvas, { copy: true, delay: frameDelay });
                }

                // Waiting Part (e.g., 10 frames of bouncing)
                for (let i = 0; i < 10; i++) {
                    // Slight hack to animate cursor: drawFrame uses Date.now(), 
                    // ideally we should pass a time param to make it deterministic.
                    // For now, let's just accept it might jitter or better yet, mock time?
                    // Actually, let's manually update cursor offset if we want smooth GIF loop?
                    // Skipping complicated cursor sync for now.

                    config.state.progress = 1.0;
                    // Wait a bit to ensure Date.now() changes for cursor animation check
                    // But in a tight loop Date.now() might not advance enough.
                    // We'll skip cursor animation in GIF for simplicity or implement deterministic time.

                    this.drawFrame(config.state);
                    gif.addFrame(this.canvas, { copy: true, delay: frameDelay });

                    // Optional: Sleep if we really wanted Date.now() to move, but that blocks UI.
                    // Better: modify drawFrame to take 'time' or 'tick'.
                }

                gif.on('finished', function (blob) {
                    const url = URL.createObjectURL(blob);

                    // Trigger DL
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = config.filename || 'novel_promo.gif';
                    a.click();

                    resolve();
                });

                gif.render();

            } catch (e) {
                reject(e);
            }
        });
    }
};

// imageProcessor.js - Simple image processing for dot detection

class ImageProcessor {
    static async processImage(imageFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Resize image to manageable size
                const maxSize = 400;
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Simple dot detection using image analysis
                const dots = this.detectDots(canvas, ctx);
                resolve({ dots, canvas, originalImage: img });
            };
            
            img.onerror = reject;
            img.src = URL.createObjectURL(imageFile);
        });
    }

    static detectDots(canvas, ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        // Convert to grayscale and find dark spots
        const dots = [];
        const threshold = 100; // Adjust for sensitivity
        const minDistance = 20; // Minimum distance between dots
        
        for (let y = 10; y < height - 10; y += 5) {
            for (let x = 10; x < width - 10; x += 5) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const gray = (r + g + b) / 3;
                
                // Look for dark spots (potential dots)
                if (gray < threshold) {
                    // Check if this is a local minimum
                    let isDarkest = true;
                    let darkPixels = 0;
                    
                    // Check surrounding area
                    for (let dy = -5; dy <= 5; dy++) {
                        for (let dx = -5; dx <= 5; dx++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const nIdx = (ny * width + nx) * 4;
                                const nGray = (data[nIdx] + data[nIdx + 1] + data[nIdx + 2]) / 3;
                                if (nGray < gray) {
                                    isDarkest = false;
                                }
                                if (nGray < threshold) {
                                    darkPixels++;
                                }
                            }
                        }
                    }
                    
                    // If this is a local minimum with enough dark pixels around it
                    if (isDarkest && darkPixels > 20) {
                        // Check minimum distance from existing dots
                        let tooClose = false;
                        for (const dot of dots) {
                            const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
                            if (dist < minDistance) {
                                tooClose = true;
                                break;
                            }
                        }
                        
                        if (!tooClose) {
                            dots.push({ x, y, intensity: 255 - gray });
                        }
                    }
                }
            }
        }
        
        // Sort dots by intensity and keep the strongest ones
        dots.sort((a, b) => b.intensity - a.intensity);
        return dots.slice(0, Math.min(50, dots.length)); // Limit to 50 strongest dots
    }

    static drawDetectedDots(canvas, dots) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#00ff00';
        ctx.fillStyle = '#00ff00';
        ctx.lineWidth = 2;
        
        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        return canvas;
    }
}
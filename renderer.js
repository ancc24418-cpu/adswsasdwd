// renderer.js - Canvas rendering and animation

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationId = null;
        this.isAnimating = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderGrid(grid, style = 'loop', animate = false) {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.isAnimating = false;
        }

        this.clear();
        
        if (!grid || grid.length === 0) {
            this.drawPlaceholder();
            return;
        }

        // Center and scale the grid to fit canvas
        const centeredGrid = GridUtils.centerGrid(grid, this.canvas.width, this.canvas.height);
        
        if (animate) {
            this.animateKolam(centeredGrid, style);
        } else {
            this.drawStaticKolam(centeredGrid, style);
        }
    }

    drawStaticKolam(grid, style) {
        this.setupDrawingStyle();
        
        // Draw dots first
        this.ctx.fillStyle = '#2d3748';
        grid.forEach(row => {
            row.forEach(([x, y]) => {
                Motifs.drawDot(this.ctx, [x, y], 3);
            });
        });

        // Draw motifs
        this.ctx.strokeStyle = '#4299e1';
        this.ctx.lineWidth = 2;
        
        grid.forEach((row, i) => {
            row.forEach(([x, y], j) => {
                this.drawMotif([x, y], style, grid, i, j);
            });
        });
    }

    animateKolam(grid, style) {
        this.isAnimating = true;
        let currentDot = 0;
        const totalDots = grid.reduce((sum, row) => sum + row.length, 0);
        const animationSpeed = 100; // milliseconds per dot

        const animate = () => {
            if (!this.isAnimating) return;

            this.clear();
            this.setupDrawingStyle();

            // Draw all dots
            this.ctx.fillStyle = '#2d3748';
            grid.forEach(row => {
                row.forEach(([x, y]) => {
                    Motifs.drawDot(this.ctx, [x, y], 3);
                });
            });

            // Draw motifs up to current dot
            this.ctx.strokeStyle = '#4299e1';
            this.ctx.lineWidth = 2;
            
            let dotIndex = 0;
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].length; j++) {
                    if (dotIndex >= currentDot) break;
                    
                    const [x, y] = grid[i][j];
                    this.drawMotif([x, y], style, grid, i, j);
                    dotIndex++;
                }
                if (dotIndex >= currentDot) break;
            }

            currentDot++;
            
            if (currentDot <= totalDots) {
                setTimeout(() => {
                    this.animationId = requestAnimationFrame(animate);
                }, animationSpeed);
            } else {
                this.isAnimating = false;
            }
        };

        animate();
    }

    drawMotif(center, style, grid, i, j) {
        switch (style) {
            case 'loop':
                Motifs.loopAroundDot(this.ctx, center, 25);
                break;
            case 'cross':
                Motifs.crossLines(this.ctx, center, 20);
                break;
            case 'diagonal':
                Motifs.diagonalCross(this.ctx, center, 20);
                break;
            case 'arc':
                const direction = (i + j) % 2 === 0 ? 'right' : 'left';
                Motifs.arcMotif(this.ctx, center, 20, direction);
                break;
            case 'spiral':
                Motifs.spiral(this.ctx, center, 2.5, 20);
                break;
            case 'tiling':
                // Connect to right neighbor
                if (j < grid[i].length - 1) {
                    const rightNeighbor = grid[i][j + 1];
                    Motifs.lineBetweenDots(this.ctx, center, rightNeighbor);
                }
                // Connect to bottom neighbor
                if (i < grid.length - 1 && j < grid[i + 1].length) {
                    const bottomNeighbor = grid[i + 1][j];
                    Motifs.lineBetweenDots(this.ctx, center, bottomNeighbor);
                }
                break;
        }
    }

    setupDrawingStyle() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = 'rgba(66, 153, 225, 0.3)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
    }

    drawPlaceholder() {
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            'Generate a kolam or upload an image',
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    downloadCanvas(filename = 'kolam.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL();
        link.click();
    }
}
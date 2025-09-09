// motifs.js - JavaScript implementations of kolam motifs

class Motifs {
    static loopAroundDot(ctx, center, radius = 30, points = 120) {
        const [x0, y0] = center;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const theta = (i / points) * 2 * Math.PI;
            const x = x0 + radius * Math.cos(theta);
            const y = y0 + radius * Math.sin(theta);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    static crossLines(ctx, center, length = 25) {
        const [x, y] = center;
        ctx.beginPath();
        // Horizontal line
        ctx.moveTo(x - length, y);
        ctx.lineTo(x + length, y);
        // Vertical line
        ctx.moveTo(x, y - length);
        ctx.lineTo(x, y + length);
        ctx.stroke();
    }

    static diagonalCross(ctx, center, length = 25) {
        const [x, y] = center;
        ctx.beginPath();
        // Diagonal line 1
        ctx.moveTo(x - length, y - length);
        ctx.lineTo(x + length, y + length);
        // Diagonal line 2
        ctx.moveTo(x - length, y + length);
        ctx.lineTo(x + length, y - length);
        ctx.stroke();
    }

    static arcMotif(ctx, center, radius = 25, direction = 'right', points = 80) {
        const [x0, y0] = center;
        ctx.beginPath();
        
        let startAngle, endAngle;
        if (direction === 'right') {
            startAngle = -Math.PI / 2;
            endAngle = Math.PI / 2;
        } else {
            startAngle = Math.PI / 2;
            endAngle = 3 * Math.PI / 2;
        }
        
        for (let i = 0; i <= points; i++) {
            const theta = startAngle + (i / points) * (endAngle - startAngle);
            const x = x0 + radius * Math.cos(theta);
            const y = y0 + radius * Math.sin(theta);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    static spiral(ctx, center, turns = 2.5, radius = 25, points = 300) {
        const [x0, y0] = center;
        ctx.beginPath();
        
        for (let i = 0; i <= points; i++) {
            const theta = (i / points) * 2 * Math.PI * turns;
            const r = (i / points) * radius;
            const x = x0 + r * Math.cos(theta);
            const y = y0 + r * Math.sin(theta);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    static lineBetweenDots(ctx, p1, p2) {
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
    }

    static drawDot(ctx, center, radius = 3) {
        const [x, y] = center;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
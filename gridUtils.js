// gridUtils.js - Grid creation and manipulation utilities

class GridUtils {
    static createDotGrid(rows, cols, spacing = 50) {
        const grid = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push([j * spacing, i * spacing]);
            }
            grid.push(row);
        }
        return grid;
    }

    static createGridFromDetectedDots(dots, tolerance = 25) {
        if (!dots || dots.length === 0) {
            return [];
        }

        // Convert dots to points and sort by y, then x
        const points = dots.map(dot => ({ x: dot.x, y: dot.y }))
                          .sort((a, b) => a.y - b.y || a.x - b.x);

        // Group points into rows based on y-coordinate
        const rows = [];
        for (const point of points) {
            let placed = false;
            for (const row of rows) {
                if (Math.abs(row[0].y - point.y) <= tolerance) {
                    row.push(point);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                rows.push([point]);
            }
        }

        // Sort each row by x-coordinate and convert to coordinate pairs
        const grid = rows.map(row => {
            return row.sort((a, b) => a.x - b.x)
                     .map(point => [point.x, point.y]);
        });

        return grid;
    }

    static centerGrid(grid, canvasWidth, canvasHeight) {
        if (!grid || grid.length === 0) return grid;

        // Find grid bounds
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        grid.forEach(row => {
            row.forEach(([x, y]) => {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });
        });

        // Calculate grid dimensions
        const gridWidth = maxX - minX;
        const gridHeight = maxY - minY;

        // Calculate centering offsets
        const offsetX = (canvasWidth - gridWidth) / 2 - minX;
        const offsetY = (canvasHeight - gridHeight) / 2 - minY;

        // Apply centering
        return grid.map(row => 
            row.map(([x, y]) => [x + offsetX, y + offsetY])
        );
    }

    static scaleGrid(grid, scaleFactor) {
        return grid.map(row => 
            row.map(([x, y]) => [x * scaleFactor, y * scaleFactor])
        );
    }

    static getGridBounds(grid) {
        if (!grid || grid.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        grid.forEach(row => {
            row.forEach(([x, y]) => {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });
        });

        return { minX, maxX, minY, maxY };
    }
}
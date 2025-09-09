// analyzer.js - Symmetry analysis for kolam patterns

class Analyzer {
    static reflectGrid(grid, axis = 'horizontal') {
        if (!grid || grid.length === 0) return grid;

        switch (axis) {
            case 'horizontal':
                return [...grid].reverse();
            case 'vertical':
                return grid.map(row => [...row].reverse());
            case 'transpose':
                const maxCols = Math.max(...grid.map(row => row.length));
                const transposed = [];
                for (let col = 0; col < maxCols; col++) {
                    const newRow = [];
                    for (let row = 0; row < grid.length; row++) {
                        if (col < grid[row].length) {
                            newRow.push(grid[row][col]);
                        }
                    }
                    if (newRow.length > 0) {
                        transposed.push(newRow);
                    }
                }
                return transposed;
            default:
                return grid;
        }
    }

    static rotateGrid90(grid) {
        if (!grid || grid.length === 0) return grid;
        
        const transposed = this.reflectGrid(grid, 'transpose');
        return transposed.map(row => [...row].reverse());
    }

    static gridsEqual(g1, g2, tolerance = 15) {
        if (!g1 || !g2 || g1.length !== g2.length) return false;

        for (let i = 0; i < g1.length; i++) {
            if (g1[i].length !== g2[i].length) return false;
            
            for (let j = 0; j < g1[i].length; j++) {
                const [x1, y1] = g1[i][j];
                const [x2, y2] = g2[i][j];
                
                if (Math.abs(x1 - x2) > tolerance || Math.abs(y1 - y2) > tolerance) {
                    return false;
                }
            }
        }
        return true;
    }

    static analyzeSymmetries(grid) {
        if (!grid || grid.length === 0) {
            return {
                horizontal_reflection: false,
                vertical_reflection: false,
                rotation_90: false,
                rotation_180: false
            };
        }

        const results = {};
        
        try {
            // Horizontal reflection (flip top-bottom)
            const horizontalReflected = this.reflectGrid(grid, 'horizontal');
            results.horizontal_reflection = this.gridsEqual(grid, horizontalReflected);

            // Vertical reflection (flip left-right)
            const verticalReflected = this.reflectGrid(grid, 'vertical');
            results.vertical_reflection = this.gridsEqual(grid, verticalReflected);

            // 90-degree rotation
            const rotated90 = this.rotateGrid90(grid);
            results.rotation_90 = this.gridsEqual(grid, rotated90);

            // 180-degree rotation
            const rotated180 = this.rotateGrid90(this.rotateGrid90(grid));
            results.rotation_180 = this.gridsEqual(grid, rotated180);

        } catch (error) {
            console.warn('Error in symmetry analysis:', error);
            results.horizontal_reflection = false;
            results.vertical_reflection = false;
            results.rotation_90 = false;
            results.rotation_180 = false;
        }

        return results;
    }

    static getSymmetryScore(symmetries) {
        const trueCount = Object.values(symmetries).filter(Boolean).length;
        return trueCount / Object.keys(symmetries).length;
    }

    static classifyPattern(grid, symmetries) {
        const score = this.getSymmetryScore(symmetries);
        const totalDots = grid.reduce((sum, row) => sum + row.length, 0);

        if (score >= 0.75) {
            return 'symmetric';
        } else if (score >= 0.25) {
            return 'tiling';
        } else {
            return 'freeform';
        }
    }
}
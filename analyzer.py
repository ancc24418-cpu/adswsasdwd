# analyzer.py - symmetry analysis using grid transforms
import numpy as np

def reflect_grid(grid, axis='horizontal'):
    if axis == 'horizontal':
        return grid[::-1]
    elif axis == 'vertical':
        return [row[::-1] for row in grid]
    elif axis == 'transpose':
        # convert list of rows of points to transposed structure (may be irregular)
        # we approximate transpose by using column indices up to min row length
        nrows = len(grid)
        ncols = min(len(r) for r in grid)
        out = []
        for c in range(ncols):
            col = []
            for r in range(nrows):
                col.append(grid[r][c])
            out.append(col)
        return out
    return grid

def rotate_grid_90(grid):
    # rotate points by 90 degrees around centroid (approx) and re-cluster is complex;
    # here we rotate the grid indices (not pixel coords) if grid is regular.
    transposed = reflect_grid(grid, 'transpose')
    return [list(reversed(r)) for r in transposed]

def grids_equal(g1, g2, tol=12):
    if len(g1) != len(g2):
        return False
    for row1, row2 in zip(g1, g2):
        if len(row1) != len(row2):
            return False
        for p1, p2 in zip(row1, row2):
            if abs(p1[0] - p2[0]) > tol or abs(p1[1] - p2[1]) > tol:
                return False
    return True

def analyze_symmetries(dot_grid):
    results = {}
    results['horizontal_reflection'] = grids_equal(dot_grid, reflect_grid(dot_grid, 'horizontal'))
    results['vertical_reflection'] = grids_equal(dot_grid, reflect_grid(dot_grid, 'vertical'))
    try:
        results['rotation_90'] = grids_equal(dot_grid, rotate_grid_90(dot_grid))
        results['rotation_180'] = grids_equal(dot_grid, rotate_grid_90(rotate_grid_90(dot_grid)))
    except Exception:
        results['rotation_90'] = False
        results['rotation_180'] = False
    return results

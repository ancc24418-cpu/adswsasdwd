# grid.py - grid utilities
def create_dot_grid(rows, cols, spacing=1.0):
    return [[(j * spacing, i * spacing) for j in range(cols)] for i in range(rows)]

def create_grid_from_detected_dots(circles, tolerance=12):
    """Convert detected circle centers into a structured 2D grid (list of rows).
    circles: iterable of (x,y,r)
    """
    if circles is None or len(circles) == 0:
        return []
    points = sorted([(int(x), int(y)) for x, y, _ in circles], key=lambda p: (p[1], p[0]))
    rows = []
    for pt in points:
        placed = False
        for row in rows:
            if abs(row[0][1] - pt[1]) <= tolerance:
                row.append(pt)
                placed = True
                break
        if not placed:
            rows.append([pt])
    for row in rows:
        row.sort(key=lambda p: p[0])
    return rows

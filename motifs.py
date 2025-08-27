# motifs.py - motif drawing primitives (return x,y sequences or line segments)
import numpy as np

def loop_around_dot(center, radius=0.3, points=120):
    x0, y0 = center
    theta = np.linspace(0, 2 * np.pi, points)
    x = x0 + radius * np.cos(theta)
    y = y0 + radius * np.sin(theta)
    return x, y

def cross_lines(center, length=0.6):
    x, y = center
    return [([x - length, x + length], [y, y]), ([x, x], [y - length, y + length])]

def diagonal_cross(center, length=0.6):
    x, y = center
    return [([x - length, x + length], [y - length, y + length]), ([x - length, x + length], [y + length, y - length])]

def arc_motif(center, radius=0.4, direction='right', points=80):
    x0, y0 = center
    if direction == 'right':
        theta = np.linspace(-0.5 * np.pi, 0.5 * np.pi, points)
    else:
        theta = np.linspace(0.5 * np.pi, 1.5 * np.pi, points)
    x = x0 + radius * np.cos(theta)
    y = y0 + radius * np.sin(theta)
    return x, y

def spiral(center, turns=2.5, radius=0.5, points=300):
    x0, y0 = center
    theta = np.linspace(0, 2 * np.pi * turns, points)
    r = np.linspace(0, radius, points)
    x = x0 + r * np.cos(theta)
    y = y0 + r * np.sin(theta)
    return x, y

def line_between_dots(p1, p2):
    return [ [p1[0], p2[0]], [p1[1], p2[1]] ]

# renderer.py - rendering grid and motifs + animation
import matplotlib.pyplot as plt
from matplotlib import animation
from motifs import loop_around_dot, cross_lines, arc_motif, diagonal_cross, spiral, line_between_dots

def render_grid_with_loops(dot_grid, scale=1.0, style='loop', show=True, figsize=(6,6)):
    fig, ax = plt.subplots(figsize=figsize)
    ax.set_aspect('equal')
    for i, row in enumerate(dot_grid):
        for j, (x, y) in enumerate(row):
            x_s, y_s = x * scale, y * scale
            ax.plot(x_s, y_s, 'ko', markersize=3)
            if style == 'loop':
                xs, ys = loop_around_dot((x_s, y_s), radius=0.35*scale)
                ax.plot(xs, ys)
            elif style == 'cross':
                segs = cross_lines((x_s, y_s), length=0.35*scale)
                for xs, ys in segs:
                    ax.plot(xs, ys)
            elif style == 'arc':
                xs, ys = arc_motif((x_s, y_s), radius=0.4*scale)
                ax.plot(xs, ys)
            elif style == 'diagonal':
                segs = diagonal_cross((x_s, y_s), length=0.35*scale)
                for xs, ys in segs:
                    ax.plot(xs, ys)
            elif style == 'spiral':
                xs, ys = spiral((x_s, y_s), radius=0.4*scale)
                ax.plot(xs, ys)
            elif style == 'tiling':
                # connect right and bottom neighbors if exist
                if j < len(row) - 1:
                    p2 = (row[j+1][0]*scale, row[j+1][1]*scale)
                    xs, ys = line_between_dots((x_s,y_s), p2)
                    ax.plot(xs, ys)
                if i < len(dot_grid) - 1:
                    p2 = (dot_grid[i+1][j][0]*scale, dot_grid[i+1][j][1]*scale)
                    xs, ys = line_between_dots((x_s,y_s), p2)
                    ax.plot(xs, ys)
    ax.axis('off')
    if show:
        plt.show()
    return fig, ax

def animate_kolam(dot_grid, style='loop', scale=1.0, interval=300, figsize=(6,6)):
    fig, ax = plt.subplots(figsize=figsize)
    ax.set_aspect('equal')
    ax.axis('off')
    max_frames = len(dot_grid) * max(len(r) for r in dot_grid)
    artists = []

    def draw_frame(frame):
        ax.clear()
        ax.set_aspect('equal')
        ax.axis('off')
        # draw dots always
        for i, row in enumerate(dot_grid):
            for j, (x, y) in enumerate(row):
                ax.plot(x*scale, y*scale, 'ko', markersize=3)
        # draw up to this frame
        frame_i = frame // max(len(r) for r in dot_grid)
        frame_j = frame % max(len(r) for r in dot_grid)
        count = frame + 1
        idx = 0
        for i, row in enumerate(dot_grid):
            for j, (x, y) in enumerate(row):
                if idx >= count:
                    break
                x_s, y_s = x*scale, y*scale
                if style == 'loop':
                    xs, ys = loop_around_dot((x_s, y_s), radius=0.35*scale)
                    ax.plot(xs, ys)
                elif style == 'spiral':
                    xs, ys = spiral((x_s, y_s), radius=0.4*scale)
                    ax.plot(xs, ys)
                elif style == 'tiling':
                    if j < len(row) - 1:
                        p2 = (row[j+1][0]*scale, row[j+1][1]*scale)
                        xs, ys = line_between_dots((x_s,y_s), p2)
                        ax.plot(xs, ys)
                    if i < len(dot_grid) - 1:
                        p2 = (dot_grid[i+1][j][0]*scale, dot_grid[i+1][j][1]*scale)
                        xs, ys = line_between_dots((x_s,y_s), p2)
                        ax.plot(xs, ys)
                elif style == 'cross':
                    segs = cross_lines((x_s, y_s), length=0.35*scale)
                    for xs, ys in segs:
                        ax.plot(xs, ys)
                idx += 1
        return artists

    ani = animation.FuncAnimation(fig, draw_frame, frames=max_frames, interval=interval, blit=False, repeat=False)
    return ani

# ml_model.py - placeholder for CNN classifier integration (use transfer learning offline)

import numpy as np

def extract_simple_features_from_circles(circles):
    if not circles:
        return [0,0,0]
    xs = [c[0] for c in circles]
    ys = [c[1] for c in circles]
    spread_x = max(xs) - min(xs)
    spread_y = max(ys) - min(ys)
    return [len(circles), spread_x, int(abs(spread_x - spread_y) < 30)]

class DummyClassifier:
    def predict(self, fv):
        # fv: feature vector
        if fv[0] < 10:
            return 'small'
        if fv[2] == 1:
            return 'symmetric'
        return 'freeform'

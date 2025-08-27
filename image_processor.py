import cv2
import numpy as np

def deskew_and_crop(img):
    edges = cv2.Canny(img, 50, 150)
    coords = np.column_stack(np.where(edges > 0))
    if coords.shape[0] < 10:
        return img
    rect = cv2.minAreaRect(coords)
    angle = rect[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated

def preprocess_image(img):
    original = img.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = deskew_and_crop(gray)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    return original, gray, blur

def adaptive_dot_detection(img_gray):
    th = cv2.adaptiveThreshold(img_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                               cv2.THRESH_BINARY_INV, 25, 7)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
    clean = cv2.morphologyEx(th, cv2.MORPH_OPEN, kernel, iterations=1)
    contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    centers = []
    for c in contours:
        area = cv2.contourArea(c)
        if area < 8 or area > 2000:
            continue
        M = cv2.moments(c)
        if M['m00'] == 0:
            continue
        cx = int(M['m10']/M['m00'])
        cy = int(M['m01']/M['m00'])
        centers.append((cx, cy))
    
    centers = sorted(centers, key=lambda p: (p[1], p[0]))
    
    rows = []
    tol = 12
    for pt in centers:
        placed = False
        for row in rows:
            if abs(row[0][1] - pt[1]) <= tol:
                row.append(pt)
                placed = True
                break
        if not placed:
            rows.append([pt])
    
    for row in rows:
        row.sort(key=lambda p: p[0])
    
    return rows, clean

def draw_detected_dots(img, rows):
    output = img.copy()
    for row in rows:
        for (x, y) in row:
            cv2.circle(output, (x, y), 5, (0, 255, 0), -1)
    return output

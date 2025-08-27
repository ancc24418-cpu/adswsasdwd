
# train_cnn.py - training script for Kolam classifier (run locally with TensorFlow)
import os, json, numpy as np
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

DATA_DIR = 'kolam_synth'

with open(os.path.join(DATA_DIR, 'meta.json')) as f:
    meta = json.load(f)

X = []
y = []
label_to_idx = {'symmetric':0,'tiling':1,'freeform':2}
for item in meta:
    img = keras.preprocessing.image.load_img(item['file'], color_mode='rgb', target_size=(128,128))
    arr = keras.preprocessing.image.img_to_array(img)/255.0
    X.append(arr); y.append(label_to_idx[item['class']])
X = np.array(X); y = np.array(y)

datagen = ImageDataGenerator(width_shift_range=0.1, height_shift_range=0.1, rotation_range=10, zoom_range=0.08)
model = keras.Sequential([
    layers.Conv2D(16, (3,3), activation='relu', input_shape=(128,128,3)),
    layers.MaxPooling2D(2,2),
    layers.Conv2D(32, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(3, activation='softmax')
])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(datagen.flow(X, y, batch_size=16), epochs=12, validation_split=0.1)
model.save(os.path.join(DATA_DIR, 'kolam_cnn.h5'))
print('Training complete. Model saved to', os.path.join(DATA_DIR, 'kolam_cnn.h5'))

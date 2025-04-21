# Object Detection Models Information

This document provides information about the pre-trained models used in this application.

## COCO-SSD

COCO-SSD is a single-shot detection model that can identify and locate 80 different object classes in images or video frames.

### Model Details

- **Full Name**: Common Objects in Context - Single Shot MultiBox Detection
- **Architecture**: MobileNet V1/V2 + SSD
- **Variants**: 
  - `lite`: Smallest and fastest, but less accurate
  - `mobilenet_v1`: Balanced speed and accuracy
  - `mobilenet_v2`: Most accurate, but slowest
- **Input Size**: 300x300 pixels
- **Output**: Array of detected objects with class, confidence score, and bounding box coordinates
- **Size**: 5-8 MB (depending on variant)
- **Speed**: 20-30 FPS on modern browsers

### COCO Classes

The model can detect the following 80 object classes:

```
person, bicycle, car, motorcycle, airplane, bus, train, truck, boat, traffic light, 
fire hydrant, stop sign, parking meter, bench, bird, cat, dog, horse, sheep, cow, 
elephant, bear, zebra, giraffe, backpack, umbrella, handbag, tie, suitcase, frisbee, 
skis, snowboard, sports ball, kite, baseball bat, baseball glove, skateboard, surfboard, 
tennis racket, bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwich, 
orange, broccoli, carrot, hot dog, pizza, donut, cake, chair, couch, potted plant, bed, 
dining table, toilet, tv, laptop, mouse, remote, keyboard, cell phone, microwave, oven, 
toaster, sink, refrigerator, book, clock, vase, scissors, teddy bear, hair drier, toothbrush
```

## BlazeFace

BlazeFace is a lightweight face detection model designed for mobile devices.

### Model Details

- **Architecture**: Optimized convolutional neural network designed for mobile GPU inference
- **Input Size**: 128x128 pixels
- **Output**: Array of detected faces with bounding box coordinates, confidence scores, and facial landmarks
- **Size**: ~2 MB
- **Speed**: 30-40 FPS on modern browsers

### Features

- Fast performance on mobile devices
- Accurate face detection in various lighting conditions
- Works well with multiple faces in a single frame
- Can detect faces at various angles and orientations

## Comparing Models

| Feature | COCO-SSD | BlazeFace |
|---------|----------|-----------|
| Detection Type | General objects | Faces only |
| Number of Classes | 80 | 1 |
| Model Size | 5-8 MB | ~2 MB |
| Speed | Medium | Fast |
| Accuracy | Medium-High | High (for faces) |
| Best Use Case | General object detection | Face detection applications |

## Using Custom Models

The application can be extended to use custom TensorFlow.js models. To use a custom model:

1. Convert your model to TensorFlow.js format
2. Host the model files or place them in the `/public/models` directory
3. Implement the necessary detection logic in the detection service

For more information on creating custom TensorFlow.js models, see the [TensorFlow.js documentation](https://www.tensorflow.org/js/guide/conversion).

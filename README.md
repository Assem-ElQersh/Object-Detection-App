# Real-Time Object Detection Application

This repository contains a web-based object detection application that uses TensorFlow.js and pre-trained models to detect objects in images and video streams from webcams.

## Features

- 📷 Image upload and object detection
- 🎥 Real-time webcam object detection
- 🔍 Support for multiple pre-trained models (COCO-SSD, BlazeFace)
- 📊 Detection results visualization with bounding boxes
- 📱 Responsive design for desktop and mobile devices

## Repository Structure

```
object-detection-app/
├── public/                      # Static files
│   ├── index.html               # HTML entry point
│   ├── favicon.ico              # App favicon
│   └── models/                  # Pre-trained model files (git-ignored)
│
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── App.js               # Main App component
│   │   ├── DetectionView.js     # Detection visualization component
│   │   ├── ImageUploader.js     # Image upload component
│   │   ├── ModelSelector.js     # Model selection component
│   │   ├── WebcamCapture.js     # Webcam component
│   │   └── ResultsPanel.js      # Detection results display component
│   │
│   ├── services/                # Helper services
│   │   ├── detectionService.js  # Object detection logic
│   │   ├── modelLoader.js       # Model loading utilities
│   │   └── drawingUtils.js      # Canvas drawing utilities
│   │
│   ├── utils/                   # Utility functions
│   │   └── constants.js         # App constants and configs
│   │
│   ├── index.js                 # JS entry point
│   └── styles.css               # Global styles
│
├── docs/                        # Documentation
│   ├── demo-screenshot.png      # Demo screenshot
│   └── model-info.md            # Model information docs
│
├── .gitignore                   # Git ignore file
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Project dependencies
├── package-lock.json            # Dependency lock file (generated automatically)
├── README.md                    # This readme file
└── LICENSE                      # Project license
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Assem-ElQersh/Object-Detection-App.git
   cd Object-Detection-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Models

The application currently supports the following pre-trained models:

- **COCO-SSD**: A fast object detection model that can detect 80 different object categories.
- **YOLO (You Only Look Once)**: A more accurate but more resource-intensive model.

## Usage

1. **Upload an Image**
   - Click the "Upload" button to select an image from your device
   - The model will automatically detect objects in the uploaded image

2. **Use Webcam**
   - Click the "Enable Webcam" button to start your device's camera
   - Objects will be detected in real-time from the video stream
   - Click "Disable Webcam" to stop the camera

3. **Change Model**
   - Select a different model from the dropdown menu
   - The application will load the new model and use it for detection

## Future Enhancements

- Add support for custom models
- Implement object tracking across video frames
- Add performance metrics and model comparison tools
- Support for mobile device cameras and orientation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Assem-ElQersh/Object-Detection-App/blob/main/LICENSE) file for details.

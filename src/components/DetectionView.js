import React, { useRef, useEffect, useState } from 'react';
import { detectObjects } from '../services/detectionService';
import { drawDetections } from '../services/drawingUtils';

const DetectionView = ({
  model,
  image,
  useWebcam,
  isDetecting,
  onDetectionResults,
  onDetectionStart,
  modelConfig
}) => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const requestRef = useRef(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setCanvasContext(ctx);
      setCanvasInitialized(true);
    }
  }, [canvasRef]);

  // Handle image detection
  useEffect(() => {
    if (image && model && canvasInitialized && !useWebcam) {
      const detectImage = async () => {
        try {
          onDetectionStart();
          
          // Set canvas dimensions to match image
          canvasRef.current.width = image.width;
          canvasRef.current.height = image.height;
          
          // Clear previous results
          canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw the image first
          canvasContext.drawImage(image, 0, 0, image.width, image.height);
          
          // Detect objects
          const results = await detectObjects(model, imageRef.current, modelConfig);
          
          // Draw detection boxes
          drawDetections(canvasContext, results, modelConfig);
          
          // Send results to parent component
          onDetectionResults(results);
        } catch (err) {
          console.error('Error during image detection:', err);
          onDetectionResults([]);
        }
      };
      
      detectImage();
    }
  }, [image, model, canvasInitialized, useWebcam, onDetectionStart, onDetectionResults, canvasContext, modelConfig]);

  // Start/stop webcam
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'environment'
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setVideoStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Update video dimensions once metadata is loaded
          videoRef.current.onloadedmetadata = () => {
            setVideoDimensions({
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight
            });
            
            // Also update canvas dimensions
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          };
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    const stopWebcam = () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };

    if (useWebcam && !videoStream) {
      startWebcam();
    } else if (!useWebcam && videoStream) {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [useWebcam, videoStream]);

  // Webcam detection loop
  useEffect(() => {
    const detectFrame = async () => {
      if (videoRef.current && model && canvasContext && videoRef.current.readyState === 4) {
        try {
          // Draw the current video frame
          canvasContext.drawImage(
            videoRef.current, 
            0, 0, 
            canvasRef.current.width, 
            canvasRef.current.height
          );
          
          // Detect objects in the current frame
          const results = await detectObjects(model, videoRef.current, modelConfig);
          
          // Draw detection boxes
          drawDetections(canvasContext, results, modelConfig);
          
          // Send results to parent component (but not too often to avoid UI updates)
          // We could implement throttling here
          onDetectionResults(results);
        } catch (err) {
          console.error('Error during webcam detection:', err);
        }
      }
      
      // Continue the detection loop
      requestRef.current = requestAnimationFrame(detectFrame);
    };

    if (useWebcam && model && videoStream && canvasInitialized && videoRef.current) {
      detectFrame();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [useWebcam, model, videoStream, canvasInitialized, canvasContext, onDetectionResults, modelConfig]);

  return (
    <div className="relative flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
      {/* Hidden image for detection processing */}
      {image && !useWebcam && (
        <img
          ref={imageRef}
          src={image.src}
          alt="Detection source"
          className="hidden"
        />
      )}
      
      {/* Video element for webcam (hidden but used for detection) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={useWebcam ? "hidden" : "hidden"}
      />
      
      {/* Canvas for drawing detection results */}
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-[70vh] object-contain"
        width={videoDimensions.width}
        height={videoDimensions.height}
      />
      
      {/* Placeholder when no image or webcam */}
      {!image && !useWebcam && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            Upload an image or enable webcam to start detection
          </p>
        </div>
      )}
      
      {/* Loading overlay */}
      {isDetecting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Detecting objects...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionView;

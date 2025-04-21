import React, { useRef, useEffect, useState } from 'react';
import { WEBCAM_RESOLUTIONS } from '../utils/constants';

const WebcamCapture = ({ isActive, onFrame, resolution = 'medium' }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get webcam dimensions from resolution setting
  const getWebcamDimensions = () => {
    return WEBCAM_RESOLUTIONS[resolution] || WEBCAM_RESOLUTIONS.medium;
  };

  // Start webcam
  const startWebcam = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support webcam access.');
      return;
    }

    try {
      setIsLoading(true);
      const dimensions = getWebcamDimensions();
      
      const constraints = {
        video: {
          width: { ideal: dimensions.width },
          height: { ideal: dimensions.height },
          facingMode: 'environment' // Use back camera on mobile devices if available
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Webcam access denied. Please grant camera permission.');
      } else if (err.name === 'NotFoundError') {
        setError('No webcam found. Please connect a camera and try again.');
      } else {
        setError(`Failed to access webcam: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Handle frame processing
  const processFrame = () => {
    if (videoRef.current && videoRef.current.readyState === 4 && onFrame) {
      onFrame(videoRef.current);
    }
  };

  // Start/stop webcam based on isActive prop
  useEffect(() => {
    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [isActive, resolution]);

  // Process frames when video is playing
  useEffect(() => {
    let frameId;
    
    const captureFrame = () => {
      processFrame();
      frameId = requestAnimationFrame(captureFrame);
    };

    if (isActive && stream && !isLoading) {
      frameId = requestAnimationFrame(captureFrame);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isActive, stream, isLoading]);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full ${isActive ? 'block' : 'hidden'}`}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-2">Starting webcam...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="mt-2 text-red-600">{error}</p>
            <button 
              onClick={startWebcam}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles.css';
import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
tf.setBackend('webgl').then(() => {
  console.log('TensorFlow.js initialized with WebGL backend');
}).catch(err => {
  console.warn('WebGL backend not available, falling back to CPU:', err);
  tf.setBackend('cpu');
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

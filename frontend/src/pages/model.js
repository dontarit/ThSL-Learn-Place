import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const PredictionComponent = () => {
  const [inputData, setInputData] = useState(''); // Store input data
  const [prediction, setPrediction] = useState(null); // Store prediction result
  const [socket, setSocket] = useState(null); // Socket connection

  // Connect to Flask backend on component mount
  useEffect(() => {
    // Use HTTPS WebSocket URL for the backend
    const socket = io('https://localhost:5000', {
      secure: true,   // Ensures secure WebSocket connection
      rejectUnauthorized: false  // For local development with self-signed certificates
    });
    setSocket(socket);

    // Listen for prediction results from Flask backend
    socket.on('prediction_result', (data) => {
      console.log('Prediction received:', data);
      setPrediction(data.prediction);
    });

    // Listen for errors
    socket.on('error', (data) => {
      console.error('Error:', data.message);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (e) => {
    setInputData(e.target.value); // Update input state
  };

  const handlePredict = () => {
    // Send input data to the Flask backend for prediction
    if (socket) {
      socket.emit('predict', { input: [parseFloat(inputData)] });
    }
  };

  return (
    <div>
      <h1>Real-Time Prediction with Keras Model</h1>
      <input
        type="number"
        value={inputData}
        onChange={handleInputChange}
        placeholder="Enter input data"
      />
      <button onClick={handlePredict}>Get Prediction</button>

      {prediction && (
        <div>
          <h3>Prediction: {prediction}</h3>
        </div>
      )}
    </div>
  );
};

export default PredictionComponent;
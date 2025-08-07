import os
from flask import Flask
from flask_socketio import SocketIO, emit
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for WebSocket (configure for production later)

# Load the model (make sure to adjust the path for your model)
model = load_model('./action.keras')

# WebSocket event to handle prediction
@socketio.on('predict')
def handle_predict(data):
    try:
        # Get input data (assumed to be a list of values)
        input_data = np.array(data['input'])
        input_data = input_data.reshape(1, 29, 2096)  # Adjust input shape as needed

        # Make the prediction
        prediction = model.predict(input_data)

        # Send back the prediction result
        result = {"prediction": prediction.tolist()}
        emit('prediction_result', result)
    except Exception as e:
        print(f"Error: {e}")
        emit('error', {'message': 'Error processing the input data'})

if __name__ == '__main__':
    # Use relative paths to the SSL certificates in the root folder
    ssl_context = ('../mysite.crt', '../mysite.key')  # Path to ssl.crt and ssl.key in the root folder

    # Run the app with SSL (https)
    socketio.run(app, debug=True, ssl_context=ssl_context, host='0.0.0.0', port=5000)

#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd backend
npm install
npm run start &
BACKEND_PID=$!

# Start the frontend server
echo "Starting frontend server..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

# Start the Ollama service (if applicable)
echo "Starting Ollama service..."
# Command to start Ollama service should be added here
# Example: ollama start &
# OLLAMA_PID=$!

# Wait for all background processes
wait $BACKEND_PID $FRONTEND_PID

# Uncomment the following line if Ollama service is started
# wait $OLLAMA_PID

# Note: Ensure Ollama is installed and the command to start it is correct.

# End of script
echo "All services started successfully."

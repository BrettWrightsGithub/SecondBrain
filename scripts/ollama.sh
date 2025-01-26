#!/bin/bash

# Function to check if Ollama is installed
check_ollama() {
    if ! command -v ollama &> /dev/null; then
        echo "Ollama is not installed. Installing now..."
        curl https://ollama.ai/install.sh | sh
        if [ $? -ne 0 ]; then
            echo "Failed to install Ollama"
            exit 1
        fi
        echo "Ollama installed successfully"
    else
        echo "Ollama is already installed"
    fi
}

# Function to check if Ollama is running
check_ollama_running() {
    if curl -s http://localhost:11434/api/tags &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to start Ollama
start_ollama() {
    if check_ollama_running; then
        echo "Ollama is already running"
    else
        echo "Starting Ollama..."
        ollama serve &> /dev/null &
        
        # Wait for Ollama to start
        max_attempts=30
        attempt=0
        while ! check_ollama_running; do
            attempt=$((attempt + 1))
            if [ $attempt -eq $max_attempts ]; then
                echo "Failed to start Ollama after $max_attempts attempts"
                exit 1
            fi
            echo "Waiting for Ollama to start... (attempt $attempt/$max_attempts)"
            sleep 1
        done
        echo "Ollama is now running"
    fi
}

# Function to stop Ollama
stop_ollama() {
    if check_ollama_running; then
        echo "Stopping Ollama..."
        pkill ollama
        while check_ollama_running; do
            echo "Waiting for Ollama to stop..."
            sleep 1
        done
        echo "Ollama stopped"
    else
        echo "Ollama is not running"
    fi
}

# Function to pull required models
pull_models() {
    local models=("llama2" "mistral" "codellama" "neural-chat")
    
    for model in "${models[@]}"; do
        echo "Checking if $model is available..."
        if ! curl -s "http://localhost:11434/api/tags" | grep -q "\"name\":\"$model\""; then
            echo "Pulling $model..."
            ollama pull $model
            if [ $? -ne 0 ]; then
                echo "Failed to pull $model"
                exit 1
            fi
            echo "$model pulled successfully"
        else
            echo "$model is already available"
        fi
    done
}

# Main script
case "$1" in
    "start")
        check_ollama
        start_ollama
        pull_models
        ;;
    "stop")
        stop_ollama
        ;;
    "restart")
        stop_ollama
        start_ollama
        ;;
    "status")
        if check_ollama_running; then
            echo "Ollama is running"
            echo "Available models:"
            curl -s "http://localhost:11434/api/tags" | jq -r '.models[].name'
        else
            echo "Ollama is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

exit 0

#!/bin/bash

echo "========================================"
echo "Starting HealthCare+ Application"
echo "========================================"
echo ""

# Check if tmux is available
if command -v tmux &> /dev/null; then
    echo "Starting servers in tmux session..."

    # Create a new tmux session
    tmux new-session -d -s healthcare

    # Split the window
    tmux split-window -h

    # Run backend in left pane
    tmux send-keys -t healthcare:0.0 'cd backend && npm run dev' C-m

    # Run frontend in right pane
    tmux send-keys -t healthcare:0.1 'cd frontend && npm run dev' C-m

    # Attach to the session
    echo ""
    echo "Servers started in tmux session 'healthcare'"
    echo "To attach: tmux attach -t healthcare"
    echo "To detach: Ctrl+B then D"
    echo "To close: tmux kill-session -t healthcare"
    echo ""

    tmux attach -t healthcare
else
    # Fallback to background processes
    echo "Starting Backend Server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!

    cd ..

    sleep 3

    echo "Starting Frontend Server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!

    cd ..

    echo ""
    echo "========================================"
    echo "Application Started!"
    echo "========================================"
    echo ""
    echo "Backend running on: http://localhost:5000"
    echo "Frontend running on: http://localhost:3000"
    echo ""
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo ""
    echo "To stop the servers:"
    echo "kill $BACKEND_PID $FRONTEND_PID"
    echo ""

    # Wait for user input
    read -p "Press Enter to stop the servers..."

    # Kill the processes
    kill $BACKEND_PID $FRONTEND_PID
    echo "Servers stopped."
fi

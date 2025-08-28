#!/bin/bash

# Development setup script for Razorpay with ngrok
echo "🚀 Starting BFS Development Environment with Razorpay Integration"
echo "=================================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if ngrok is installed
if ! command_exists ngrok; then
    echo "❌ ngrok is not installed. Installing..."
    npm install -g ngrok
    echo "✅ ngrok installed successfully"
else
    echo "✅ ngrok is already installed"
fi

# Start the backend server in background
echo "🔧 Starting backend server..."
cd server
npm start &
SERVER_PID=$!
echo "✅ Backend server started (PID: $SERVER_PID)"

# Wait a moment for server to start
sleep 3

# Start ngrok tunnel
echo "🌐 Creating ngrok tunnel..."
ngrok http 5000 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 5

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io')

if [ -n "$NGROK_URL" ]; then
    echo "✅ ngrok tunnel created successfully!"
    echo "📡 Public URL: $NGROK_URL"
    echo "🔗 Webhook URL for Razorpay: $NGROK_URL/api/payments/webhook/razorpay"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Copy the webhook URL above"
    echo "2. Go to Razorpay Dashboard → Settings → Webhooks"
    echo "3. Create new webhook with the URL above"
    echo "4. Select events: payment.captured, payment.failed, order.paid"
    echo "5. Generate webhook secret and add to .env file"
    echo ""
    echo "🎯 Your application is now ready for Razorpay testing!"
    echo "💡 Press Ctrl+C to stop all services"
else
    echo "❌ Failed to get ngrok URL. Please check ngrok installation."
fi

# Wait for user to stop
wait

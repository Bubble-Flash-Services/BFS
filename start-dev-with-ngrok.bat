@echo off
echo 🚀 Starting BFS Development Environment with Razorpay Integration
echo ==================================================

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ngrok is not installed. Installing...
    npm install -g ngrok
    echo ✅ ngrok installed successfully
) else (
    echo ✅ ngrok is already installed
)

echo 🔧 Starting backend server...
cd server
start "Backend Server" cmd /k "npm start"

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak >nul

echo 🌐 Creating ngrok tunnel...
start "ngrok Tunnel" cmd /k "ngrok http 5000"

echo ⏳ Waiting for ngrok to start...
timeout /t 8 /nobreak >nul

echo.
echo ✅ Development environment is starting up!
echo.
echo 📋 Next Steps:
echo 1. Check the ngrok window for your public URL (https://xxx.ngrok.io)
echo 2. Copy the webhook URL: https://xxx.ngrok.io/api/payments/webhook/razorpay
echo 3. Go to Razorpay Dashboard → Settings → Webhooks
echo 4. Create new webhook with the URL above
echo 5. Select events: payment.captured, payment.failed, order.paid
echo 6. Generate webhook secret and add to .env file
echo.
echo 🎯 Your application is now ready for Razorpay testing!
echo 💡 Close the terminal windows to stop all services
echo.
pause

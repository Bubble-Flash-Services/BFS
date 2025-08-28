import http from 'http';

// Function to get ngrok public URL
function getNgrokUrl() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4040,
      path: '/api/tunnels',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data);
          const httpsTunnel = tunnels.tunnels.find(tunnel => 
            tunnel.proto === 'https' && tunnel.config.addr === 'localhost:5000'
          );
          
          if (httpsTunnel) {
            resolve(httpsTunnel.public_url);
          } else {
            reject(new Error('No HTTPS tunnel found for localhost:5000'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Main function
async function main() {
  try {
    console.log('🔍 Checking for ngrok tunnel...');
    const ngrokUrl = await getNgrokUrl();
    console.log('✅ ngrok URL found:', ngrokUrl);
    console.log('🔗 Webhook URL for Razorpay:', `${ngrokUrl}/api/payments/webhook/razorpay`);
    console.log('\n📋 Copy the webhook URL above and use it in Razorpay Dashboard');
    console.log('\n🎯 Next Steps:');
    console.log('1. Go to https://dashboard.razorpay.com/app/webhooks');
    console.log('2. Click "Create New Webhook"');
    console.log('3. Paste the webhook URL above');
    console.log('4. Select events: payment.captured, payment.failed, order.paid');
    console.log('5. Generate and save the webhook secret to your .env file');
  } catch (error) {
    console.log('❌ ngrok tunnel not found. Please make sure:');
    console.log('1. ngrok is running: ngrok http 5000');
    console.log('2. ngrok web interface is accessible at http://localhost:4040');
    console.log('3. Your server is running on port 5000');
    console.log('\n� To start ngrok manually: ngrok http 5000');
  }
}

// Run the main function
main();

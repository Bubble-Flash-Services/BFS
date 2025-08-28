// Debug script to test authentication
import { readFileSync } from 'fs';
import { join } from 'path';

// Check if .env file exists and has required variables
const envPath = join(process.cwd(), 'server', '.env');
try {
  const envContent = readFileSync(envPath, 'utf8');
  console.log('✅ .env file found');
  
  const lines = envContent.split('\n');
  const requiredVars = [
    'JWT_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET'
  ];
  
  console.log('\n🔍 Checking environment variables:');
  requiredVars.forEach(varName => {
    const line = lines.find(l => l.startsWith(`${varName}=`));
    if (line) {
      const value = line.split('=')[1];
      if (value && value.trim() !== '') {
        console.log(`✅ ${varName}: Set (${value.length} characters)`);
      } else {
        console.log(`❌ ${varName}: Empty value`);
      }
    } else {
      console.log(`❌ ${varName}: Not found`);
    }
  });
  
} catch (error) {
  console.log('❌ .env file not found at:', envPath);
  console.log('Please create the .env file in the server directory');
}

console.log('\n🔗 Quick debugging tips:');
console.log('1. Check browser localStorage for "token"');
console.log('2. Check Network tab for request headers');
console.log('3. Verify user is properly logged in');
console.log('4. Check if JWT_SECRET matches between login and payment requests');

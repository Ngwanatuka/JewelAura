import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;

if (!YOCO_SECRET_KEY) {
    console.error('❌ YOCO_SECRET_KEY not found in .env');
    process.exit(1);
}

console.log('🔑 Found YOCO_SECRET_KEY:', YOCO_SECRET_KEY.substring(0, 8) + '...');

async function testYocoIntegration() {
    try {
        console.log('🔄 Testing Yoco API connection...');

        // We'll try to create a checkout directly with Yoco API to verify keys
        // This avoids needing the local server running and database setup
        const response = await axios.post(
            'https://payments.yoco.com/api/checkouts',
            {
                amount: 1000, // R10.00
                currency: 'ZAR',
                successUrl: 'http://localhost:3000/success',
                failureUrl: 'http://localhost:3000/failed',
                metadata: {
                    test: 'true'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Yoco API Connection Successful!');
        console.log('📝 Checkout ID:', response.data.id);
        console.log('🔗 Redirect URL:', response.data.redirectUrl);
        console.log('\n✨ The keys are working correctly.');

    } catch (error) {
        console.error('❌ Yoco API Error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testYocoIntegration();

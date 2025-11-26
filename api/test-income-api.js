import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Test the income endpoint
async function testIncomeEndpoint() {
    try {
        const response = await axios.get('http://localhost:5000/api/orders/income', {
            headers: {
                'token': `Bearer ${process.env.ADMIN_TOKEN || 'test-token'}`
            }
        });

        console.log('Income API Response:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error calling income API:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testIncomeEndpoint();

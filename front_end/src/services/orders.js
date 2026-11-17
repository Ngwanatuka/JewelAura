import { userRequest } from "../requestMethods";

// Get user's orders
export const getUserOrders = async (userId, token) => {
    try {
        console.log('Fetching orders for user:', userId);
        const response = await userRequest.get(`/orders/find/${userId}`);
        console.log('Orders received:', response.data.length, 'orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Get order by ID
export const getOrderById = async (orderId, token) => {
    try {
        const response = await userRequest.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Verify payment status
export const verifyPayment = async (orderId) => {
    try {
        const response = await userRequest.get(`/yoco/verify/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

import { userRequest } from "../requestMethods";

// Get user's orders
export const getUserOrders = async (userId, token) => {
    try {
        const response = await userRequest(token).get(`/orders/find/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get order by ID
export const getOrderById = async (orderId, token) => {
    try {
        const response = await userRequest(token).get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

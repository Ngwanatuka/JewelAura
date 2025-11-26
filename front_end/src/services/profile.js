import { userRequest } from "../requestMethods";

// Get user profile
export const getProfile = async (userId, token) => {
    try {
        const response = await userRequest.get(`/users/profile/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update user profile
export const updateProfile = async (userId, profileData, token) => {
    try {
        const response = await userRequest.put(`/users/${userId}`, profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

import { publicRequest, userRequest } from "../requestMethods";

// Add product to favorites
export const addFavorite = async (userId, productId, token) => {
    try {
        const response = await userRequest.post("/favorites", {
            userId,
            productId,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get user's favorites
export const getFavorites = async (userId, token) => {
    try {
        const response = await userRequest.get(`/favorites/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Remove product from favorites
export const removeFavorite = async (userId, productId, token) => {
    try {
        const response = await userRequest.delete(
            `/favorites/${userId}/${productId}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

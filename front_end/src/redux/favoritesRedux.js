import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
    name: "favorites",
    initialState: {
        products: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        // Add to favorites
        addToFavorites: (state, action) => {
            const exists = state.products.find(
                (item) => item.productId === action.payload.productId
            );
            if (!exists) {
                state.products.push(action.payload);
            }
        },
        // Remove from favorites
        removeFromFavorites: (state, action) => {
            state.products = state.products.filter(
                (item) => item.productId !== action.payload
            );
        },
        // Set all favorites (when fetching from server)
        setFavorites: (state, action) => {
            state.products = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        // Clear all favorites
        clearFavorites: (state) => {
            state.products = [];
            state.isFetching = false;
            state.error = false;
        },
        // Fetching states
        fetchFavoritesStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        fetchFavoritesSuccess: (state, action) => {
            state.isFetching = false;
            state.products = action.payload;
        },
        fetchFavoritesFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    addToFavorites,
    removeFromFavorites,
    setFavorites,
    clearFavorites,
    fetchFavoritesStart,
    fetchFavoritesSuccess,
    fetchFavoritesFailure,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

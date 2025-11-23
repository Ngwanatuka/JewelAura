import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const getToken = () => {
    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    return currentUser?.accessToken;
};

const publicRequest = axios.create({
    baseURL: BASE_URL,
});

const userRequest = axios.create({
    baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config) => {
    config.headers.token = `Bearer ${getToken()}`;
    return config;
});

export const getStats = async () => {
    try {
        const res = await userRequest.get("/users/stats");
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getIncome = async () => {
    try {
        const res = await userRequest.get("/orders/income");
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getUsers = async () => {
    try {
        const res = await userRequest.get("/users");
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getOrders = async () => {
    try {
        const res = await userRequest.get("/orders");
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const updateOrder = async (id, status) => {
    try {
        const res = await userRequest.put(`/orders/${id}`, { status });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

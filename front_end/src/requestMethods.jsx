/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const BASE_URL = "/api";

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    return currentUser?.accessToken;
  } catch (err) {
    return null;
  }
};

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.token = `Bearer ${token}`;
  }
  return config;
});

userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      try {
        const persisted = JSON.parse(localStorage.getItem("persist:root") || "{}");
        if (persisted.user) {
          const parsedUser = JSON.parse(persisted.user);
          parsedUser.currentUser = null;
          persisted.user = JSON.stringify(parsedUser);
          localStorage.setItem("persist:root", JSON.stringify(persisted));
        }
      } catch (_) {
        // ignore storage parse errors
      }
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
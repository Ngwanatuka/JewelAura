/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTljMmQxNTkzNGIzYTk2ZTdjMzgzNiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwOTgxOTQwNywiZXhwIjoxNzEwMDc4NjA3fQ.c2Xs_nKtyG4cpZ1cpmQAUl8xpWWyADqpQPEmtULqGak"

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header: {token: `Bearer ${TOKEN}`},
});
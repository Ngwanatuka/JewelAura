/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTllYWEyMzU0ZmVmODlhNzJiNTYyNiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MDk4Mjg3NzksImV4cCI6MTcxMDA4Nzk3OX0.uj0kggFi6xKTVhYlcNGxeChd7hhZnoK7nnf4Q6s0QmM"

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header: {token: `Bearer ${TOKEN}`},
});
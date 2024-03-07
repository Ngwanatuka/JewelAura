/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTkxZWNiZDAyNjlmNDU5MzkxMzM4OCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MDk3NzY2MjMsImV4cCI6MTcxMDAzNTgyM30.vh4Lmr8pTaZGWILDqwTsPnBpRgv5to8UVOvSji1nLcQ"

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header: {token: `Bearer ${TOKEN}`},
});
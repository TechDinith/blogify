import axios from "axios";

export const API_BASE = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const endpoints = {
  blogs: "/blogs",
  comments: "/comments",
  users: "/users",
};

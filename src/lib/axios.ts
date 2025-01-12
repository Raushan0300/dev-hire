// src/lib/axios.ts
import axios from 'axios';
import { clearAuthToken, getAuthToken } from './auth';

const instance = axios.create({
  baseURL: '/api', // Add explicit base URL
});

instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 501) {
      // Perform your function here
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

export default instance;
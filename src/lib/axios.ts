// src/lib/axios.ts
import axios from 'axios';
import { getAuthToken } from './auth';

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

export default instance;
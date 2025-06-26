import router from '@/router';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 100000,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
    if (error.status === 403) {
      localStorage.removeItem('jwtToken')
      router.push('/login')
    }
    return Promise.reject(error);
  }
);

export default api;

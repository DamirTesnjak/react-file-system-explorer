import axios from 'axios';
import { v4 } from 'uuid';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'X-Correlation-Id': v4(),
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export default axiosInstance;

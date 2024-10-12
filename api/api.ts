'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
  baseURL: 'https://feedboard-api-oliveira7-yuris-projects-4bbc1c15.vercel.app', 
});

api.interceptors.request.use(config => {
  const token = cookies().get('token');
  if (token) {
    config.headers['Authorization'] = `Barrer ${token.value}`;
  }
return config;
}, error => {
console.log(error);
return Promise.reject(error);
});

export default api;

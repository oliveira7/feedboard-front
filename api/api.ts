'use server';

import axios from 'axios';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { redirect } from 'next/navigation'; 

const api = axios.create({
  baseURL: 'https://feedboard-back-oliveira7-yuris-projects-4bbc1c15.vercel.app', 
});

api.interceptors.request.use(async config => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
    if (token) {
    config.headers['Authorization'] = `Bearer ${token.value}`;
  }
  return config;
}, error => {
  console.error('Erro na configuração da requisição:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response; 
}, async error => {
  if (error.response?.status === 401 ||  error.message === 'Network Error' || error.message.includes('failed to fetch')) {
    console.error('Erro 401: Não autorizado, redirecionando para login.');

    const cookieStore = await cookies();
    cookieStore.delete('token');

    redirect('/'); 

    return new Promise(() => {}); 
  }
  
  return Promise.reject(error);
});

export default api;

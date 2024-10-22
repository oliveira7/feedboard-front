'use server';

import axios from 'axios';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { redirect } from 'next/navigation'; 

const api = axios.create({
  baseURL: 'https://feedboard-api-oliveira7-yuris-projects-4bbc1c15.vercel.app', 
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
}, error => {
  if (error.response?.status === 401) {
    console.error('Erro 401: Não autorizado, redirecionando para login.');

    (cookies() as unknown as UnsafeUnwrappedCookies).set('token', '', { expires: new Date(0) });

    redirect('/'); 
  }
  
  return Promise.reject(error);
});

export default api;

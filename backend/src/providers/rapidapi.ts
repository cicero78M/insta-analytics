import axios from 'axios';
import { pickProvider } from '../config/provider';

const provider = pickProvider();

export const http = axios.create({
  baseURL: `https://${provider.host}`,
  timeout: 20000,
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
    'X-RapidAPI-Host': provider.host,
  },
});

export async function rq<T = any>(path: string, params?: Record<string, any>) {
  const { data } = await http.get<T>(path, { params });
  return data as T;
}

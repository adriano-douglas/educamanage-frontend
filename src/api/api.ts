/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './axios';
import type { AxiosRequestConfig } from 'axios';

export const apiClient = {

  async get<T = unknown>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    return api.get<T>(url, { ...config, params }).then(response => response.data);
  },

  async post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return api.post<T>(url, data, config).then(response => response.data);
  },

  async put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return api.put<T>(url, data, config).then(response => response.data);
  },

  async patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return api.patch<T>(url, data, config).then(response => response.data);
  },

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.delete<T>(url, config).then(response => response.data);
  },

};

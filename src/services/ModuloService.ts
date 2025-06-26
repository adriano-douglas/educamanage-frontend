import type { ApiResponse } from '@/types/api-response/ApiResponse';
import { apiClient } from '../api/api'
import type { Curso } from '@/types/curso/types'

export const buscarModuloPorId = (idModulo: number): Promise<Curso> => {
  return apiClient.get('modulo/' + idModulo);
}

export const cadastrarModulo = (formData: FormData): Promise<ApiResponse> => {
  return apiClient.post('modulo', formData);
}

export const excluirModulo = (idModulo: number): Promise<ApiResponse> => {
  return apiClient.delete('modulo/' + idModulo);
}

export const editarModulo = (idModulo: number, formData: FormData): Promise<ApiResponse> => {
  return apiClient.put('modulo/' + idModulo, formData);
}

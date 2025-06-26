import type { ApiResponse } from '@/types/api-response/ApiResponse';
import { apiClient } from '../api/api'
import type { Curso } from '@/types/curso/types'

export const buscarAulaPorId = (idAula: number): Promise<Curso> => {
  return apiClient.get('aula/' + idAula);
}

export const cadastrarAula = (formData: unknown): Promise<ApiResponse> => {
  return apiClient.post('aula', formData);
}

export const cadastrarAulaComUpload = (formData: unknown): Promise<ApiResponse> => {
  return apiClient.post('aula/com-upload', formData);
}

export const excluirAula = (idAula: number): Promise<ApiResponse> => {
  return apiClient.delete('aula/' + idAula);
}

export const editarAula = (idAula: number, formData: unknown): Promise<ApiResponse> => {
  return apiClient.put('aula/' + idAula, formData);
}

export const editarAulaComUpload = (idAula: number, formData: unknown): Promise<ApiResponse> => {
  return apiClient.put('aula/com-upload/' + idAula, formData);
}

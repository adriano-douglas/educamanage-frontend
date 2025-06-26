import type { ApiResponse } from '@/types/api-response/ApiResponse';
import { apiClient } from '../api/api'
import type { CategoriaCurso, Curso } from '@/types/curso/types'

export const buscarPorId = (idCurso: number): Promise<Curso> => {
  return apiClient.get('curso/' + idCurso);
}

export const buscarTodos = (): Promise<Curso[]> => {
  return apiClient.get('curso');
}

export const cadastrar = (formData: FormData): Promise<ApiResponse> => {
  return apiClient.post('curso', formData);
}

export const editarCurso = (idCurso: number, formData: FormData): Promise<ApiResponse> => {
  return apiClient.put('curso/' + idCurso, formData);
}

export const excluir = (idCurso: number): Promise<ApiResponse> => {
  return apiClient.delete('curso/' + idCurso);
}

export const buscarCategorias = (): Promise<CategoriaCurso[]> => {
  return apiClient.get('curso/categorias');
}

export const toggleStatusCurso = (idCurso: number): Promise<ApiResponse> => {
  return apiClient.put(`curso/${idCurso}/toggle-status`);
}

export const publicarCurso = (idCurso: number): Promise<ApiResponse> => {
  return apiClient.put(`curso/${idCurso}/publicar`);
}

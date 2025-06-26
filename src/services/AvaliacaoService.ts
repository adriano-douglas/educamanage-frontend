import type { ApiResponse } from '@/types/api-response/ApiResponse';
import { apiClient } from '../api/api'
import type { Avaliacao, TipoAvaliacao } from '@/types/curso/types'

export const buscarAvaliacaoPorId = (idAvaliacao: number): Promise<Avaliacao> => {
  return apiClient.get('avaliacao/' + idAvaliacao);
}

export const buscarTiposAvaliacao = (idCurso: number): Promise<{ titulo: string, tipo: TipoAvaliacao, idModulo: number | null }[]> => {
  return apiClient.get('avaliacao/tipos-disponiveis/' + idCurso);
}

export const cadastrarAvaliacao = (formData: unknown): Promise<ApiResponse> => {
  return apiClient.post('avaliacao', formData);
}

export const excluirAvaliacao = (idAvaliacao: number): Promise<ApiResponse> => {
  return apiClient.delete('avaliacao/' + idAvaliacao);
}

export const editarAvaliacao = (idAvaliacao: number, formData: unknown): Promise<ApiResponse> => {
  return apiClient.put('avaliacao/' + idAvaliacao, formData);
}

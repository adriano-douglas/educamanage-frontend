import type { ApiResponse } from '@/types/api-response/ApiResponse';
import { apiClient } from '../api/api'
import type { Pergunta } from '@/types/curso/types'

export const buscarPerguntaPorId = (idPergunta: number): Promise<Pergunta> => {
  return apiClient.get('pergunta/' + idPergunta);
}

export const cadastrarPergunta = (formData: unknown): Promise<ApiResponse> => {
  return apiClient.post('pergunta', formData);
}

export const cadastrarPerguntaRetornoAvaliacao = (formData: unknown): Promise<ApiResponse> => {
  return apiClient.post('pergunta/retorno-avaliacao', formData);
}

export const excluirPergunta = (idPergunta: number): Promise<ApiResponse> => {
  return apiClient.delete('pergunta/' + idPergunta);
}

export const editarPergunta = (idPergunta: number, formData: unknown): Promise<ApiResponse> => {
  return apiClient.put('pergunta/' + idPergunta, formData);
}

export const editarPerguntaRetornoAvaliacao = (idPergunta: number, formData: unknown): Promise<ApiResponse> => {
  return apiClient.put('pergunta/' + idPergunta + '/retorno-avaliacao', formData);
}

import type { ApiResponse } from '@/types/api-response/ApiResponse';
import { apiClient } from '../api/api'
import type { DadosRankingResponse, Parametros, RankingUsuarioResponse } from '@/types/parametro-gamificacao/types';

export const editarAtual = (payload: unknown): Promise<ApiResponse> => {
  return apiClient.put('/parametro-gamificacao/editar-atual', payload);
}

export const buscarParametrosAtuais = (): Promise<Parametros> => {
  return apiClient.get('/parametro-gamificacao/atual');
}

export const listarRanking = (): Promise<RankingUsuarioResponse[]> => {
  return apiClient.get('/parametro-gamificacao/ranking');
}

export const dadosRanking = (): Promise<DadosRankingResponse> => {
  return apiClient.get('/parametro-gamificacao/ranking/dados');
}

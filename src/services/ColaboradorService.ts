import type { DadosColaboradorResponse } from '@/types/colaborador/DadosColaboradorResponse';
import { apiClient } from '../api/api';
import type { ApiResponse } from '@/types/api-response/ApiResponse';

export const cadastrarIndividual = (formData: FormData): Promise<ApiResponse> => {
  return apiClient.post('/colaborador', formData);
}

export const cadastrarColetivo = (formData: FormData): Promise<ApiResponse> => {
  return apiClient.post('/colaborador/coletivo', formData);
}

export const filtrarColaboradores = (params: string): Promise<unknown> => {
  return apiClient.get('/colaborador/filtro' + params);
}

export const buscarPorId = (idColaborador: number): Promise<DadosColaboradorResponse> => {
  return apiClient.get('colaborador/dados/' + idColaborador);
}

export const editar = (idColaborador: number, formData: FormData): Promise<ApiResponse> => {
  return apiClient.put('colaborador/' + idColaborador, formData);
}

export const excluir = (idColaborador: number): Promise<ApiResponse> => {
  return apiClient.delete('colaborador/' + idColaborador);
}

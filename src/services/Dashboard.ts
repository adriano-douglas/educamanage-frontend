import { apiClient } from '@/api/api'
import type {
  ColaboradorDetalheResponse,
  ColaboradorTabelaResponse,
  CursoDetalheResponse,
  CursoTabelaResponse,
  DashboardStatsResponse,
  StatusMatriculaResponse,
  TaxaConclusaoResponse,
} from '@/types/dashboard/types'

const BASE = 'dashboard'

export function obterEstatisticas (): Promise<DashboardStatsResponse> {
  return apiClient.get(`${BASE}/estatisticas`)
}

export function obterTaxaConclusao (): Promise<TaxaConclusaoResponse> {
  return apiClient.get(`${BASE}/taxa-conclusao`)
}

export function obterStatusMatriculas (): Promise<StatusMatriculaResponse> {
  return apiClient.get(`${BASE}/status-matriculas`)
}

export function listarColaboradoresTabela (): Promise<ColaboradorTabelaResponse[]> {
  return apiClient.get(`${BASE}/colaboradores-tabela`)
}

export function listarCursosTabela (): Promise<CursoTabelaResponse[]> {
  return apiClient.get(`${BASE}/cursos-tabela`)
}

export function obterDetalheColaborador (idColaborador: number): Promise<ColaboradorDetalheResponse> {
  return apiClient.get(`${BASE}/colaborador/${idColaborador}/detalhe`)
}

export function obterDetalheCurso (idCurso: number): Promise<CursoDetalheResponse> {
  return apiClient.get(`${BASE}/curso/${idCurso}/detalhe`)
}

export function analisarFeedbacks (comentarios: { comentarios: string[] }): Promise<string> {
  return apiClient.post(`${BASE}/curso/comentarios/analise-ia`, comentarios)
}

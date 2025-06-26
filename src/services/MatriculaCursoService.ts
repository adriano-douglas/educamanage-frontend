import type { AvaliacaoFull, CursoMatricula, CursosPublicadosMatricula, MeusCursos, ProgressoMatricula, ResultadoTentativa } from '@/types/matricula-curso/types';
import { apiClient } from '../api/api'
import type { ApiResponse } from '@/types/api-response/ApiResponse';

export const buscarTodosCursosPublicados = (): Promise<CursosPublicadosMatricula[]> => {
  return apiClient.get('matricula-curso/publicados');
}

export const realizarMatriculaCurso = (payload: unknown): Promise<ApiResponse> => {
  return apiClient.post('matricula-curso/matricular', payload);
}

export const buscarPorId = (idMatriculaCurso: number): Promise<CursoMatricula> => {
  return apiClient.get('matricula-curso/detalhes/' + idMatriculaCurso);
}

export const buscarProgressoAtual = (idMatriculaCurso: number): Promise<ProgressoMatricula> => {
  return apiClient.get('matricula-curso/progresso-atual/' + idMatriculaCurso);
}

export const buscarProgressoPorAula = (idMatriculaCurso: number, idAula: number): Promise<ProgressoMatricula> => {
  return apiClient.get(`matricula-curso/${idMatriculaCurso}/progresso/aula/${idAula}`);
}

export const registrarProgresso = (idMatriculaCurso: number, payload: unknown): Promise<ProgressoMatricula> => {
  return apiClient.post('matricula-curso/' + idMatriculaCurso + '/registar-progresso', payload);
}

export const carregarAvaliacao = (idMatriculaCurso: number, idAvaliacao: number): Promise<AvaliacaoFull> => {
  return apiClient.get(`matriculas/${idMatriculaCurso}/avaliacoes/${idAvaliacao}`);
}

export const submeterAvaliacao = (idMatriculaCurso: number, idAvaliacao: number, respostas: unknown): Promise<ResultadoTentativa> => {
  return apiClient.post(`matriculas/${idMatriculaCurso}/avaliacoes/${idAvaliacao}/submeter`, { respostas });
}

export const buscarUltimaTentativa = (idMatriculaCurso: number, idAvaliacao: number): Promise<ResultadoTentativa> => {
  return apiClient.get(`/matriculas/${idMatriculaCurso}/avaliacoes/${idAvaliacao}/ultima-tentativa`);
}

export const listarMeusCursos = (): Promise<MeusCursos[]> => {
  return apiClient.get('/matricula-curso/meus-cursos');
}

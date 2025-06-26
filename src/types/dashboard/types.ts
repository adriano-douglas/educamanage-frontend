export interface DashboardStatsResponse {
  totalColaboradores: number
  totalCursos: number
  totalCertificados: number
  totalMatriculas: number
}

export interface TaxaConclusaoResponse {
  taxaConclusao: number
}

export interface StatusMatriculaResponse {
  concluido: number
  emAndamento: number
  naoIniciado: number
}

export interface ColaboradorTabelaResponse {
  id: number
  nome: string
  departamento: string
  cargo: string
  totalMatriculas: number
}

export interface CursoTabelaResponse {
  id: number
  titulo: string
  categoria: string
  totalMatriculas: number
}

export type StatusMatriculaTipo =
  | 'MATRICULADO'
  | 'EM_ANDAMENTO'
  | 'APROVADO'
  | 'REPROVADO';

export interface CursoMatricula {
  titulo: string;
  status: StatusMatriculaTipo;
}

export interface AvaliacaoColaborador {
  curso: string;
  texto: string;
}

export interface ColaboradorDetalheResponse {
  cursos: CursoMatricula[];
  avaliacoes: AvaliacaoColaborador[];
}

export interface ColabStatus {
  nome: string;
  status: StatusMatriculaTipo;
}

export interface AvaliacaoCurso {
  colaborador: string;
  texto: string;
}

export interface CursoDetalheResponse {
  colaboradores: ColabStatus[];
  avaliacoes: AvaliacaoCurso[];
}

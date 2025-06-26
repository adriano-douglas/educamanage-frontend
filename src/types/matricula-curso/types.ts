export type StatusMatriculaCurso =
  | 'PUBLICADO'
  | 'MATRICULADO'
  | 'EM_ANDAMENTO'
  | 'APROVADO'
  | 'REPROVADO'

export interface CursosPublicadosMatricula {
  idCurso: number
  idMatriculaCurso: number | null
  imagemCoverUrl: string
  titulo: string
  descricao: string
  categoria: string
  status: StatusMatriculaCurso
}

export interface MaterialMatricula {
  idMaterial: number
  titulo: string
  link: string
}

export interface AulaMatricula {
  id: number
  idAula: number
  titulo: string
  descricao: string
  videoUrl: string
  flAcessoLiberado: boolean
  flFinalizada: boolean
  materiais: MaterialMatricula[]
}

export interface ModuloMatricula {
  idModulo: number
  titulo: string
  aulas: AulaMatricula[]
  status: 'FINALIZADO' | 'LIBERADO' | 'BLOQUEADO'

  avaliacao?: {
    flAprovada: boolean
    idAvaliacao: number
    flAcessoLiberado: boolean
  }
}

export interface CursoMatricula {
  idMatriculaCurso: number
  idCurso: number
  titulo: string
  descricao: string
  imagemCoverUrl: string
  statusMatricula: StatusMatriculaCurso
  certificadoDisponivel: boolean
  certificadoUrl?: string
  avaliacaoFinal: {
    idAvaliacaoFinal: number,
    flAcessoLiberado: boolean
    aprovada: boolean
  },
  modulos: ModuloMatricula[]
}

export interface ProgressoMatricula {
  idProgressoMatricula: number
  idMatriculaCurso: number
  idAulaAnterior: number | null
  idAulaAtual: number | null
  idAulaProxima: number | null
  flEhProgressoAtual: boolean
}

export interface AvaliacaoFull {
  idAvaliacao: number
  titulo: string
  pontuacaoMinima: number
  tentativasRestantes: number
  perguntas: {
    idPergunta: number
    enunciado: string
    alternativas: {
      idAlternativa: number
      texto: string
    }[]
  }[]
}

export interface ResultadoQuestao {
  idPergunta: number
  idAlternativaMarcada: number
  idAlternativaCorreta: number | null
  correta: boolean
}

export interface ResultadoTentativa {
  numeroTentativa: number
  aprovado: boolean
  percentualAcertos: number
  tentativasRestantes: number
  questoes: ResultadoQuestao[]
  tipoAvaliacao: 'FINAL' | 'MODULO'
}

export interface MeusCursos {
  id: number
  nome: string
  tipo: 'CURSO'
  status: 'concluido' | 'em_andamento'
  percentual?: number
  linkCertificado?: string
  dataUltimaInteracao: string
}

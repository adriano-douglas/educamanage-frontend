export interface Alternativa {
  id: number
  texto: string
  flCorreta: boolean
}

export interface Pergunta {
  id: number
  enunciado: string
  alternativas: Alternativa[]
}

export type TipoAvaliacao = 'final' | 'modulo'

export interface Avaliacao {
  id: number
  tipo: TipoAvaliacao
  moduloId?: number
  idModulo?: number
  titulo: string
  pontuacaoMinima: number
  perguntas: Pergunta[]
  nrTentativas: number
}


export interface Material {
  id: number
  titulo: string
  arquivo?: File
}

export interface Aula {
  id: number
  titulo: string
  descricao: string
  videoUrl: string
  materiais: Material[]
}

export interface Modulo {
  id: number
  titulo: string
  aulas: Aula[]
}

export interface Curso {
  id: number
  titulo: string
  descricao: string
  imagemCover: File | null
  imagemCoverUrl: string | null
  flPublicado: boolean
  flInativo: boolean
  modulos: Modulo[]
  avaliacaoFinal: Avaliacao
  avaliacoes: Avaliacao[]
  categoriaId: number
  diasParaConcluir: number
  cargaHoraria: number
  categoria: string
}

export interface CategoriaCurso {
  id: number
  descricao: string
}

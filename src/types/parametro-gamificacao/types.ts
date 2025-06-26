export interface Parametros {
  id?: number
  finalizarAula: number
  finalizarModulo: number
  acertarQuestaoModulo: number
  acertarQuestaoFinal: number
  enviarFeedback: number
  aprovarModulo: number
  aprovarFinal: number
  reprovar: number
  completarNoPrazo: number
}

export interface Campo {
  modelo: keyof Parametros
  label: string
  descricao: string
  step?: number
}

export interface DadosRankingResponse {
  posicaoUsuario: number
  pontuacaoAtual: number
  linkPerfil: string
}

export interface RankingUsuarioResponse {
  id: number
  nome: string
  avatar?: string
  pontos: number
}

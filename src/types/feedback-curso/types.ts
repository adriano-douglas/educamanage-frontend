export interface FeedbackCursoResponse {
  id: number
  nome: string
  avatar?: string
  texto: string
  data: string
  anonimo?: boolean
}

export interface FeedbackCursoRequest {
  anonimo: boolean;
  texto: string;
}

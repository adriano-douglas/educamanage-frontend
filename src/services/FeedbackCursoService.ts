import { apiClient } from '../api/api'
import type { FeedbackCursoRequest, FeedbackCursoResponse } from '@/types/feedback-curso/types';

export const listarFedbacksPorIdCurso = (idCurso: number): Promise<FeedbackCursoResponse[]> => {
  return apiClient.get('feedback-curso/' + idCurso);
}

export const criarFeedback = (idCurso: number, payload: FeedbackCursoRequest): Promise<FeedbackCursoResponse> => {
  return apiClient.post('feedback-curso/' + idCurso, payload);
}

import type { CertificadoResponse } from '@/types/certificado/types';
import { apiClient } from '../api/api'

export const validarCertificado = (idMatriculaCurso: number, token: string): Promise<CertificadoResponse> => {
  return apiClient.get(`certificado/matriculas/${idMatriculaCurso}?t=${token}`);
}

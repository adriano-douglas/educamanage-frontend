import type { SetorResponse } from '@/types/setor/SetorResponse';
import { apiClient } from '../api/api';

export const buscarTodosSetores = (): Promise<SetorResponse[]> => {
  return apiClient.get('setor');
}

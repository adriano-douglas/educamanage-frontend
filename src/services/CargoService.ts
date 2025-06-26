import { apiClient } from '../api/api';
import type { CargoResponse } from '@/types/cargo/CargoResponse';

export const buscarTodosCargos = (): Promise<CargoResponse[]> => {
  return apiClient.get('cargo');
}

import type { Usuario } from '@/store/UsuarioStore';
import { apiClient } from '../api/api'

export const buscarUsuarioAutenticado = (): Promise<Usuario> => {
  return apiClient.get('usuario/autenticado');
}

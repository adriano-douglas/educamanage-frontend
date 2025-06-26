import { apiClient } from '../api/api'
import type { SolicitarRedefSenhaRequest } from '@/types/auth/SolicitarRedefSenhaRequest'
import type { RedefinirSenhaComTokenRequest } from '@/types/auth/RedefinirSenhaComTokenRequest'
import type { LoginRequest } from '../types/auth/LoginRequest'
import type { AuthResponse } from '../types/auth/AuthResponse'
import type { ConfirmarCodigoRequest } from '../types/auth/ConfirmarCodigoRequest'
import type { RedefinirSenhaRequest } from '../types/auth/RedefinirSenhaRequest'

export const AuthService = {
  login (data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/login', data)
  },

  validarCodigo (data: ConfirmarCodigoRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/validar-codigo', data)
  },

  redefinirSenha (data: RedefinirSenhaRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/redefinir-senha', data)
  },

  solicitarRedefinicaoSenha (data: SolicitarRedefSenhaRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/solicitar-redefinicao-senha', data)
  },

  redefinirSenhaComToken (data: RedefinirSenhaComTokenRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/redefinir-senha-token', data)
  },
}

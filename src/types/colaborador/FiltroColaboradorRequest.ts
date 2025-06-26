export interface FiltroColaboradorRequest {
  nome: string | null,
  email: string | null,
  cpf: string | null,
  dataNascimento: Date | null,
  celular: string | null,
  matricula: string | null,
  dataAdmissao: Date | null,
  emailCorporativo: string | null,
  setor: string | null,
  cargo: string | null,
  funcao: string | null,
  roles: string[] | null
}

export interface DadosColaboradorResponse {
  idUsuario: number
  idColaborador: number
  nome: string
  email: string
  cpf: string
  dataNascimento: string
  celular: string
  matricula: string
  dataAdmissao: string
  emailCorporativo: string
  setor: string
  cargo: string
  funcao: string | null
  roles: string[]
}

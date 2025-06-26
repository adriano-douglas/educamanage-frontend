export interface CadastroEdicaoColaboradorIndRequest {
  nome: string,
  email: string,
  cpf: string,
  dataNascimento: Date,
  celular: string,
  fotoPerfil: File | null,
  matricula: string,
  dataAdmissao: Date,
  emailCorporativo: string,
  setor: string,
  cargo: string,
  funcao: string | null,
  roles: string[]
}

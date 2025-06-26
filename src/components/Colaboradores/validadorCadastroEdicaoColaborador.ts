import { z } from 'zod'
import { cpf as cpfValidador } from 'cpf-cnpj-validator'

const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

export const schemaCadastroEdicaoIndividual = z.object({
  nome: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório').max(30, 'O nome deve ter no máximo 30 caracteres')
  ),

  email: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório').email('E-mail inválido').max(50, 'O email deve ter no máximo 50 caracteres')
  ),

  cpf: z.preprocess(
    val => (val === null || val === undefined ? '' : String(val).trim()),
    z
      .string()
      .nonempty('Campo obrigatório')
      .transform(val => val.replace(/\D/g, ''))
      .refine(
        val => cpfValidador.isValid(val),
        'CPF inválido'
      )
  ),

  dataNascimento: z.preprocess(
    val => val === null ? undefined : val,
    z.date({
      required_error: 'Campo obrigatório',
      invalid_type_error: 'Data inválida',
    })
      .min(new Date(1900, 0, 1), { message: 'Data muito antiga' })
      .max(new Date(), { message: 'A data não pode ser no futuro' })
  ),

  celular: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório')
      .refine(
        val => !val || telefoneRegex.test(val),
        'Telefone deve estar no formato (99) 99999-9999'
      )
  ),

  fotoPerfil: z.any()
    .nullable()
    .refine(file => {
      return file === null || file === undefined || (file instanceof File && file.type?.startsWith('image/'));
    }, {
      message: 'O arquivo precisa ser uma imagem',
    }),

  matricula: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório').max(10, 'A matrícula deve ter no máximo 10 caracteres')
  ),

  dataAdmissao: z.preprocess(
    val => val === null ? undefined : val,
    z.date({
      required_error: 'Campo obrigatório',
      invalid_type_error: 'Data inválida',
    })
      .min(new Date(1900, 0, 1), { message: 'Data muito antiga' })
      .max(new Date(), { message: 'A data não pode ser no futuro' })
  ),

  emailCorporativo: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório').email('E-mail inválido').max(50, 'O email deve ter no máximo 50 caracteres')
  ),

  setor: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório').max(30, 'O setor deve ter no máximo 30 caracteres')
  ),

  cargo: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório').max(30, 'O cargo deve ter no máximo 30 caracteres')
  ),

  funcao: z.string().max(100, 'A função deve ter no máximo 100 caracteres').nullable(),

  roles: z.preprocess(
    val => val === null || val === undefined ? [] : val,
    z.array(z.string()).min(1, { message: 'Campo obrigatório' })
  ),

}).superRefine((data, ctx) => {
  if (data.dataAdmissao <= data.dataNascimento) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A data de admissão deve ser posterior à data de nascimento',
      path: ['dataAdmissao'],
    });
  }
});

export const schemaCadastroColetivo = z.object({
  arquivoCsv: z
    .instanceof(File, { message: 'Campo obrigatório' })
    .refine(
      file =>
        file.type === 'text/csv' || /\.csv$/i.test(file.name),
      { message: 'O arquivo deve ter formato CSV' }
    ),
});

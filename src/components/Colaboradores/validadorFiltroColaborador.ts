import { z } from 'zod'

const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

export const schemaFiltroColaborador = z.object({
  nome: z.string().max(30, 'O nome deve ter no máximo 30 caracteres').nullable(),

  email: z.string().email('E-mail inválido').max(50, 'O email deve ter no máximo 50 caracteres').nullable(),

  cpf: z.string().nullable(),

  dataNascimento: z.date({
    required_error: 'Campo obrigatório',
    invalid_type_error: 'Data inválida',
  })
    .min(new Date(1900, 0, 1), { message: 'Data muito antiga' })
    .max(new Date(), { message: 'A data não pode ser no futuro' })
    .nullable(),

  celular: z.string()
    .refine(
      val => !val || telefoneRegex.test(val),
      'Telefone deve estar no formato (99) 99999-9999'
    )
    .nullable(),

  matricula: z.string().max(10, 'A matrícula deve ter no máximo 10 caracteres').nullable(),

  dataAdmissao: z.date({
    required_error: 'Campo obrigatório',
    invalid_type_error: 'Data inválida',
  })
    .min(new Date(1900, 0, 1), { message: 'Data muito antiga' })
    .max(new Date(), { message: 'A data não pode ser no futuro' })
    .nullable(),

  emailCorporativo: z.string().email('E-mail inválido').max(50, 'O email deve ter no máximo 50 caracteres').nullable(),

  setor: z.string().max(30, 'O setor deve ter no máximo 30 caracteres').nullable(),

  cargo: z.string().max(30, 'O cargo deve ter no máximo 30 caracteres').nullable(),

  funcao: z.string().max(100, 'A função deve ter no máximo 100 caracteres').nullable(),

  roles: z.array(z.string()).nullable(),

}).superRefine((data, ctx) => {
  if (data.dataAdmissao && data.dataNascimento && data.dataAdmissao <= data.dataNascimento) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A data de admissão deve ser posterior à data de nascimento',
      path: ['dataAdmissao'],
    });
  }
});

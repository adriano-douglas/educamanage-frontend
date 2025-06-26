import { z } from 'zod'

export const schemaEtapaDetalhesNovoCurso = z.object({
  titulo: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z.string()
      .nonempty('Campo obrigatório')
      .max(30, 'O título deve ter no máximo 30 caracteres'),
  ),

  imagemCover: z.preprocess(
    v => (v instanceof FileList ? v.item(0) : v),
    z
      .instanceof(File, { message: 'Campo obrigatório' })
      .refine(
        file => file.type.startsWith('image/'),
        { message: 'O arquivo precisa ser uma imagem' },
      ),
  ),

  descricao: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z.string()
      .nonempty('Campo obrigatório')
      .max(150, 'A descrição deve ter no máximo 150 caracteres'),
  ),

  categoriaId: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z
      .number({ invalid_type_error: 'Campo obrigatório' })
      .int('Selecione uma categoria')
      .positive('Selecione uma categoria'),
  ),

  diasParaConcluir: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z
      .number({ invalid_type_error: 'Campo obrigatório' })
      .min(1, 'Valor mínimo: 1')
      .max(100, 'Valor máximo: 100'),
  ),

  cargaHoraria: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z
      .number({ invalid_type_error: 'Campo obrigatório' })
      .min(1, 'Valor mínimo: 1')
      .max(999, 'Valor máximo: 999'),
  ),
})

export const schemaEtapaDetalhesEdicaoCurso = z.object({
  titulo: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z.string()
      .nonempty('Campo obrigatório')
      .max(30, 'O título deve ter no máximo 30 caracteres'),
  ),

  imagemCover: z.preprocess(
    v => (v instanceof FileList ? v.item(0) : v),
    z
      .instanceof(File)
      .refine(
        file => file.type.startsWith('image/'),
        { message: 'O arquivo precisa ser uma imagem' }
      )
      .nullable()
      .optional()
  ),

  descricao: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z.string()
      .nonempty('Campo obrigatório')
      .max(150, 'A descrição deve ter no máximo 150 caracteres'),
  ),

  categoriaId: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z
      .number({ invalid_type_error: 'Campo obrigatório' })
      .int('Selecione uma categoria')
      .positive('Selecione uma categoria'),
  ),

  diasParaConcluir: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z
      .number({ invalid_type_error: 'Campo obrigatório' })
      .min(1, 'Valor mínimo: 1')
      .max(100, 'Valor máximo: 100'),
  ),

  cargaHoraria: z.preprocess(
    val => (val === null || val === undefined ? '' : val),
    z
      .number({ invalid_type_error: 'Campo obrigatório' })
      .min(1, 'Valor mínimo: 1')
      .max(999, 'Valor máximo: 999'),
  ),
})

export const schemaEtapaModulos = z.object({

  titulo: z.preprocess(
    val => val === null || val === undefined ? '' : val,
    z.string().nonempty('Campo obrigatório').max(30, 'O título deve ter no máximo 30 caracteres')
  ),

});

export const schemaFileCsv = z.object({

  arquivoCsv: z
    .instanceof(File, { message: 'Campo obrigatório' })
    .refine(
      file =>
        file.type === 'text/csv' || /\.csv$/i.test(file.name),
      { message: 'O arquivo deve ter formato CSV' }
    ),

});

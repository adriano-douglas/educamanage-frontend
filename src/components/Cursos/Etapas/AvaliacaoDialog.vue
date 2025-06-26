<template>
  <v-dialog
    v-model="openLocal"
    max-width="500"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="white" elevation="1" flat>
        <v-toolbar-title>
          {{ avaliacao ? 'Editar Avaliação' : 'Nova Avaliação' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form @submit.prevent="salvar">
          <v-select
            v-model="tipoSelecionado"
            dense
            :error-messages="errors.tipoSelecionado"
            flat
            item-title="titulo"
            :items="tipos"
            label="Tipo de Avaliação"
            return-object
          />

          <v-number-input
            v-model="pontuacaoMinima"
            dense
            :error-messages="errors.pontuacaoMinima"
            flat
            label="Pontuação mínima (%)"
            :max="100"
            :min="50"
            :step="5"
          />

          <v-number-input
            v-model="nrTentativas"
            dense
            :disabled="tentativasInfinitas"
            :error-messages="errors.nrTentativas"
            flat
            label="Número máximo de tentativas"
            :min="1"
            :step="1"
          />

          <v-checkbox
            v-model="tentativasInfinitas"
            dense
            :error-messages="errors.tentativasInfinitas"
            label="Tentativas infinitas"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="handleClose">Cancelar</v-btn>
        <v-btn
          color="primary"
          :disabled="loading"
          :loading="loading"
          @click="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { configure, useField, useForm } from 'vee-validate'
  import { z } from 'zod'
  import { toTypedSchema } from '@vee-validate/zod'
  import type { Avaliacao, TipoAvaliacao } from '@/types/curso/types'
  import { useCursoStore } from '@/store/CursoStore'
  import {
    buscarAvaliacaoPorId,
    buscarTiposAvaliacao,
    cadastrarAvaliacao,
    editarAvaliacao,
  } from '@/services/AvaliacaoService'

  const openLocal = defineModel<boolean>()
  const emit = defineEmits<{
    (e: 'cadastro-avaliacao-finalizado', avaliacao: Avaliacao): void,
    (e: 'edicao-avaliacao-finalizado', avaliacao: Avaliacao): void,
  }>()
  const props = defineProps<{ idAvaliacao: number | null }>()

  const store = useCursoStore()
  const avaliacao = ref<Avaliacao | null>(null)
  const loading = ref(false)

  interface TipoBackend {
    titulo: string
    tipo: TipoAvaliacao
    idModulo: number | null
  }

  const tipos = ref<TipoBackend[]>([])
  const tipoSelecionado = ref<TipoBackend | undefined>(undefined)
  const pontuacaoMinima = ref<number>(70)

  const nrTentativas = ref<number | null>(null)
  const tentativasInfinitas = ref<boolean>(false)

  configure({ validateOnInput: true })
  const schema = z
    .object({
      tipoSelecionado: z
        .object({
          titulo: z.string(),
          tipo: z.enum(['modulo','final']),
          idModulo: z.number().nullable(),
        })
        .optional()
        .refine(v => v !== undefined, 'Selecione o tipo de avaliação'),
      pontuacaoMinima: z
        .coerce.number()
        .min(50, { message: 'A pontuação mínima deve ser ao menos 50 %' })
        .max(100, { message: 'A pontuação máxima é 100 %' }),
      nrTentativas: z
        .preprocess(v => v === '' ? null : v, z.number().int().min(1))
        .nullable(),
      tentativasInfinitas: z.boolean(),
    })
    .refine(
      data =>
        data.tentativasInfinitas === true ||
        (data.nrTentativas !== null && data.nrTentativas >= 1),
      {
        message: 'Informe o número de tentativas ou marque "infinitas"',
        path: ['nrTentativas'],
      }
    )

  const { handleSubmit, errors, resetForm, setFieldValue } = useForm({
    validationSchema: toTypedSchema(schema),
    initialValues: {
      tipoSelecionado: undefined,
      pontuacaoMinima: 70,
      nrTentativas: null,
      tentativasInfinitas: false,
    },
  })

  useField<TipoBackend | undefined>('tipoSelecionado')
  useField<number>('pontuacaoMinima')
  useField<number | null>('nrTentativas')
  useField<boolean>('tentativasInfinitas')

  watch(tipoSelecionado, v => setFieldValue('tipoSelecionado', v))
  watch(pontuacaoMinima, v => setFieldValue('pontuacaoMinima', v))
  watch(nrTentativas, v => setFieldValue('nrTentativas', v))
  watch(tentativasInfinitas, v => setFieldValue('tentativasInfinitas', v))

  watch(openLocal, async opened => {
    if (!opened) return

    loading.value = true
    try {
      tipos.value = await buscarTiposAvaliacao(store.cursoSelecionado!.id)

      if (props.idAvaliacao === null) {
        avaliacao.value = null
        resetForm({
          values: {
            tipoSelecionado: undefined,
            pontuacaoMinima: 70,
            nrTentativas: null,
            tentativasInfinitas: false,
          },
        })
        tipoSelecionado.value = undefined
        pontuacaoMinima.value = 70
        nrTentativas.value = null
        tentativasInfinitas.value = false
      } else {
        const resp = await buscarAvaliacaoPorId(props.idAvaliacao)
        avaliacao.value = resp

        tipos.value = [
          { titulo: resp.titulo, tipo: resp.tipo, idModulo: resp.idModulo ?? null },
          ...tipos.value,
        ]

        tipoSelecionado.value = tipos.value.find(t => t.tipo === resp.tipo)
        pontuacaoMinima.value = resp.pontuacaoMinima
        nrTentativas.value = resp.nrTentativas
        tentativasInfinitas.value = resp.nrTentativas === null

        resetForm({
          values: {
            tipoSelecionado: tipoSelecionado.value,
            pontuacaoMinima: resp.pontuacaoMinima,
            nrTentativas: resp.nrTentativas,
            tentativasInfinitas: resp.nrTentativas === null,
          },
        })
      }
    } finally {
      loading.value = false
    }
  }, { immediate: true })

  function handleClose () {
    openLocal.value = false
  }

  const salvar = handleSubmit(async vals => {
    const sel = vals.tipoSelecionado!
    const payload = {
      tipo: sel.tipo === 'final' ? 'FINAL' : 'MODULO',
      idModulo: sel.idModulo,
      idCurso: store.cursoSelecionado?.id as number,
      titulo: sel.titulo,
      pontuacaoMinima: vals.pontuacaoMinima,
      nrTentativas: vals.tentativasInfinitas ? null : vals.nrTentativas,
    }

    loading.value = true
    try {
      const resp =
        props.idAvaliacao === null
          ? await cadastrarAvaliacao(payload)
          : await editarAvaliacao(props.idAvaliacao, payload)

      handleClose()
      if (resp.message === 'Avaliação criada com sucesso.')
        emit('cadastro-avaliacao-finalizado', resp.content as Avaliacao)
      else
        emit('edicao-avaliacao-finalizado', resp.content as Avaliacao)
    } finally {
      loading.value = false
      resetForm({
        values: {
          tipoSelecionado: undefined,
          pontuacaoMinima: 70,
          nrTentativas: null,
          tentativasInfinitas: false,
        },
      })
      tipos.value = await buscarTiposAvaliacao(store.cursoSelecionado!.id)
    }
  })
</script>

<style scoped>
</style>

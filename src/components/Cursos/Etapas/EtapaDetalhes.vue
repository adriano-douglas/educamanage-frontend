<template>
  <v-card class="pa-4 mb-6" elevation="1" rounded="lg">
    <v-row class="d-flex flex-nowrap align-center" density="compact" no-gutters>
      <v-col class="flex-grow-1 pr-4" cols="6">
        <v-select
          v-model="categoriaId"
          clearable
          dense
          :error-messages="errors.categoriaId"
          flat
          item-title="descricao"
          item-value="id"
          :items="categorias"
          label="Categoria"
          :loading="carregandoCategorias"
          prepend-inner-icon="mdi-tag"
        />
      </v-col>

      <v-col class="flex-grow-0 pr-4" cols="3" style="min-width:140px">
        <v-number-input
          v-model="diasParaConcluir"
          control-variant="default"
          dense
          :error-messages="errors.diasParaConcluir"
          flat
          :hide-input="false"
          :inset="false"
          label="Dias p/ concluir"
          :max="100"
          :min="1"
          :reverse="false"
        />
      </v-col>

      <v-col class="flex-grow-0" cols="3" style="min-width:160px">
        <v-number-input
          v-model="cargaHoraria"
          control-variant="default"
          dense
          :error-messages="errors.cargaHoraria"
          flat
          :hide-input="false"
          :inset="false"
          label="Carga horária (h)"
          :max="999"
          :min="1"
          prepend-inner-icon="mdi-clock-outline"
          :reverse="false"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="titulo"
          clearable
          dense
          :error-messages="errors.titulo"
          flat
          placeholder="Título do Curso"
          prepend-inner-icon="mdi-file-document-outline"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-file-input
          v-model="imagemCover"
          accept="image/*"
          clearable
          dense
          :error-messages="errors.imagemCover"
          flat
          label="Imagem de Capa"
          :multiple="false"
          prepend-inner-icon="mdi-image-outline"
        />
      </v-col>

      <v-col v-if="imagemCoverUrl && !errors.imagemCover" cols="12">
        <v-img
          class="mb-4"
          max-height="200"
          :src="imagemCoverUrl"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="descricao"
          clearable
          dense
          :error-messages="errors.descricao"
          flat
          placeholder="Descrição do Curso"
          prepend-inner-icon="mdi-text"
          rows="3"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
  import { useCursoStore } from '@/store/CursoStore'
  import { storeToRefs } from 'pinia'
  import { schemaEtapaDetalhesEdicaoCurso, schemaEtapaDetalhesNovoCurso } from '../validadorCursos'
  import { toTypedSchema } from '@vee-validate/zod'
  import { useField, useForm } from 'vee-validate'
  import {
    computed, defineExpose, onBeforeUnmount, onMounted, ref, watch,
  } from 'vue'
  import type { CategoriaCurso, Curso } from '@/types/curso/types'
  import { buscarCategorias } from '@/services/CursoService'

  const cursoStore = useCursoStore()
  const { cursoSelecionado } = storeToRefs(cursoStore)

  const categorias = ref<CategoriaCurso[]>([])
  const carregandoCategorias = ref(false)
  onMounted(async () => {
    carregandoCategorias.value = true
    try {
      categorias.value = await buscarCategorias()

    } finally {
      carregandoCategorias.value = false
    }
  })

  const {
    handleSubmit: handleSalvarRascunho,
    errors,
    values,
    resetForm,
  } = useForm({
    validateOnMount: false,
    validationSchema: toTypedSchema(cursoSelecionado.value ? schemaEtapaDetalhesEdicaoCurso : schemaEtapaDetalhesNovoCurso),
    initialValues: {
      categoriaId: cursoSelecionado.value?.categoriaId ?? null,
      diasParaConcluir: cursoSelecionado.value?.diasParaConcluir ?? null,
      cargaHoraria: cursoSelecionado.value?.cargaHoraria ?? null,
      titulo: cursoSelecionado.value?.titulo ?? null,
      imagemCover: cursoSelecionado.value?.imagemCover ?? null,
      descricao: cursoSelecionado.value?.descricao ?? null,
    },
  })

  const { value: categoriaId } = useField<number | null>('categoriaId')
  const { value: diasParaConcluir } = useField<number | null>('diasParaConcluir')
  const { value: cargaHoraria } = useField<number | null>('cargaHoraria')

  const { value: titulo } = useField<string | null>('titulo')
  const { value: imagemCover } = useField<File | null>('imagemCover')
  const { value: descricao } = useField<string | null>('descricao')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prev = JSON.parse(JSON.stringify(values))
  watch(
    values,
    newVal => {
      const snap = JSON.parse(JSON.stringify(newVal))
      if (cursoSelecionado.value) {
        const id = cursoSelecionado.value.id
        cursoStore.atualizarPropriedadeCurso(id, 'categoriaId', categoriaId.value as number)
        cursoStore.atualizarPropriedadeCurso(id, 'diasParaConcluir', diasParaConcluir.value as number)
        cursoStore.atualizarPropriedadeCurso(id, 'cargaHoraria', cargaHoraria.value as number)
        cursoStore.atualizarPropriedadeCurso(id, 'titulo', titulo.value as string)
        cursoStore.atualizarPropriedadeCurso(id, 'imagemCover', imagemCover.value)
        cursoStore.atualizarPropriedadeCurso(id, 'descricao', descricao.value as string)
      } else {
        const novoCurso: Partial<Curso> = {
          categoriaId: categoriaId.value ?? undefined,
          diasParaConcluir: diasParaConcluir.value ?? undefined,
          cargaHoraria: cargaHoraria.value ?? undefined,
          titulo: titulo.value ?? undefined,
          imagemCover: imagemCover.value ?? undefined,
          descricao: descricao.value ?? undefined,
        }
        cursoStore.setNovoCurso(novoCurso as Curso)
      }
      prev = snap
    },
    { deep: true },
  )

  let objectUrl: string | null = null
  const imagemCoverUrl = computed(() => {
    if (!imagemCover.value && cursoSelecionado.value?.imagemCoverUrl)
      return cursoSelecionado.value.imagemCoverUrl
    if (!imagemCover.value) return null
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = URL.createObjectURL(imagemCover.value)
    return objectUrl
  })
  onBeforeUnmount(() => { if (objectUrl) URL.revokeObjectURL(objectUrl) })

  defineExpose({ resetForm, handleSalvarRascunho })
</script>

<style scoped>
.v-row.flex-nowrap { overflow-x: auto; }
</style>

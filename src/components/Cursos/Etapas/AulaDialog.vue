<template>
  <v-dialog
    v-model="abrirModal"
    max-width="600"
    persistent
  >
    <v-card rounded="lg">
      <v-toolbar color="white" elevation="1" flat>
        <v-toolbar-title>
          {{ editando ? 'Editar Aula' : 'Nova Aula' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="cancelar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text style="max-height: 700px; overflow-y: auto; padding: 16px;">
        <v-form ref="formRef">
          <v-text-field
            v-model="formulario.titulo"
            dense
            :error-messages="erros.titulo"
            flat
            placeholder="Título da Aula"
            prepend-inner-icon="mdi-play-circle-outline"
          />
          <v-text-field
            v-model="formulario.videoUrl"
            dense
            :error-messages="erros.videoUrl"
            flat
            placeholder="URL do Vídeo"
            prepend-inner-icon="mdi-video-outline"
          />
          <v-textarea
            v-model="formulario.descricao"
            dense
            :error-messages="erros.descricao"
            flat
            placeholder="Descrição breve"
            prepend-inner-icon="mdi-text"
            rows="2"
          />
          <v-file-input
            v-model="novosMateriais"
            accept="image/*,application/pdf,.doc,.docx,.odt,.ppt,.pptx,.odp,.xls,.xlsx,.ods,.txt,.rtf,.zip,.rar"
            class="mb-4"
            dense
            flat
            hide-details
            label="Selecione materiais (opcional)"
            multiple
            prepend-icon="mdi-paperclip"
          />

          <div style="max-height: 240px; overflow-y: auto;">
            <v-list dense>
              <v-subheader class="pb-1">Materiais</v-subheader>
              <v-divider class="mb-2" />
              <v-list-item
                v-for="(item, idx) in listaMateriais"
                :key="item.chave"
                class="py-0"
              >
                <v-sheet
                  class="d-flex align-center justify-space-between pa-1 mb-1 border border-primary"
                  rounded
                  tile
                  width="100%"
                >
                  <div class="d-flex flex-column flex-grow-1 pe-4">
                    <span class="font-weight-medium text-body-2 text-truncate">
                      {{ item.nome }}
                    </span>
                    <span v-if="item.tamanho" class="text-caption text--secondary">
                      {{ (item.tamanho / 1024).toFixed(2) }} KB
                    </span>
                  </div>
                  <v-chip
                    class="mr-2"
                    :color="corStatus(item.status)"
                    small
                    text-color="white"
                  >
                    {{ rotuloStatus(item.status) }}
                  </v-chip>
                  <v-btn icon variant="text" @click="removerMaterial(idx)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-sheet>
              </v-list-item>
            </v-list>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end pa-4">
        <v-btn variant="text" @click="cancelar">Cancelar</v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-content-save"
          rounded
          variant="elevated"
          @click="salvarAula"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed, defineEmits, defineModel, defineProps, reactive, ref, watch } from 'vue'
  import { z } from 'zod'
  import type { Aula } from '@/types/curso/types'
  import { useCursoStore } from '@/store/CursoStore'

  const props = defineProps<{ moduloId: number; aulaId: number | null }>()

  type Status = 'existente' | 'novo' | 'substituido'
  interface Item {
    chave: string
    nome: string
    tamanho?: number
    status: Status
    arquivo?: File
    id?: number
  }

  interface AulaPayload {
    aula: Aula
    formData: FormData
    moduloId: number
    aulaId: number | null
    materials: Item[]
  }

  const emit = defineEmits<{
    (e: 'salvar-aula', payload: AulaPayload): void
  }>()

  const abrirModal = defineModel<boolean>('openLocal', { default: false })
  const cursoStore = useCursoStore()

  const aulaExistente = computed<Aula | undefined>(() =>
    props.aulaId !== null
      ? cursoStore.aulaPorId(props.moduloId, props.aulaId).value
      : undefined
  )

  const editando = computed(() => props.aulaId !== null)

  const formulario = reactive({
    id: undefined as number | undefined,
    titulo: '',
    descricao: '',
    videoUrl: '',
  })

  const novosMateriais = ref<File[]>([])

  const listaMateriais = ref<Item[]>([])

  const erros = reactive({
    titulo: [] as string[],
    descricao: [] as string[],
    videoUrl: [] as string[],
  })

  const AulaSchema = z.object({
    titulo: z.string().min(1, 'Título obrigatório'),
    descricao: z.string().min(1, 'Descrição obrigatória'),
    videoUrl: z.string().min(1, 'URL obrigatório').url('URL inválida'),
  })

  function limparErros () {
    erros.titulo = []
    erros.descricao = []
    erros.videoUrl = []
  }

  function carregarDados () {
    formulario.id = aulaExistente.value?.id
    formulario.titulo = aulaExistente.value?.titulo ?? ''
    formulario.descricao = aulaExistente.value?.descricao ?? ''
    formulario.videoUrl = aulaExistente.value?.videoUrl ?? ''
    listaMateriais.value = (aulaExistente.value?.materiais ?? []).map(mat => ({
      chave: `e-${mat.id}`,
      nome: mat.titulo,
      status: 'existente' as Status,
      id: mat.id,
    }))
    novosMateriais.value = []
    limparErros()
  }

  function resetarFormulario () {
    formulario.id = undefined
    formulario.titulo = ''
    formulario.descricao = ''
    formulario.videoUrl = ''
    listaMateriais.value = []
    novosMateriais.value = []
    limparErros()
  }

  watch(abrirModal, aberto => {
    if (aberto) carregarDados()
    else resetarFormulario()
  })

  watch(() => formulario.titulo, v => {
    erros.titulo = []
    const r = AulaSchema.shape.titulo.safeParse(v)
    if (!r.success) erros.titulo.push(r.error.issues[0].message)
  })

  watch(() => formulario.descricao, v => {
    erros.descricao = []
    const r = AulaSchema.shape.descricao.safeParse(v)
    if (!r.success) erros.descricao.push(r.error.issues[0].message)
  })

  watch(() => formulario.videoUrl, v => {
    erros.videoUrl = []
    const r = AulaSchema.shape.videoUrl.safeParse(v)
    if (!r.success) erros.videoUrl.push(r.error.issues[0].message)
  })

  watch(novosMateriais, arquivos => {
    if (arquivos.length === 0) return
    for (const f of arquivos) {
      const idx = listaMateriais.value.findIndex(m => m.nome === f.name)
      if (idx !== -1) {
        listaMateriais.value[idx] = {
          chave: `s-${f.name}-${Date.now()}`,
          nome: f.name,
          tamanho: f.size,
          status: 'substituido',
          arquivo: f,
        }
      } else {
        listaMateriais.value.push({
          chave: `n-${f.name}-${Date.now()}`,
          nome: f.name,
          tamanho: f.size,
          status: 'novo',
          arquivo: f,
        })
      }
    }
    novosMateriais.value = []
  }, { deep: true })

  function removerMaterial (i: number) {
    listaMateriais.value.splice(i, 1)
  }

  function corStatus (s: Status) {
    return { existente: 'grey darken-1', novo: 'green darken-1', substituido: 'orange darken-1' }[s]
  }

  function rotuloStatus (s: Status) {
    return { existente: 'Existente', novo: 'Novo', substituido: 'Substituído' }[s]
  }

  function cancelar () {
    abrirModal.value = false
  }

  function salvarAula () {
    limparErros()
    const parse = AulaSchema.safeParse({
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      videoUrl: formulario.videoUrl,
    })
    if (!parse.success) {
      for (const issue of parse.error.issues) {
        erros[issue.path[0] as keyof typeof erros].push(issue.message)
      }
      return
    }

    const manterIds = listaMateriais.value
      .filter(m => m.status === 'existente')
      .map(m => m.id!)

    const apagarIds = aulaExistente.value?.materiais
      .map(m => m.id)
      .filter(id => !manterIds.includes(id)) ?? []

    const dto = {
      idModulo: props.moduloId,
      titulo: formulario.titulo.trim(),
      descricao: formulario.descricao.trim(),
      videoUrl: formulario.videoUrl.trim(),
      manterIds,
      apagarIds,
    }

    const formData = new FormData()
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

    listaMateriais.value
      .filter(m => m.status !== 'existente' && m.arquivo)
      .forEach(m => formData.append('materiais', m.arquivo!))

    emit('salvar-aula', {
      aula: {
        id: formulario.id ?? 0,
        titulo: dto.titulo,
        descricao: dto.descricao,
        videoUrl: dto.videoUrl,
        materiais: listaMateriais.value.map(m => ({ id: m.id ?? 0, titulo: m.nome })),
      },
      formData,
      moduloId: props.moduloId,
      aulaId: props.aulaId,
      materials: listaMateriais.value,
    })

    abrirModal.value = false
  }
</script>

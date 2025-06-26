<template>
  <v-dialog
    v-model="openLocal"
    hide-overlay
    max-width="1300"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-sheet class="d-flex flex-column" height="100%">
      <v-toolbar color="white" elevation="1" flat style="z-index: 99;">
        <v-toolbar-title>
          {{ props?.visualizando? 'Visualizar Curso' : props?.editando ? 'Editar Curso' : 'Novo Curso' }}
        </v-toolbar-title>

        <template #append>
          <v-btn icon variant="text" @click="openLocal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>

      <v-sheet class="flex-grow-1 overflow-y-auto pa-8">
        <v-stepper
          v-model="stepLocal"
          active-color="primary"
          class="mb-8"
          complete-color="primary"
          elevation="0"
          flat
          non-linear
        >
          <v-stepper-header>
            <v-stepper-item
              :complete="stepLocal > 1"
              complete-icon="mdi-file-document-outline"
              :disabled="props.visualizando"
              editable
              icon="mdi-file-document-outline"
              :value="1"
            >
              Detalhes
            </v-stepper-item>

            <v-divider />

            <v-stepper-item
              :complete="stepLocal > 2"
              complete-icon="mdi-view-module-outline"
              :disabled="props.visualizando"
              :editable="props.editando"
              icon="mdi-view-module-outline"
              :value="2"
            >
              Módulos
            </v-stepper-item>

            <v-divider />

            <v-stepper-item
              :complete="stepLocal > 3"
              complete-icon="mdi-clipboard-text-outline"
              :disabled="props.visualizando"
              :editable="props.editando"
              icon="mdi-clipboard-text-outline"
              :value="3"
            >
              Avaliações
            </v-stepper-item>

            <v-divider />

            <v-stepper-item
              complete-icon="mdi-clipboard-check-outline"
              :disabled="props.visualizando"
              :editable="props.editando"
              icon="mdi-clipboard-check-outline"
              :value="4"
            >
              Revisão
            </v-stepper-item>
          </v-stepper-header>
        </v-stepper>

        <EtapaDetalhes v-if="stepLocal === 1" ref="etapaDetalhesRef" />

        <EtapaModulos
          v-if="stepLocal === 2"
          @deletar-aula="handleDeletarAula"
          @deletar-modulo="handleDeletarModulo"
          @editar-aula="handleEditarAula"
          @editar-modulo="handleEditarModulo"
          @nova-aula="handleNovaAula"
          @novo-modulo="handleNovoModulo"
        />

        <EtapaAvaliacoes v-if="stepLocal === 3" />

        <EtapaRevisao v-if="stepLocal === 4" />
      </v-sheet>

      <v-sheet class="pa-4 d-flex justify-space-between" elevation="1">
        <v-btn :disabled="stepLocal === 1 || props.visualizando" prepend-icon="mdi-arrow-left" variant="text" @click="stepLocal--">
          Voltar
        </v-btn>

        <div>
          <template v-if="stepLocal < 4">
            <template v-if="stepLocal === 1 || props.visualizando">
              <v-btn
                class="mr-4"
                color="secondary"
                :disabled="props.visualizando || props.loadingSalvarRascunho"
                :loading="props.loadingSalvarRascunho"
                prepend-icon="mdi-content-save-outline"
                rounded
                variant="tonal"
                @click="handleSalvarRascunho"
              >
                Salvar Rascunho
              </v-btn>
            </template>

            <v-btn
              append-icon="mdi-arrow-right"
              color="primary"
              :disabled="!props.editando || props.visualizando"
              rounded
              @click="stepLocal++"
            >
              Próximo
            </v-btn>
          </template>

          <template v-else>
            <template v-if="stepLocal === 1 || props.visualizando">
              <v-btn
                class="mr-4"
                color="secondary"
                :disabled="props.visualizando || props.loadingSalvarRascunho"
                :loading="props.loadingSalvarRascunho"
                prepend-icon="mdi-content-save-outline"
                rounded
                variant="tonal"
                @click="handleSalvarRascunho"
              >
                Salvar Rascunho
              </v-btn>
            </template>

            <v-btn
              append-icon="mdi-check"
              color="primary"
              :disabled="props.visualizando"
              rounded
              @click="handlePublicar"
            >
              Publicar
            </v-btn>
          </template>
        </div>
      </v-sheet>
    </v-sheet>

    <AulaDialog
      v-model:open-local="aulaDialogAberto"
      :aula-id="aulaDialogProps.aulaId"
      :modulo-id="aulaDialogProps.moduloId"
      @salvar-aula="handleSalvarAula"
    />
  </v-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import EtapaDetalhes from '@/components/Cursos/Etapas/EtapaDetalhes.vue'
  import EtapaModulos from '@/components/Cursos/Etapas/EtapaModulos.vue'
  import EtapaAvaliacoes from '@/components/Cursos/Etapas/EtapaAvaliacoes.vue'
  import EtapaRevisao from '@/components/Cursos/Etapas/EtapaRevisao.vue'
  import AulaDialog from '@/components/Cursos/Etapas/AulaDialog.vue'
  import type { Aula } from '@/types/curso/types'

  interface AulaPayload {
    aula: Aula
    formData: FormData
    moduloId: number
    aulaId: number | null
  }

  const props = defineProps<{ editando: boolean, visualizando: boolean, loadingSalvarRascunho: boolean }>()
  const emit = defineEmits([
    'novo-modulo', 'editar-modulo', 'deletar-modulo',
    'salvar-aula', 'deletar-aula',
    'salvar-rascunho', 'publicar',
  ])

  const openLocal = defineModel<boolean>('openLocal', { default: false })
  const stepLocal = defineModel<number>('stepLocal', { default: 1 })

  const etapaDetalhesRef = ref()
  const aulaDialogAberto = ref(false)
  const aulaDialogProps = reactive<{ moduloId: number; aulaId: number | null }>({
    moduloId: 0,
    aulaId: null,
  })

  const handlePublicar = () => emit('publicar')

  const handleSalvarRascunho = () => {
    if (etapaDetalhesRef.value?.handleSalvarRascunho) {
      etapaDetalhesRef.value.handleSalvarRascunho(() => emit('salvar-rascunho'))()
    }
  }

  const handleNovoModulo = (titulo: string) =>
    emit('novo-modulo', titulo)

  const handleEditarModulo = (val: { moduloId: number; novoTitulo: string }) =>
    emit('editar-modulo', val)

  const handleDeletarModulo = (val: { moduloId: number }) =>
    emit('deletar-modulo', val)

  const handleNovaAula = ({ moduloId }: { moduloId: number }) => {
    aulaDialogProps.moduloId = moduloId
    aulaDialogProps.aulaId = null
    aulaDialogAberto.value = true
  }

  const handleEditarAula = (payload: { moduloId: number; aulaId: number }) => {
    aulaDialogProps.moduloId = payload.moduloId
    aulaDialogProps.aulaId = payload.aulaId
    aulaDialogAberto.value = true
  }

  const handleDeletarAula = (payload: { moduloId: number; aulaId: number }) =>
    emit('deletar-aula', payload)

  const handleSalvarAula = (payload: AulaPayload) => emit('salvar-aula', payload)
</script>

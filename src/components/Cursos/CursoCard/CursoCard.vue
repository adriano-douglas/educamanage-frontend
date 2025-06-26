<template>
  <v-card
    class="hover-elevation-8 d-flex flex-column h-100"
    elevation="1"
    max-width="360"
    rounded="lg"
  >
    <v-img
      class="flex-shrink-0"
      cover
      height="160"
      :src="curso.imagemCoverUrl as string"
    />

    <v-card-text class="flex-grow-1">
      <div class="text-h6 mb-1">{{ curso.titulo }}</div>
      <div class="text-body-2 text-medium-emphasis">
        {{ curso.descricao }}
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="flex-shrink-0 justify-space-between">
      <v-chip :color="corStatus" small>{{ labelStatus }}</v-chip>

      <div class="d-flex align-center">
        <v-tooltip open-on-hover>
          <template #activator="{ props: tp }">
            <v-btn
              v-if="podeAlternar"
              v-bind="tp"
              :color="curso.flInativo ? 'success' : 'warning'"
              icon
              variant="text"
              @click="emit('alternar-ativo')"
            >
              <v-icon>
                {{ curso.flInativo
                  ? 'mdi-power-plug'
                  : 'mdi-power-plug-off-outline' }}
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ curso.flInativo ? 'Ativar curso' : 'Inativar curso' }}
          </span>
        </v-tooltip>

        <v-tooltip open-on-hover>
          <template #activator="{ props: tp }">
            <v-btn
              v-bind="tp"
              icon
              variant="text"
              @click="acaoEditarOuVisualizar"
            >
              <v-icon>{{ iconeAcao }}</v-icon>
            </v-btn>
          </template>
          <span>
            {{ labelStatus === 'RASCUNHO'
              ? 'Editar curso'
              : 'Visualizar curso' }}
          </span>
        </v-tooltip>

        <v-tooltip open-on-hover>
          <template #activator="{ props: tp }">
            <v-btn
              v-bind="tp"
              color="error"
              icon
              variant="text"
              @click="emit('deletar')"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
          <span>Excluir curso</span>
        </v-tooltip>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import { computed, defineEmits, defineProps } from 'vue'
  import type { Curso } from '../../../types/curso/types'

  const props = defineProps<{ curso: Curso }>()

  const emit = defineEmits<{
    (e: 'editar'): void
    (e: 'visualizar'): void
    (e: 'deletar'): void
    (e: 'alternar-ativo'): void
  }>()

  const labelStatus = computed<string>(() => {
    if (!props.curso.flPublicado) return 'RASCUNHO'
    if (props.curso.flInativo) return 'INATIVO'
    return 'PUBLICADO'
  })

  const corStatus = computed<string>(() => {
    if (labelStatus.value === 'RASCUNHO') return 'grey lighten-2'
    if (labelStatus.value === 'INATIVO') return 'red lighten-3'
    return 'green lighten-2'
  })

  const podeAlternar = computed<boolean>(() =>
    labelStatus.value === 'PUBLICADO' || labelStatus.value === 'INATIVO'
  )

  const iconeAcao = computed<string>(() =>
    labelStatus.value === 'RASCUNHO' ? 'mdi-pencil-outline' : 'mdi-eye-outline'
  )

  function acaoEditarOuVisualizar () {
    if (labelStatus.value === 'RASCUNHO') {
      emit('editar')
    } else {
      emit('visualizar')
    }
  }
</script>

<style scoped>
.hover-elevation-8:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}
</style>

<template>
  <v-expansion-panel rounded="lg">
    <v-expansion-panel-title class="d-flex align-center">
      <v-icon class="mr-2" left small>mdi-view-module-outline</v-icon>
      <span class="flex-grow-1 texto-truncado">
        {{ titulo || `Módulo ${index + 1}` }}
      </span>

      <v-btn
        class="mr-2"
        color="error"
        icon
        size="small"
        variant="text"
        @click.stop="emit('deletar-modulo', { moduloId: modulo.id })"
      >
        <v-icon small>mdi-delete-outline</v-icon>
      </v-btn>

      <v-chip color="primary" label size="small" text-color="white">
        {{ aulasLocal.length }} aulas
      </v-chip>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <v-text-field
        v-model="titulo"
        class="px-2"
        clearable
        :error-messages="errors.titulo"
        flat
        prepend-inner-icon="mdi-tag-outline"
        @blur="handleBlurTituloModulo"
      />

      <draggable
        v-model="aulasLocal"
        :animation="200"
        chosen-class="arrastar-escolhido"
        class="d-flex justify-space-between flex-wrap mt-2"
        ghost-class="arrastar"
        item-key="id"
      >
        <template #item="{ element: aula, index: j }">
          <v-col class="pa-2" cols="6">
            <v-sheet
              class="aula-sheet d-flex flex-column justify-space-between pa-2"
              rounded
              variant="outlined"
            >
              <div class="d-flex align-center mb-1">
                <v-chip
                  class="mr-2"
                  color="secondary"
                  label
                  size="x-small"
                  text-color="white"
                >
                  {{ j + 1 }}
                </v-chip>
                <div class="text-body-1 font-weight-medium flex-grow-1">
                  {{ aula.titulo || 'Sem título' }}
                </div>
              </div>

              <div class="text-body-2 text-medium-emphasis grampo-2 mb-2">
                {{ aula.descricao || 'Sem descrição' }}
              </div>

              <div class="d-flex justify-end">
                <v-btn
                  class="mr-2"
                  color="primary"
                  icon
                  size="small"
                  variant="text"
                  @click="emit('editar-aula', { moduloId: modulo.id, aulaId: aula.id })"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="error"
                  icon
                  size="small"
                  variant="text"
                  @click="emit('deletar-aula', { moduloId: modulo.id, aulaId: aula.id })"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-sheet>
          </v-col>
        </template>
      </draggable>

      <div class="d-flex">
        <v-col class="pa-2" cols="6">
          <v-sheet
            class="add-aula d-flex align-center justify-center"
            height="60"
            rounded
            variant="outlined"
            @click="emit('nova-aula', { moduloId: modulo.id })"
          >
            <v-icon class="mr-1" color="secondary" size="20">mdi-plus</v-icon>
            <span class="text-body-2">NOVA AULA</span>
          </v-sheet>
        </v-col>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
  import draggable from 'vuedraggable'
  import { useField, useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { schemaEtapaModulos } from '../validadorCursos'
  import { ref, watch } from 'vue'
  import type { Aula, Modulo } from '@/types/curso/types'

  const props = defineProps<{
    modulo: Modulo
    index: number
  }>()

  const emit = defineEmits([
    'update-titulo',
    'update-aulas',
    'deletar-modulo',
    'editar-modulo',
    'nova-aula',
    'editar-aula',
    'deletar-aula',
  ])

  const { errors, handleSubmit } = useForm({
    validationSchema: toTypedSchema(schemaEtapaModulos),
    validateOnMount: true,
    initialValues: {
      titulo: props.modulo.titulo,
    },
  })
  const { value: titulo } = useField('titulo')

  watch(titulo, newVal => {
    emit('update-titulo', { moduloId: props.modulo.id, titulo: newVal })
  })

  watch(
    () => props.modulo.titulo,
    novoTitulo => {
      titulo.value = novoTitulo
    },
    { deep: true }
  )

  const aulasLocal = ref([...props.modulo.aulas] as Aula[])

  function areArraysEqual (a: unknown[], b: unknown[]) {
    return a.length === b.length && a.every((item, i) => JSON.stringify(item) === JSON.stringify(b[i]))
  }

  watch(
    () => props.modulo.aulas,
    novasAulas => {
      if (!areArraysEqual(novasAulas, aulasLocal.value)) {
        aulasLocal.value = [...novasAulas]
      }
    },
    { deep: true }
  )

  watch(
    aulasLocal,
    novasAulas => {
      if (!areArraysEqual(novasAulas, props.modulo.aulas)) {
        emit('update-aulas', { moduloId: props.modulo.id, aulas: novasAulas })
      }
    },
    { deep: true }
  )

  const handleBlurTituloModulo = () => {
    handleSubmit(() => emit('editar-modulo', titulo.value))()
  }

</script>

<style scoped>
.aula-sheet,
.add-aula {
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.12);
}

.add-aula {
    border-style: dashed;
    cursor: pointer;
    transition: background-color 0.2s;
}

.add-aula:hover {
    background-color: rgba(0, 0, 0, 0.04);
}

.arrastar {
    opacity: 0.4;
}

.arrastar-escolhido {
    border-color: var(--v-theme-primary);
}

.grampo-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.texto-truncado {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

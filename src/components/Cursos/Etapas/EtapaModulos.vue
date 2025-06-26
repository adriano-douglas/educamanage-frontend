<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1">Módulos</div>
      <v-btn color="primary" icon variant="text" @click="emit('novo-modulo', tituloProximoModulo)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
    </div>

    <v-expansion-panels accordion elevation="1">
      <ModuloPanel
        v-for="(modulo, index) in cursoSelecionado?.modulos"
        :key="modulo.id"
        :index="index"
        :modulo="modulo"
        @deletar-aula="emit('deletar-aula', $event)"
        @deletar-modulo="emit('deletar-modulo', $event)"
        @editar-aula="emit('editar-aula', $event)"
        @editar-modulo="(novoTitulo) => { emit('editar-modulo', { moduloId: modulo.id, novoTitulo }) }"
        @nova-aula="emit('nova-aula', $event)"
        @update-aulas="({ moduloId, aulas }) => cursoStore.atualizarPropriedadeModulo(moduloId, 'aulas', aulas)"
        @update-titulo="({ moduloId, titulo }) => cursoStore.atualizarPropriedadeModulo(moduloId, 'titulo', titulo)"
      />
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
  import ModuloPanel from './ModuloPanel.vue'
  import { useCursoStore } from '@/store/CursoStore'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  const cursoStore = useCursoStore()
  const { cursoSelecionado } = storeToRefs(cursoStore)

  const emit = defineEmits([
    'novo-modulo',
    'deletar-modulo',
    'editar-modulo',
    'nova-aula',
    'editar-aula',
    'deletar-aula',
  ])

  const tituloProximoModulo = computed(() => {
    const length = cursoSelecionado.value?.modulos?.length || 0
    return `Módulo ${length + 1}`
  })
</script>

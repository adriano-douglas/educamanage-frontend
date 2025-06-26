<template>
  <v-sheet
    border
    border-color="primary"
    class="d-flex align-center flex-wrap gap-4 px-4 py-3 mb-8"
    color="white"
    elevation="0"
    rounded="lg"
  >
    <v-select
      v-model="filtroCategoria"
      class="me-7"
      density="compact"
      hide-details
      :items="opcoesCategorias"
      label="Categoria"
      prepend-inner-icon="mdi-tag-outline"
      style="max-width: 300px"
    />

    <v-btn-toggle
      v-model="filtroStatus"
      class="me-4"
      color="primary"
      density="compact"
      divided
    >
      <v-btn value="Todos">Todos</v-btn>
      <v-btn value="RASCUNHO">Rascunho</v-btn>
      <v-btn value="PUBLICADO">Publicado</v-btn>
      <v-btn value="INATIVO">Inativo</v-btn>
    </v-btn-toggle>

    <v-spacer />

    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      variant="flat"
      @click="emit('novo-curso')"
    >
      Novo Curso
    </v-btn>
  </v-sheet>

  <div v-for="categoria in categoriasExibidas" :key="categoria" class="mb-8">
    <div class="text-h6 font-weight-medium mb-4">{{ categoria }}</div>

    <v-row align="stretch" dense>
      <v-col
        v-for="curso in cursosFiltradosPorCategoria[categoria]"
        :key="curso.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <CursoCard
          :curso="curso"
          @alternar-ativo="emit('alternar-ativo-curso', curso)"
          @deletar="emit('deletar-curso', curso)"
          @editar="emit('editar-curso', curso)"
          @visualizar="emit('visualizar-curso', curso)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { defineEmits } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCursoStore } from '@/store/CursoStore'
  import type { Curso } from '@/types/curso/types'
  import CursoCard from '@/components/Cursos/CursoCard/CursoCard.vue'

  const cursoStore = useCursoStore()
  const { cursos } = storeToRefs(cursoStore)

  const emit = defineEmits([
    'novo-curso',
    'editar-curso',
    'visualizar-curso',
    'alternar-ativo-curso',
    'deletar-curso',
  ])

  const filtroCategoria = ref<string>('Todos')
  const filtroStatus = ref<string>('Todos')

  const opcoesCategorias = computed<string[]>(() => {
    const cats = Array.from(new Set(cursos.value.map(c => c.categoria)))
    return ['Todos', ...cats]
  })

  function correspondeStatus (curso: Curso): boolean {
    switch (filtroStatus.value) {
      case 'RASCUNHO': return !curso.flPublicado
      case 'PUBLICADO': return curso.flPublicado && !curso.flInativo
      case 'INATIVO': return curso.flInativo
      default: return true
    }
  }

  const cursosFiltrados = computed<Curso[]>(() =>
    cursos.value.filter(correspondeStatus)
  )

  const cursosFiltradosPorCategoria = computed<Record<string, Curso[]>>(() =>
    cursosFiltrados.value.reduce((acc, curso) => {
      const cat = curso.categoria
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(curso)
      return acc
    }, {} as Record<string, Curso[]>)
  )

  const categoriasExibidas = computed<string[]>(() =>
    filtroCategoria.value === 'Todos'
      ? Object.keys(cursosFiltradosPorCategoria.value)
      : [filtroCategoria.value]
  )
</script>

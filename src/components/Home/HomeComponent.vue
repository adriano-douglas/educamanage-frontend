<template>
  <v-container class="py-8" fluid>
    <h2 class="text-h4 font-weight-bold mb-6">Catálogo de Cursos</h2>

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
        style="max-width: 500px; width: 100%;"
      />

      <v-text-field
        v-model="filtroNome"
        claerable
        class="me-7"
        density="compact"
        hide-details
        label="Buscar por título"
        prepend-inner-icon="mdi-magnify"
        style="max-width: 500px; width: 100%;"
      />

      <v-spacer />
    </v-sheet>

    <div
      v-for="categoria in categoriasExibidas"
      :key="categoria"
      class="mb-8"
    >
      <div class="text-h6 font-weight-medium mb-4">{{ categoria }}</div>

      <v-row align="stretch" dense>
        <v-col
          v-for="curso in cursosFiltradosPorCategoria[categoria]"
          :key="curso.idCurso"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <v-card
            class="hover-elevation-8"
            elevation="4"
            max-width="340"
            rounded="lg"
          >
            <v-img
              cover
              height="160"
              :src="curso.imagemCoverUrl"
            />

            <v-card-text>
              <div class="text-h6 mb-1">{{ curso.titulo }}</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ curso.descricao }}
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-space-between flex-wrap px-4 pb-4">
              <v-chip
                :color="curso.status === 'REPROVADO' ? 'error' : 'success'"
                size="small"
                text-color="white"
              >
                {{ curso.status === 'PUBLICADO' ? 'DISPONÍVEL' : curso.status }}
              </v-chip>

              <v-spacer />

              <v-btn
                v-if="curso.status !== 'PUBLICADO'"
                color="primary"
                @click="handleContinuar(curso)"
              >
                Continuar
              </v-btn>

              <v-btn
                v-else
                color="primary"
                @click="handleMatricular(curso.idCurso)"
              >
                Matricular-se
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import {
    buscarTodosCursosPublicados,
    realizarMatriculaCurso,
    registrarProgresso,
  } from '@/services/MatriculaCursoService'
  import type { CursosPublicadosMatricula } from '@/types/matricula-curso/types'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const cursosPublicados = ref<CursosPublicadosMatricula[]>([])

  const filtroCategoria = ref<string>('Todos')
  const filtroNome = ref<string>('')

  const opcoesCategorias = computed<string[]>(() => {
    const cats = Array.from(
      new Set(cursosPublicados.value.map(c => c.categoria))
    )
    return ['Todos', ...cats]
  })

  function correspondeCategoria (c: CursosPublicadosMatricula): boolean {
    return filtroCategoria.value === 'Todos'
      ? true
      : c.categoria === filtroCategoria.value
  }

  function correspondeNome (c: CursosPublicadosMatricula): boolean {
    const termo = filtroNome.value.trim().toLowerCase()
    if (!termo) return true
    return c.titulo.toLowerCase().includes(termo)
  }

  const cursosFiltrados = computed(() =>
    cursosPublicados.value
      .filter(correspondeCategoria)
      .filter(correspondeNome)
  )

  const cursosFiltradosPorCategoria = computed<Record<string, CursosPublicadosMatricula[]>>(() =>
    cursosFiltrados.value.reduce((acc, curso) => {
      const cat = curso.categoria
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(curso)
      return acc
    }, {} as Record<string, CursosPublicadosMatricula[]>)
  )

  const categoriasExibidas = computed<string[]>(() =>
    filtroCategoria.value === 'Todos'
      ? Object.keys(cursosFiltradosPorCategoria.value)
      : [filtroCategoria.value]
  )

  const handleMatricular = async (idCurso: number) => {
    try {
      await realizarMatriculaCurso({ idCurso })
      cursosPublicados.value = await buscarTodosCursosPublicados()
    } catch (error) {
      console.error(error)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert('Falha ao matricular: ' + (error as any).message)
    }
  }

  const handleContinuar = async (curso: CursosPublicadosMatricula) => {
    try {
      const idMatriculaCurso = curso.idMatriculaCurso as number
      if (curso.status == 'MATRICULADO') {
        await registrarProgresso(idMatriculaCurso, { idMatriculaCurso })
        cursosPublicados.value = await buscarTodosCursosPublicados()
      }
      router.push(`/curso/matricula/${idMatriculaCurso}`)
    } catch (error) {
      console.error(error)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert('Falha ao continuar: ' + (error as any).message)
    }
  }

  onMounted(async () => {
    try {
      cursosPublicados.value = await buscarTodosCursosPublicados()
    } catch (error) {
      console.error(error)
    }
  })
</script>

<style scoped>
.hover-elevation-8:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, .12) !important;
}
</style>

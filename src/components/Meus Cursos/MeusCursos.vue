<template>
  <v-container fluid>
    <h2 class="text-h5 font-weight-bold mb-6">Meus&nbsp;Cursos</h2>

    <v-row align="center" class="mb-8 gap-3">
      <v-col cols="12" md="3" sm="4">
        <v-select
          v-model="filtroStatus"
          density="comfortable"
          hide-details
          :items="opcoesStatus"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" md="5" sm="8">
        <v-text-field
          v-model="filtroNome"
          append-inner-icon="mdi-magnify"
          density="comfortable"
          hide-details
          placeholder="Busque pelo título do curso"
          variant="outlined"
          @click:append-inner="aplicarFiltro"
          @keydown.enter="aplicarFiltro"
        />
      </v-col>
    </v-row>

    <v-table class="elevation-0">
      <thead>
        <tr class="bg-primary-lighten-5 opacity-25">
          <th class="px-4 text-subtitle-2 font-weight-medium">CURSO</th>
          <th class="px-4 text-subtitle-2 font-weight-medium">STATUS</th>
          <th class="px-4 text-subtitle-2 font-weight-medium text-end">
            ÚLTIMA INTERAÇÃO
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="curso in cursosPaginados" :key="curso.id">
          <td class="py-8">
            <div class="d-flex align-center">
              <v-icon
                class="mr-3"
                :color="mapaStatus[curso.status].cor"
                :icon="mapaStatus[curso.status].icone"
                size="26"
              />
              <RouterLink
                class="link-curso"
                :to="`/curso/matricula/${curso.id}`"
              >
                {{ curso.nome }}
              </RouterLink>
            </div>
          </td>

          <td>
            <v-btn
              v-if="curso.status === 'concluido'"
              color="primary"
              :href="curso.linkCertificado"
              prepend-icon="mdi-certificate"
              size="small"
              target="_blank"
              variant="text"
            >
              Certificado
            </v-btn>

            <template v-else-if="curso.status === 'em_andamento'">
              <v-progress-linear
                class="mr-4"
                color="primary"
                height="10"
                :model-value="curso.percentual"
                rounded
                style="max-width: 160px"
              />
              <span class="text-caption">{{ curso.percentual }}%</span>
            </template>

            <span v-else class="text-caption text-medium-emphasis">
              Não iniciado
            </span>
          </td>

          <td class="text-end text-caption">
            {{ formatarData(curso.dataUltimaInteracao) }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="d-flex flex-column align-center mt-10">
      <span class="text-caption mb-2">
        Exibindo {{ cursosPaginados.length }}
        de {{ cursosFiltrados.length }} itens
      </span>

      <v-pagination
        v-model="paginaAtual"
        :length="totalPaginas"
        rounded="circle"
        size="small"
        total-visible="5"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { listarMeusCursos } from '@/services/MatriculaCursoService'
  import type { MeusCursos } from '@/types/matricula-curso/types'
  import { computed, onMounted, ref } from 'vue'
  import { RouterLink } from 'vue-router'

  const meusCursos = ref<MeusCursos[]>([])

  const filtroStatus = ref<'todos' | 'concluido' | 'em_andamento'>('todos')
  const filtroNome = ref('')
  const paginaAtual = ref(1)
  const itensPorPagina = ref(10)

  const cursosFiltrados = computed(() =>
    meusCursos.value.filter(c => {
      const statusOK = filtroStatus.value === 'todos' ? true : c.status === filtroStatus.value
      const nomeOK = c.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
      return statusOK && nomeOK
    }),
  )

  const totalPaginas = computed(() =>
    Math.max(1, Math.ceil(cursosFiltrados.value.length / itensPorPagina.value)),
  )

  const cursosPaginados = computed(() => {
    const ini = (paginaAtual.value - 1) * itensPorPagina.value
    return cursosFiltrados.value.slice(ini, ini + itensPorPagina.value)
  })

  const opcoesStatus = [
    { title: 'Todos', value: 'todos' },
    { title: 'Concluídos', value: 'concluido' },
    { title: 'Em andamento', value: 'em_andamento' },
  ]

  const mapaStatus: Record<MeusCursos['status'], { icone: string; cor: string }> = {
    concluido: { icone: 'mdi-check-circle', cor: 'success' },
    em_andamento: { icone: 'mdi-progress-clock', cor: 'primary' },
  }

  const formatarData = (iso: string) =>
    new Date(iso)
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace('.', '')

  const aplicarFiltro = () => {
    paginaAtual.value = 1
  }

  onMounted(async () => {
    try {
      const response = await listarMeusCursos()
      meusCursos.value = response

    } catch (error: unknown) {
      console.error(error)
    }
  })
</script>

<style scoped>
.link-curso {
  text-decoration: none;
  font-weight: 400;
  color: rgb(var(--v-theme-primary-base));
}

.link-curso:hover {
  text-decoration: underline;
}
</style>

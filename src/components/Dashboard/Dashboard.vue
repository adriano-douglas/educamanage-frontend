<template>
  <v-container class="pa-4" fluid>
    <h2 class="text-h5 font-weight-medium d-flex align-center gap-2 mb-4">
      <v-icon icon="mdi-view-dashboard" /> Painel de Controle
    </h2>

    <v-row class="mb-6">
      <v-col
        v-for="stat in estatisticas"
        :key="stat.rotulo"
        cols="12"
        md="3"
        sm="6"
      >
        <v-card class="pa-4" :color="stat.cor" elevation="2">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h4 font-weight-bold">{{ stat.valor }}</div>
              <div class="opacity-70">{{ stat.rotulo }}</div>
            </div>
            <v-icon class="opacity-70" :icon="stat.icone" size="36" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6" dense>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Taxa de Conclusão</v-card-title>
          <apexchart height="260" :options="opcoesGraficoConclusao" :series="serieConclusao" type="radialBar" />
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Status das Matrículas</v-card-title>
          <apexchart height="260" :options="opcoesGraficoStatus" :series="serieStatus" type="pie" />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- COLABORADORES -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="pb-0">Colaboradores</v-card-title>

          <v-data-table
            class="elevation-0"
            density="comfortable"
            :headers="cabecalhosColaboradores"
            :items="colaboradoresTabela"
            :items-per-page="5"
          >
            <template #item.totalMatriculas="{ item }">
              {{ item.totalMatriculas }}
            </template>
            <template #item.acoes="{ item }">
              <v-icon icon="mdi-eye" style="cursor:pointer" @click="abrirDialogColaborador(item)" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- CURSOS -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="pb-0">Cursos</v-card-title>

          <v-data-table
            class="elevation-0"
            density="comfortable"
            :headers="cabecalhosCursos"
            :items="cursosTabela"
            :items-per-page="5"
          >
            <template #item.totalMatriculas="{ item }">
              {{ item.totalMatriculas }}
            </template>
            <template #item.acoes="{ item }">
              <v-icon icon="mdi-eye" style="cursor:pointer" @click="abrirDialogCurso(item)" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- RANKING -->
    <v-row class="mt-6">
      <v-col cols="12">
        <HankingGamificacao />
      </v-col>
    </v-row>

    <!-- DIALOG COLABORADOR -->
    <v-dialog v-model="dialogColaborador" max-width="750">
      <v-card v-if="colaboradorSelecionado">
        <v-card-title class="pb-0">
          Detalhes de {{ colaboradorSelecionado.nome }}
        </v-card-title>

        <v-tabs v-model="abaColaborador" grow>
          <v-tab value="cursos">Cursos</v-tab>
          <v-tab value="avaliacoes">Avaliações</v-tab>
        </v-tabs>
        <v-divider />

        <v-card-text class="pa-0" style="max-height:500px;overflow-y:auto;">
          <v-window v-model="abaColaborador" class="pt-4">
            <!-- CURSOS -->
            <v-window-item value="cursos">
              <v-list class="px-2" density="comfortable">
                <template v-for="(c, i) in colaboradorDetail?.cursos || []" :key="i">
                  <v-list-item>
                    <v-list-item-title>{{ c.titulo }}</v-list-item-title>

                    <template #append>
                      <v-chip :color="colorStatus(c.status)" rounded="xs" size="small" variant="outlined">
                        {{ c.status }}
                      </v-chip>
                    </template>
                  </v-list-item>

                  <v-divider v-if="i < (colaboradorDetail?.cursos.length || 0) - 1" />
                </template>

                <v-list-item v-if="!(colaboradorDetail?.cursos?.length)">
                  <v-list-item-title class="text-center text-medium-emphasis py-6">
                    Nenhum curso encontrado.
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-window-item>

            <!-- AVALIACOES -->
            <v-window-item value="avaliacoes">
              <v-list class="pa-0" density="comfortable">
                <template v-for="(a, i) in colaboradorDetail?.avaliacoes || []" :key="i">
                  <v-list-item class="py-3">
                    <v-list-item-content>
                      <v-list-item-title class="font-italic text-body-1">
                        “{{ a.texto }}”
                      </v-list-item-title>
                      <v-list-item-subtitle class="mt-1 text-subtitle-2">
                        <strong>Curso:</strong> {{ a.curso }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider v-if="i < (colaboradorDetail?.avaliacoes.length || 0) - 1" />
                </template>

                <v-list-item v-if="!(colaboradorDetail?.avaliacoes?.length)">
                  <v-list-item-title class="text-center text-medium-emphasis py-6">
                    Nenhuma avaliação encontrada.
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogColaborador = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG CURSO -->
    <v-dialog v-model="dialogCurso" max-width="750">
      <v-card v-if="cursoSelecionado">
        <v-card-title class="pb-0">
          Detalhes: {{ cursoSelecionado.titulo }}
        </v-card-title>

        <v-tabs v-model="abaCurso" grow>
          <v-tab value="colaboradores">Colaboradores</v-tab>
          <v-tab value="avaliacoes">Avaliações</v-tab>
          <v-tab value="ia">Análise IA</v-tab>
        </v-tabs>
        <v-divider />

        <v-card-text class="pa-0" style="max-height:500px;overflow-y:auto;">
          <v-window v-model="abaCurso" class="pt-4">

            <!-- COLABORADORES -->
            <v-window-item value="colaboradores">
              <v-list class="px-2" density="comfortable">
                <template v-for="(c, i) in cursoDetail?.colaboradores || []" :key="i">
                  <v-list-item>
                    <v-list-item-title>{{ c.nome }}</v-list-item-title>

                    <template #append>
                      <v-chip :color="colorStatus(c.status)" rounded="xs" size="small" variant="outlined">
                        {{ c.status }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  <v-divider v-if="i < (cursoDetail?.colaboradores.length || 0) - 1" />
                </template>

                <v-list-item v-if="!(cursoDetail?.colaboradores?.length)">
                  <v-list-item-title class="text-center text-medium-emphasis py-6">
                    Nenhum colaborador encontrado.
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-window-item>

            <!-- AVALIACOES -->
            <v-window-item value="avaliacoes">
              <v-list class="pa-0" density="comfortable">
                <template v-for="(a, i) in cursoDetail?.avaliacoes || []" :key="i">
                  <v-list-item class="py-3">
                    <v-list-item-content>
                      <v-list-item-title class="font-italic text-body-1">
                        “{{ a.texto }}”
                      </v-list-item-title>
                      <v-list-item-subtitle class="mt-1 text-subtitle-2">
                        <strong>Colaborador:</strong> {{ a.colaborador }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider v-if="i < (cursoDetail?.avaliacoes.length || 0) - 1" />
                </template>

                <v-list-item v-if="!(cursoDetail?.avaliacoes?.length)">
                  <v-list-item-title class="text-center text-medium-emphasis py-6">
                    Nenhuma avaliação encontrada.
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-window-item>

            <!-- ANALISE IA -->
            <v-window-item value="ia">
              <div class="d-flex flex-column align-center w-100 pa-4">

                <v-btn v-if="!iaLoading && !iaResumo" color="primary" prepend-icon="mdi-robot" @click="analisarIA">
                  Gerar análise com IA
                </v-btn>

                <v-progress-circular
                  v-if="iaLoading"
                  class="my-6"
                  color="primary"
                  indeterminate
                  size="48"
                />

                <!-- RESULTADO -->
                <v-card v-if="iaResumo" class="w-100" elevation="1" rounded="lg">
                  <v-card-title class="pb-0 d-flex align-center gap-2">
                    <v-icon color="primary" icon="mdi-lightbulb-on-outline" />
                    <span class="text-h6">Insights da IA com base nas avaliações</span>
                  </v-card-title>

                  <v-divider />

                  <v-card-text class="text-body-1" style="white-space: pre-wrap;">
                    {{ iaResumo }}
                  </v-card-text>
                </v-card>
              </div>
            </v-window-item>

          </v-window>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogCurso = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import ApexChart from 'vue3-apexcharts'
  import HankingGamificacao from '../HankingGamificacao/HankingGamificacao.vue'

  import {
    analisarFeedbacks,
    listarColaboradoresTabela,
    listarCursosTabela,
    obterDetalheColaborador,
    obterDetalheCurso,
    obterEstatisticas,
    obterStatusMatriculas,
    obterTaxaConclusao,
  } from '@/services/Dashboard'

  import type {
    ColaboradorDetalheResponse,
    ColaboradorTabelaResponse,
    CursoDetalheResponse,
    CursoMatricula,
    CursoTabelaResponse,
    DashboardStatsResponse,
    StatusMatriculaResponse,
    TaxaConclusaoResponse,
  } from '@/types/dashboard/types'

  const apexchart = ApexChart

  const statsRaw = ref<DashboardStatsResponse | null>(null)
  const taxaRaw = ref<TaxaConclusaoResponse | null>(null)
  const statusRaw = ref<StatusMatriculaResponse | null>(null)

  const colaboradoresTabela = ref<ColaboradorTabelaResponse[]>([])
  const cursosTabela = ref<CursoTabelaResponse[]>([])

  const dialogColaborador = ref(false)
  const colaboradorSelecionado = ref<ColaboradorTabelaResponse | null>(null)
  const colaboradorDetail = ref<ColaboradorDetalheResponse | null>(null)
  const abaColaborador = ref<'cursos' | 'avaliacoes'>('cursos')

  const dialogCurso = ref(false)
  const cursoSelecionado = ref<CursoTabelaResponse | null>(null)
  const cursoDetail = ref<CursoDetalheResponse | null>(null)
  const abaCurso = ref<'colaboradores' | 'avaliacoes' | 'ia'>('colaboradores')

  const iaLoading = ref(false)
  const iaResumo = ref<string | null>(null)

  const estatisticas = computed(() => {
    if (!statsRaw.value) return []
    return [
      { rotulo: 'Colaboradores', valor: statsRaw.value.totalColaboradores, icone: 'mdi-account-multiple', cor: 'primary' },
      { rotulo: 'Cursos', valor: statsRaw.value.totalCursos, icone: 'mdi-school', cor: 'deep-purple' },
      { rotulo: 'Certificados', valor: statsRaw.value.totalCertificados, icone: 'mdi-certificate', cor: 'success' },
      { rotulo: 'Matrículas', valor: statsRaw.value.totalMatriculas, icone: 'mdi-clipboard-list', cor: 'info' },
    ]
  })
  const serieConclusao = computed(() => [taxaRaw.value?.taxaConclusao ?? 0])
  const serieStatus = computed(() =>
    statusRaw.value
      ? [statusRaw.value.concluido,
         statusRaw.value.emAndamento,
         statusRaw.value.naoIniciado]
      : []
  )

  const opcoesGraficoConclusao = {
    chart: { toolbar: { show: false } },
    plotOptions: {
      radialBar: {
        hollow: { size: '60%' },
        dataLabels: { value: { fontSize: '28px', formatter: (v: number) => `${v}%` } },
      },
    },
    labels: ['Conclusão'],
    theme: { monochrome: { enabled: true, color: '#1976d2' } },
  }
  const opcoesGraficoStatus = {
    labels: ['Concluído', 'Em andamento', 'Não iniciado'],
    legend: { position: 'bottom' },
  }

  const cabecalhosColaboradores = [
    { title: 'Nome', key: 'nome', sortable: true },
    { title: 'Departamento', key: 'departamento', sortable: true },
    { title: 'Cargo', key: 'cargo' },
    { title: 'Matrículas', key: 'totalMatriculas' },
    { title: '', key: 'acoes', sortable: false },
  ]
  const cabecalhosCursos = [
    { title: 'Título', key: 'titulo', sortable: true },
    { title: 'Categoria', key: 'categoria' },
    { title: 'Matrículas', key: 'totalMatriculas', sortable: true },
    { title: '', key: 'acoes', sortable: false },
  ]

  function colorStatus (status: CursoMatricula['status']) {
    switch (status) {
      case 'APROVADO': return 'success'
      case 'REPROVADO': return 'error'
      case 'EM_ANDAMENTO': return 'warning'
      default: return 'info'
    }
  }

  async function abrirDialogColaborador (item: ColaboradorTabelaResponse) {
    colaboradorSelecionado.value = item
    abaColaborador.value = 'cursos'
    colaboradorDetail.value = null
    dialogColaborador.value = true

    colaboradorDetail.value = await obterDetalheColaborador(item.id)
  }

  async function abrirDialogCurso (item: CursoTabelaResponse) {
    cursoSelecionado.value = item
    abaCurso.value = 'colaboradores'
    iaLoading.value = false
    iaResumo.value = null
    cursoDetail.value = null
    dialogCurso.value = true

    cursoDetail.value = await obterDetalheCurso(item.id)
  }

  async function analisarIA () {
    if (!cursoDetail.value?.avaliacoes?.length) {
      iaResumo.value = 'Não há comentários para analisar.'
      return
    }

    iaLoading.value = true
    iaResumo.value = null

    try {
      const comentarios = cursoDetail.value.avaliacoes.map(a => a.texto)

      iaResumo.value = await analisarFeedbacks({ comentarios })

    } catch (error) {
      console.error('Erro ao chamar análise IA:', error)
      iaResumo.value = 'Desculpe, não foi possível gerar a análise no momento.'
    } finally {
      iaLoading.value = false
    }
  }

  onMounted(async () => {
    statsRaw.value = await obterEstatisticas()
    taxaRaw.value = await obterTaxaConclusao()
    statusRaw.value = await obterStatusMatriculas()
    colaboradoresTabela.value = await listarColaboradoresTabela()
    cursosTabela.value = await listarCursosTabela()
  })
</script>

<template>
  <v-container class="pa-4" fluid>
    <v-row align="stretch" dense>
      <v-col cols="12" md="4">
        <v-card class="h-100 d-flex flex-column" elevation="2" rounded="lg">
          <v-sheet class="py-3 px-4 rounded-t-lg" color="primary">
            <span class="text-h6 font-weight-medium white--text">
              Parâmetros de Gamificação
            </span>
          </v-sheet>

          <v-list class="flex-grow-1 d-flex flex-column justify-space-between" density="compact">
            <v-list-item v-for="[chave, valor] in parametrosFiltrados" :key="chave" class="py-2">
              <v-list-item-content class="py-0">
                <div class="d-flex justify-space-between align-center">
                  <span class="font-weight-medium">{{ labels[chave] }}</span>

                  <v-chip color="primary" rounded="xs" size="small" text-color="white">
                    {{ valor }}
                  </v-chip>
                </div>

                <small class="text-medium-emphasis">
                  {{ descricoes[chave] }}
                </small>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col class="d-flex flex-column" cols="12" md="8">
        <HankingGamificacao class="flex-grow-1 mb-4" />

        <v-card class="pa-6 d-flex flex-column align-center" elevation="2" rounded="lg">
          <div class="d-flex align-center mb-2">
            <v-avatar class="elevation-3" size="64">
              <template v-if="fotoPerfil">
                <v-img cover :src="fotoPerfil" />
              </template>
              <template v-else>
                <v-icon color="secondary" size="40">mdi-account</v-icon>
              </template>
            </v-avatar>

            <span class="text-h5 font-weight-bold ml-4 mr-2">
              #{{ posicaoUsuario }}
            </span>
          </div>

          <small class="text-medium-emphasis text-center">
            Sua posição no ranking geral
          </small>
        </v-card>

      </v-col>
    </v-row>

    <v-row class="mt-4" dense>
      <v-col cols="12">
        <v-card
          class="pa-6 d-flex flex-column flex-sm-row justify-space-between align-center"
          elevation="2"
          rounded="lg"
        >
          <div class="d-flex align-center mb-4 mb-sm-0">
            <v-avatar class="mr-3" size="40">
              <template v-if="fotoPerfil">
                <v-img :src="fotoPerfil" />
              </template>
              <template v-else>
                <v-icon class="mr-3" color="primary" size="40">mdi-star-circle</v-icon>
              </template>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ pontuacaoAtual }}</div>
              <small class="text-medium-emphasis">Pontuação atual</small>
            </div>
          </div>

          <div class="d-flex align-center mb-4 mb-sm-0">
            <v-icon class="mr-3" color="secondary" size="40">mdi-trophy-award</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">#{{ posicaoUsuario }}</div>
              <small class="text-medium-emphasis">Posição no ranking</small>
            </div>
          </div>

          <div class="text-center text-sm-left" style="max-width:320px;">
            <v-icon class="mb-1" color="info" size="28">mdi-lightbulb-on-outline</v-icon>
            <p class="mb-0">
              Continue concluindo aulas e enviando feedbacks para se manter no ranking
              e ser recompensado!
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import HankingGamificacao from '@/components/HankingGamificacao/HankingGamificacao.vue'
  import { buscarParametrosAtuais, dadosRanking } from '@/services/ParametroGamificacaoService'
  import type { Parametros } from '@/types/parametro-gamificacao/types'

  const labels: Record<keyof Parametros, string> = {
    finalizarAula: 'Concluir Aula',
    finalizarModulo: 'Concluir Módulo',
    acertarQuestaoModulo: 'Acerto Módulo',
    acertarQuestaoFinal: 'Acerto Final',
    enviarFeedback: 'Enviar Feedback',
    aprovarModulo: 'Aprovar Módulo',
    aprovarFinal: 'Aprovar Final',
    reprovar: 'Penalidade Reprovar',
    completarNoPrazo: 'Bônus Prazo',
    id: '',
  }

  const descricoes: Record<keyof Parametros, string> = {
    finalizarAula: 'Pontuação ao concluir cada aula.',
    finalizarModulo: 'Bônus ao concluir um módulo.',
    acertarQuestaoModulo: 'Acertos nas questões do módulo.',
    acertarQuestaoFinal: 'Acertos na avaliação final.',
    enviarFeedback: 'Avaliar o curso ao final.',
    aprovarModulo: 'Nota mínima no módulo.',
    aprovarFinal: 'Passar na avaliação final.',
    reprovar: 'Desconto ao reprovar.',
    completarNoPrazo: 'Concluir no prazo.',
    id: '',
  }

  const parametros = ref<Parametros>({
    finalizarAula: 0,
    finalizarModulo: 0,
    acertarQuestaoModulo: 0,
    acertarQuestaoFinal: 0,
    enviarFeedback: 0,
    aprovarModulo: 0,
    aprovarFinal: 0,
    reprovar: 0,
    completarNoPrazo: 0,
  })

  const parametrosFiltrados = computed<[keyof Parametros, number][]>(() =>
    Object.entries(parametros.value).filter(([k]) => k !== 'id') as [keyof Parametros, number][]
  )

  const posicaoUsuario = ref(0)
  const pontuacaoAtual = ref(0)
  const fotoPerfil = ref('')

  onMounted(async () => {
    try {
      parametros.value = await buscarParametrosAtuais()
      const data = await dadosRanking()
      posicaoUsuario.value = data.posicaoUsuario
      pontuacaoAtual.value = data.pontuacaoAtual
      fotoPerfil.value = data.linkPerfil
    } catch { /* empty */ }
  })
</script>

<style lang="scss" scoped>
.v-list-item {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
</style>

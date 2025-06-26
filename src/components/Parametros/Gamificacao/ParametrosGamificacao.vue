<template>
  <v-container class="mx-auto px-4" fluid style="max-width:1180px;">
    <v-sheet
      class="d-flex align-center mb-8 px-6"
      color="info"
      height="140"
      rounded="lg"
    >
      <v-icon class="mr-4" color="white" size="48">mdi-trophy-award</v-icon>
      <div class="text-white">
        <h1 class="text-h5 font-weight-medium mb-1">Parâmetros de Gamificação</h1>
        <p class="text-subtitle-2 opacity-80">
          Ajuste a pontuação de cada atividade
        </p>
      </div>
    </v-sheet>

    <v-form ref="form" v-model="formOk">
      <v-row class="pa-0" dense>
        <template v-for="(campo, i) in campos" :key="i">
          <v-col class="mb-6" cols="12" md="4" sm="6">
            <v-card
              class="bg-grey-lighten-4 border pa-6 h-100 d-flex flex-column justify-space-between"
              elevation="0"
              rounded="lg"
            >
              <v-number-input
                v-model="parametros[campo.modelo]"
                class="mb-3"
                control-variant="stacked"
                hide-details
                :label="campo.label"
                :max="1000"
                :min="0"
                :step="campo.step ?? 10"
              />
              <small class="text-grey-darken-1">{{ campo.descricao }}</small>
            </v-card>
          </v-col>
        </template>
      </v-row>

      <div class="text-end mt-8">
        <v-btn
          color="info"
          :disabled="!formOk || loading"
          :loading="loading"
          size="large"
          @click="salvar"
        >
          <v-icon start>mdi-content-save</v-icon>
          Salvar alterações
        </v-btn>
      </div>
    </v-form>
  </v-container>
  <AvisoDialog v-model="avisoAberto" :texto="textoAviso" :tipo="tipoAviso" />
</template>

<script setup lang="ts">
  import { buscarParametrosAtuais, editarAtual } from '@/services/ParametroGamificacaoService'
  import type { Campo, Parametros } from '@/types/parametro-gamificacao/types'
  import { onMounted, ref } from 'vue'

  const avisoAberto = ref<boolean>(false)
  const tipoAviso = ref<'sucesso' | 'erro'>('sucesso')
  const textoAviso = ref<string>('Sucesso!')
  const loading = ref<boolean>(false)

  const parametros = ref<Parametros>({} as Parametros)

  const campos: Campo[] = [
    { modelo: 'finalizarAula', label: 'Finalizar aula', descricao: 'Pontuação ao concluir cada aula' },
    { modelo: 'finalizarModulo', label: 'Finalizar módulo', descricao: 'Pontuação ao concluir o módulo' },
    { modelo: 'acertarQuestaoModulo', label: 'Acertar questão (módulo)', descricao: 'Cada acerto nas questões do módulo', step: 1 },
    { modelo: 'acertarQuestaoFinal', label: 'Acertar questão (final)', descricao: 'Cada acerto na avaliação final', step: 1 },
    { modelo: 'enviarFeedback', label: 'Enviar feedback', descricao: 'Validar curso com feedback' },
    { modelo: 'aprovarModulo', label: 'Aprovar avaliação do módulo', descricao: 'Ao atingir nota mínima no módulo' },
    { modelo: 'aprovarFinal', label: 'Aprovar avaliação final', descricao: 'Nota mínima na prova final' },
    { modelo: 'reprovar', label: 'Penalidade ao reprovar', descricao: 'Desconto de pontos', step: 10 },
    { modelo: 'completarNoPrazo', label: 'Concluir curso no prazo', descricao: 'Bônus por terminar no tempo' },
  ]

  const formOk = ref(false)

  const salvar = async () => {
    if (!formOk.value) return
    loading.value = true

    try {
      const response = await editarAtual({ ...parametros.value, id: null })
      parametros.value = response?.content as Parametros

      tipoAviso.value = 'sucesso'
      textoAviso.value = response?.message || 'Sucesso'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
    }

    avisoAberto.value = true
    loading.value = false
  }

  const buscarParametros = async () => {
    loading.value = true
    try {
      const response = await buscarParametrosAtuais()
      parametros.value = response

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }
    loading.value = false
  }

  onMounted(async () => {
    buscarParametros()
  })

</script>

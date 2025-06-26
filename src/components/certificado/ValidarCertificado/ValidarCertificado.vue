<template>
  <v-container class="py-8 px-4" fluid>
    <v-row class="mb-6" justify="center">
      <v-col class="text-center" cols="12">
        <h3 class="text-h4 font-weight-medium mb-2">
          Validação de Certificados
        </h3>
        <p class="subtitle-2 text--secondary">
          Digite ou cole o código do certificado para verificar sua autenticidade
        </p>
      </v-col>
    </v-row>

    <v-row class="mb-8" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="pa-6" elevation="2">
          <v-form @submit.prevent="validar">
            <v-text-field
              v-model="tokenEntrada"
              class="mb-4"
              clearable
              :disabled="carregando"
              label="Código do Certificado"
              outlined
              required
            />
            <v-row justify="end">
              <v-btn
                class="px-6"
                color="primary"
                :disabled="!tokenEntrada || carregando"
                :loading="carregando"
                @click="validar"
              >
                Validar
              </v-btn>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="erro && !carregando" class="mb-8" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-alert class="py-4 px-6" dense type="error" variant="outlined">
          {{ erro }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-if="certificado && !carregando" class="mt-6" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card elevation="4">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Certificado Encontrado</v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pt-4">
            <v-row dense>
              <v-col class="text-h6" cols="12">{{ certificado.colaborador }}</v-col>
              <v-col cols="12"><strong>Curso:</strong> {{ certificado.curso }}</v-col>
              <v-col cols="12">
                <strong>Carga horária:</strong> {{ certificado.cargaHoraria }} h
              </v-col>
              <v-col cols="12"><strong>Empresa:</strong> {{ certificado.empresa }}</v-col>
              <v-col cols="12">
                <strong>Data de emissão:</strong> {{ certificado.dataEmissao }}
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn
              color="primary"
              :href="certificado.arquivoUrl"
              prepend-icon="mdi-download"
              target="_blank"
            >
              Baixar PDF
            </v-btn>
            <v-spacer />
            <v-chip color="secondary" variant="outlined">
              Código: {{ certificado.token }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { validarCertificado } from '@/services/CertificadoCervice'
  import type { CertificadoResponse } from '@/types/certificado/types'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const rota = useRoute()
  const roteador = useRouter()

  const idParametro = Number(rota.params.id)
  const tokenConsulta = (rota.query.t as string) ?? ''

  const carregando = ref(false)
  const erro = ref<string | null>(null)
  const certificado = ref<CertificadoResponse | null>(null)
  const tokenEntrada = ref<string>(tokenConsulta)

  async function validar () {
    if (!idParametro || !tokenEntrada.value) {
      erro.value = 'Informe um token válido.'
      certificado.value = null
      return
    }

    roteador.replace({
      name: rota.name as string,
      params: { id: idParametro },
      query: { t: tokenEntrada.value },
    })

    carregando.value = true
    erro.value = null
    certificado.value = null

    try {
      certificado.value = await validarCertificado(idParametro, tokenEntrada.value)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.response?.status === 404) {
        erro.value = 'Certificado não encontrado ou token inválido.'
      } else {
        erro.value = 'Erro ao validar certificado. Tente novamente.'
      }
    } finally {
      carregando.value = false
    }
  }


  onMounted(() => {
    if (tokenConsulta) validar()
  })
</script>

<style scoped>
.v-application .primary {
  background-color: #005b7f !important;
  color: #fff !important;
}
.v-application .secondary {
  border-color: #d4a019 !important;
  color: #d4a019 !important;
}
</style>

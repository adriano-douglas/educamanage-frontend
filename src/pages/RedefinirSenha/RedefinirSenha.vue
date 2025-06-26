<template>
  <v-row class="fill-height ma-0" no-gutters>
    <v-col
      class="d-flex flex-column align-center justify-center text-center bg-primary text-white"
      cols="12"
      md="6"
    >
      <h1 class="text-h3 font-weight-bold mb-4">Recuperar Acesso</h1>
      <p class="text-subtitle-1 mx-auto" style="max-width:300px">
        Insira seu CPF para receber o link.
      </p>
    </v-col>

    <v-col
      class="d-flex align-center justify-center bg-blue-lighten-5"
      cols="12"
      md="6"
    >
      <v-card
        class="pa-8 mx-4"
        elevation="6"
        max-width="460"
        rounded="xl"
        width="100%"
      >
        <v-card-title class="justify-center text-primary">
          <span class="text-h5">Redefinir Senha</span>
        </v-card-title>

        <v-form
          ref="formularioRecuperacao"
          v-slot="{ isValid }"
          @submit.prevent="processarRecuperacao"
        >
          <v-card-text>
            <v-text-field
              v-model="cpf"
              label="CPF"
              prepend-inner-icon="mdi-account"
              required
              :rules="[regras.obrigatorio]"
            />

            <v-btn
              block
              class="mb-4"
              color="primary"
              :disabled="!isValid"
              size="large"
              type="submit"
            >
              Enviar link de redefinição
            </v-btn>

            <div class="text-center">
              <RouterLink class="text-body-2 text-primary" to="/login">
                Voltar para Login
              </RouterLink>
            </div>
          </v-card-text>
        </v-form>
      </v-card>
    </v-col>
  </v-row>

  <v-snackbar
    v-model="snackbar.mostrar"
    :color="snackbar.cor"
    location="top right"
    :timeout="snackbar.tempo"
  >
    {{ snackbar.mensagem }}
  </v-snackbar>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { AuthService } from '@/services/AuthService'

  const roteador = useRouter()

  const cpf = ref('')
  const formularioRecuperacao = ref()

  const regras = {
    obrigatorio: (v: string) => !!v || 'Campo obrigatório.',
  }

  const snackbar = ref({
    mostrar: false,
    mensagem: '',
    cor: 'success' as 'success' | 'error',
    tempo: 4000,
  })

  const redirecionarPara = ref<string | null>(null)

  function mostrarSnack (
    msg: string,
    cor: 'success' | 'error' = 'success',
    tempo = 4000,
  ) {
    snackbar.value = { mostrar: true, mensagem: msg, cor, tempo }
  }

  watch(
    () => snackbar.value.mostrar,
    aberto => {
      if (!aberto && redirecionarPara.value) {
        roteador.push(redirecionarPara.value)
        redirecionarPara.value = null
      }
    },
  )

  async function processarRecuperacao () {
    const { valid } = await formularioRecuperacao.value.validate()
    if (!valid) {
      mostrarSnack('Preencha o CPF.', 'error')
      return
    }

    try {
      await AuthService.solicitarRedefinicaoSenha({ cpf: cpf.value })
      mostrarSnack('Link enviado por e-mail.', 'success', 4000)
      redirecionarPara.value = '/login'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      mostrarSnack(
        erro.response?.data?.message ?? 'Erro inesperado', 'error',
      )
    }
  }
</script>

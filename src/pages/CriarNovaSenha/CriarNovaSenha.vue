<template>
  <v-row class="fill-height ma-0" no-gutters>
    <v-col
      class="d-flex flex-column align-center justify-center text-center bg-primary text-white"
      cols="12"
      md="6"
    >
      <h1 class="text-h3 font-weight-bold mb-4">Definir Nova Senha</h1>
      <p class="text-subtitle-1 mx-auto" style="max-width:300px">
        Escolha uma senha segura para sua conta.
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
          <span class="text-h5">Nova Senha</span>
        </v-card-title>

        <v-form
          ref="formularioSenha"
          v-slot="{ isValid }"
          @submit.prevent="processarEnvio"
        >
          <v-card-text>
            <v-text-field
              v-model="novaSenha"
              label="Nova Senha"
              prepend-inner-icon="mdi-lock"
              required
              :rules="[regras.obrigatorio]"
              type="password"
            />
            <v-text-field
              v-model="confirmarSenha"
              label="Confirmar Senha"
              prepend-inner-icon="mdi-lock-check"
              required
              :rules="[regras.obrigatorio, regras.coincide]"
              type="password"
            />

            <v-btn
              block
              color="primary"
              :disabled="!isValid"
              size="large"
              type="submit"
            >
              Salvar
            </v-btn>
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
  import { onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { AuthService } from '@/services/AuthService'

  const rota = useRoute()
  const roteador = useRouter()

  const token = ref<string | null>(null)

  const novaSenha = ref('')
  const confirmarSenha = ref('')
  const formularioSenha = ref()

  const regras = {
    obrigatorio: (v: string) => !!v || 'Campo obrigatório.',
    coincide:    (v: string) => v === novaSenha.value || 'As senhas não coincidem.',
  }

  const snackbar = ref({
    mostrar : false,
    mensagem: '',
    cor     : 'success' as 'success' | 'error',
    tempo   : 4000,
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

  onMounted(() => {
    token.value = rota.query.token?.toString() ?? null
  })

  async function processarEnvio () {
    const { valid } = await formularioSenha.value.validate()
    if (!valid) return

    try {
      if (token.value) {
        await AuthService.redefinirSenhaComToken({
          token: token.value,
          novaSenha: novaSenha.value,
        })
      } else {
        await AuthService.redefinirSenha({
          novaSenha: novaSenha.value,
          cpf: '',
        })
      }

      mostrarSnack('Senha redefinida com sucesso.', 'success', 1000)
      redirecionarPara.value = '/login'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      mostrarSnack(
        erro.response?.data?.message ?? 'Erro inesperado',
        'error',
        4000,
      )
    }
  }
</script>

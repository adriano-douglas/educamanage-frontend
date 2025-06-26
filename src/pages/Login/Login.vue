<template>
  <v-row class="fill-height ma-0" no-gutters>
    <v-col
      class="d-flex flex-column align-center justify-center text-center bg-primary text-white"
      cols="12"
      md="6"
    >
      <h1 class="text-h3 font-weight-bold mb-4">Bem-vindo!</h1>
      <p class="text-subtitle-1 mx-auto" style="max-width:300px">
        Acesse sua conta com CPF e senha.
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
          <span class="text-h5">Login</span>
        </v-card-title>

        <v-form ref="formularioLogin" v-slot="{ isValid }" @submit.prevent="enviarLogin">
          <v-card-text>
            <v-text-field
              v-model="cpf"
              v-maska="'###.###.###-##'"
              autocomplete="username"
              label="CPF"
              maxlength="14"
              prepend-inner-icon="mdi-account"
              required
              :rules="[regras.obrigatorio, regras.cpf]"
            />

            <v-text-field
              v-model="senha"
              autocomplete="current-password"
              label="Senha"
              prepend-inner-icon="mdi-lock"
              required
              :rules="[regras.obrigatorio]"
              type="password"
            />

            <div class="text-right mb-4">
              <RouterLink class="text-body-2 text-primary" to="/redefinir-senha">
                Esqueceu a senha?
              </RouterLink>
            </div>

            <v-btn
              block
              color="primary"
              :disabled="!isValid"
              size="large"
              type="submit"
            >
              Entrar
            </v-btn>
          </v-card-text>
        </v-form>
      </v-card>
    </v-col>
  </v-row>

  <v-snackbar
    v-model="snackbar.exibir"
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
  import { cpf as cpfValidador } from 'cpf-cnpj-validator'

  const rota = useRoute()
  const roteador = useRouter()

  const cpf = ref('')
  const senha = ref('')
  const formularioLogin = ref()

  const regras = {
    obrigatorio: (v: string) => !!v || 'Campo obrigatório.',
    cpf:         (v: string) => cpfValidador.isValid(v) || 'CPF inválido.',
  }

  const snackbar = ref({ exibir:false, mensagem:'', cor:'success', tempo:4000 })
  const redirecionarDepois = ref<string|null>(null)

  function mostrarSnack (
    msg: string,
    cor: 'success' | 'error' = 'success',
    tempo = 4000
  ){
    snackbar.value = { exibir:true, mensagem:msg, cor, tempo }
  }

  watch(() => snackbar.value.exibir, aberto => {
    if (!aberto && redirecionarDepois.value){
      roteador.push(redirecionarDepois.value)
      redirecionarDepois.value = null
    }
  })

  onMounted(async () => {
    const token = rota.query.token?.toString() ?? null
    if (!token) return

    try {
      const resp = await AuthService.validarCodigo({ codigo: token, cpf: '' })
      if (resp.message === 'Código validado com sucesso.') {
        mostrarSnack(resp.message, 'success', 3000)
        redirecionarDepois.value = '/criar-nova-senha'
      } else {
        mostrarSnack('Token inválido ou expirado.', 'error', 2500)
        redirecionarDepois.value = '/login'
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      mostrarSnack(e.response?.data?.message ?? 'Erro inesperado', 'error', 2500)
      redirecionarDepois.value = '/login'
    }
  })

  async function enviarLogin (){
    const { valid } = await formularioLogin.value.validate()
    if (!valid){
      mostrarSnack('Preencha todos os campos corretamente.', 'error')
      return
    }

    try {
      const resp = await AuthService.login({ cpf: cpf.value.replace(/\D/g, ''), senha: senha.value })

      if (resp.jwtToken) localStorage.setItem('jwtToken', resp.jwtToken)

      mostrarSnack(resp.message as string, 'success', 2000)

      if (resp.message === 'Login realizado com sucesso.') {
        redirecionarDepois.value = '/home'
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      mostrarSnack(e.response?.data?.message ?? 'Erro inesperado', 'error')
    }
  }
</script>

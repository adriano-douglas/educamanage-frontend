import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import router from '@/router'

export interface Usuario {
  nome: string
  avatarUrl: string
  papeis: string[]
}

export const useUsuarioStore = defineStore('usuario', () => {
  const usuario = ref<Usuario>({
    nome: '',
    avatarUrl: '',
    papeis: [],
  })

  const ehAdministrador = computed(() => usuario.value.papeis.includes('ADMINISTRADOR'))
  const ehColaborador = computed(() => usuario.value.papeis.includes('COLABORADOR'))
  const rotulosPapeis = computed(() =>
    usuario.value.papeis.map(p => p.toUpperCase()).join(' / ')
  )

  function definirUsuario (dados: Usuario) {
    usuario.value = { ...dados }
  }

  function limparUsuario () {
    usuario.value = {
      nome: '',
      avatarUrl: '',
      papeis: [],
    }
  }

  async function sair () {
    localStorage.removeItem('jwtToken')

    limparUsuario()

    router.push({ name: 'login' })
  }

  return {
    // state
    usuario,

    // getters
    ehAdministrador,
    ehColaborador,
    rotulosPapeis,

    // acoes
    definirUsuario,
    limparUsuario,
    sair,
  }
})

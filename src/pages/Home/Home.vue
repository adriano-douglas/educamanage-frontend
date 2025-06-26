<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="rail = !rail" />

    <v-app-bar-title>EducaManage</v-app-bar-title>
    <v-spacer />

    <div class="d-flex align-center">
      <div class="user-info mr-3 text-right">
        <div class="font-weight-medium text-subtitle-1">
          {{ usuarioStore.usuario.nome }}
        </div>
        <div class="text-caption">
          {{ rolesExibidos.join(', ') }}
        </div>
      </div>

      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn class="mr-3" icon v-bind="props">
            <v-avatar size="40">
              <template v-if="usuarioStore.usuario.avatarUrl">
                <v-img :src="usuarioStore.usuario.avatarUrl" />
              </template>
              <template v-else>
                <v-icon>mdi-account</v-icon>
              </template>
            </v-avatar>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item
            link
            prepend-icon="mdi-logout"
            title="Sair"
            @click="logout"
          />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    permanent
    :rail="rail"
  >
    <v-list class="pt-5 pb-5" nav>
      <template v-for="item in menuItems" :key="item.to">
        <v-list-item
          v-if="podeVer(item)"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
        />
      </template>

      <v-list-group
        v-if="podeVer({ roles: ['ADMINISTRADOR'] } as any)"
        nav
      >
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-cog" title="Parâmetros" />
        </template>
        <v-list-item
          v-if="podeVer({ roles: ['ADMINISTRADOR'] } as any)"
          prepend-icon="mdi-gamepad-variant"
          title="Gamificação"
          to="/parametros/gamificacao"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <v-main class="ma-5 pa-0">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useUsuarioStore } from '@/store/UsuarioStore'
  import { buscarUsuarioAutenticado } from '@/services/UsuarioService'

  const drawer = ref(true)
  const rail = ref(false)

  const usuarioStore = useUsuarioStore()

  const papeisUsuario = computed<string[]>(() => usuarioStore.usuario.papeis || [])

  interface MenuItem {
    title: string
    icon: string
    to: string
    roles: string[]
  }

  const menuItems: MenuItem[] = [
    { title: 'Home', icon: 'mdi-home-city', to: '/home', roles: ['COLABORADOR', 'ADMINISTRADOR'] },
    { title: 'Ranking', icon: 'mdi-trophy-award', to: '/ranking', roles: ['COLABORADOR', 'ADMINISTRADOR'] },
    { title: 'Meus Cursos',icon: 'mdi-bookmark-box-multiple', to: '/meus-cursos', roles: ['COLABORADOR', 'ADMINISTRADOR'] },
    { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard', roles: ['ADMINISTRADOR'] },
    { title: 'Colaboradores', icon: 'mdi-account-group-outline',to: '/colaboradores', roles: ['ADMINISTRADOR'] },
    { title: 'Cursos', icon: 'mdi-library', to: '/cursos', roles: ['ADMINISTRADOR'] },
  ]

  const rolesExibidos = computed<string[]>(() => {
    const roles = papeisUsuario.value
    return roles.includes('ADMINISTRADOR') ? ['ADMINISTRADOR'] : roles
  })

  function podeVer (item: MenuItem): boolean {
    return item.roles.some(role => papeisUsuario.value.includes(role))
  }

  async function logout () {
    try {
      await usuarioStore.sair()
    } catch (err) {
      console.error('Erro ao efetuar logout', err)
    }
  }

  onMounted(async () => {
    try {
      const usuario = await buscarUsuarioAutenticado()
      usuarioStore.definirUsuario(usuario)
    } catch (error) {
      console.error('Erro ao buscar dados do usuário autenticado', error)
    }
  })
</script>

<style scoped>
.user-info {
  line-height: 1.2;
}
.text-subtitle-1 {
  font-size: 1.25rem;
}
.text-caption {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>

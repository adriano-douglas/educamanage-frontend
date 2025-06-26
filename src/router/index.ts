/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import ValidarCertificado from '@/components/certificado/ValidarCertificado/ValidarCertificado.vue'
import CadastroColaboradores from '@/components/Colaboradores/Colaboradores.vue'
import CursoDetalhe from '@/components/CursoDetalhe/CursoDetalhe.vue'
import Cursos from '@/components/Cursos/Cursos.vue'
import Dashboard from '@/components/Dashboard/Dashboard.vue'
import HomeComponent from '@/components/Home/HomeComponent.vue'
import MeusCursos from '@/components/Meus Cursos/MeusCursos.vue'
import ParametrosGamificacao from '@/components/Parametros/Gamificacao/ParametrosGamificacao.vue'
import Ranking from '@/components/Ranking/Ranking.vue'
import CriarNovaSenha from '@/pages/CriarNovaSenha/CriarNovaSenha.vue'
import Home from '@/pages/Home/Home.vue'
import Login from '@/pages/Login/Login.vue'
import RedefinirSenha from '@/pages/RedefinirSenha/RedefinirSenha.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/home', // Rota padrão (quando acessar '/')
        name: 'Home',
        component: HomeComponent,
      },
      {
        path: '/ranking',
        name: 'ranking',
        component: Ranking,
      },
      {
        path: '/curso/matricula/:id(\\d+)',
        name: 'curso-detalhe',
        component: CursoDetalhe,
      },
      {
        path: 'meus-cursos',
        name: 'MeusCursos',
        component: MeusCursos,
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'colaboradores',
        name: 'Colaboradores',
        component: CadastroColaboradores,
      },
      {
        path: 'cursos',
        name: 'Cursos',
        component: Cursos,
      },
      {
        path: '/parametros/gamificacao',
        name: 'parametros-gamificacao',
        component: ParametrosGamificacao,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/redefinir-senha',
    name: 'redefinir-senha',
    component: RedefinirSenha,
  },
  {
    path: '/criar-nova-senha',
    name: 'criar-nova-senha',
    component: CriarNovaSenha,
  },
  {
    path: '/certificados/valida/:id(\\d+)',
    name: 'certificado-validacao',
    component: ValidarCertificado,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router

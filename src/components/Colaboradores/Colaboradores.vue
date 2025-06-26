<template>
  <v-container class="pa-0 mt-5 pa-3">
    <v-sheet class="d-flex align-center	justify-space-between">
      <h1 class="text-h5 text-grey-darken-2">Colaboradores</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" variant="elevated" @click="dialogCadastroAberto = true">
        Cadastrar
      </v-btn>
    </v-sheet>

    <FormularioCadastroDialog
      v-model="dialogCadastroAberto"
      :items="{ setor: opcoesSetores, cargo: opcoesCargos }"
      @salvar="handleSalvarCadastro"
    />

    <FormularioEdicaoDialog
      v-model="dialogEdicaoAberto"
      :dados-formulario="dadosColaboradorEdicao"
      :items="{ setor: opcoesSetores, cargo: opcoesCargos }"
      :loading-dados="loadingDadosEdicao"
      @salvar="handleSalvarEdicao"
    />

    <FormularioFiltroPanel
      class="my-12"
      :items="{ setor: opcoesSetores, cargo: opcoesCargos }"
      @filtrar="handleFiltrar"
    />

    <Tabela
      :loading="loadingColaboradores"
      :server-items="colaboradores"
      :total-items="colaboradoresPage?.page?.totalElements"
      @detalhar="handleDetalhar"
      @editar="handleEditar"
      @excluir="handleExcluir"
      @update-options="handleUpdateOptions"
    />
  </v-container>

  <Detalhes
    v-model="dialogDetalhesAberto"
    :dados-colaborador="dadosColaboradorDetalhar"
    :loading-dados="loadingDetalhar"
  />
  <ConfirmarExclusaoDialog v-model="dialogExclusaoAberto" @excluir="handleConfirmarExclusao" />
  <AvisoDialog v-model="avisoAberto" :texto="textoAviso" :tipo="tipoAviso" />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import FormularioCadastroDialog from './FormularioCadastroDialog/FormularioCadastroDialog.vue';
  import Tabela from './Tabela/Tabela.vue';
  import FormularioFiltroPanel from './FormularioFiltroPanel/FormularioFiltroPanel.vue';
  import AvisoDialog from '../AvisoDialog/AvisoDialog.vue';
  import { buscarPorId, cadastrarColetivo, cadastrarIndividual, editar, excluir, filtrarColaboradores } from '@/services/ColaboradorService';
  import { onMounted } from 'vue';
  import FormularioEdicaoDialog from './FormularioEdicaoDialog/FormularioEdicaoDialog.vue';
  import type { DadosColaboradorResponse } from '@/types/colaborador/DadosColaboradorResponse';
  import ConfirmarExclusaoDialog from '../ConfirmarExclusaoDialog/ConfirmarExclusaoDialog.vue';
  import Detalhes from './Detalhes/Detalhes.vue';
  import type { SetorResponse } from '@/types/setor/SetorResponse';
  import type { CargoResponse } from '@/types/cargo/CargoResponse';
  import { buscarTodosSetores } from '@/services/SetorService';
  import { buscarTodosCargos } from '@/services/CargoService';

  const dialogDetalhesAberto = ref<boolean>(false)
  const dialogExclusaoAberto = ref<boolean>(false)
  const dialogCadastroAberto = ref<boolean>(false)
  const dialogEdicaoAberto = ref<boolean>(false)
  const avisoAberto = ref<boolean>(false)
  const tipoAviso = ref<'sucesso' | 'erro'>('sucesso')
  const textoAviso = ref<string>('Sucesso!')

  const setores = ref<SetorResponse[]>([])
  const opcoesSetores = computed(() => setores.value.map(setor => setor.descricao))
  const cargos = ref<CargoResponse[]>([])
  const opcoesCargos = computed(() => cargos.value.map(cargo => cargo.descricao))

  const colaboradoresPage = ref()
  const loadingColaboradores = ref<boolean>(true)
  const colaboradores = computed(() => colaboradoresPage.value?.content || [])
  const urlFiltros = ref<string>()
  const page = ref<number>()
  const itemsPerPage = ref<number>()
  const urlFiltrosComPaginacao = computed<string>(() => {
    return `?page=${page.value}&size=${itemsPerPage.value}${urlFiltros.value || ''}`
  })

  const colaboradorSelecionado = ref<{ idColaborador: number }>({ idColaborador: 0 })
  const dadosColaboradorEdicao = ref<DadosColaboradorResponse>()
  const loadingDadosEdicao = ref<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadingExcluir = ref<boolean>(true)
  const dadosColaboradorDetalhar = ref<DadosColaboradorResponse>()
  const loadingDetalhar = ref<boolean>(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSalvarCadastro = async (data: any) => {
    let formData = new FormData()
    const tipo = data.tipo
    const payload = data.payload

    if (tipo === 'individual') {
      formData = new FormData()
      formData.append('nome', payload.nome)
      formData.append('email', payload.email)
      formData.append('cpf', payload.cpf)
      formData.append('dataNascimento', payload.dataNascimento)
      formData.append('celular', payload.celular)
      if (payload.fotoPerfil)
        formData.append('fotoPerfil', payload.fotoPerfil, payload.fotoPerfil.name)
      formData.append('matricula', payload.matricula)
      formData.append('dataAdmissao', payload.dataAdmissao)
      formData.append('emailCorporativo', payload.emailCorporativo)
      formData.append('setor', payload.setor)
      formData.append('cargo', payload.cargo)
      formData.append('funcao', payload.funcao)
      formData.append('roles', payload.roles)

      try {
        const response = await cadastrarIndividual(formData)

        tipoAviso.value = 'sucesso'
        textoAviso.value = response?.message || 'Sucesso'
        avisoAberto.value = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        tipoAviso.value = 'erro'
        textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
        avisoAberto.value = true
      }

    } else if (tipo === 'coletivo') {
      formData = new FormData()
      if (payload.arquivoCsv)
        formData.append('arquivo', payload.arquivoCsv, payload.arquivoCsv.name)

      try {
        const response = await cadastrarColetivo(formData)

        tipoAviso.value = 'sucesso'
        textoAviso.value = response?.message || 'Sucesso'
        avisoAberto.value = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        tipoAviso.value = 'erro'
        textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
        avisoAberto.value = true
      }

    }
    buscarColaboradores()
    dialogCadastroAberto.value = false
    console.log(formData.values())
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSalvarEdicao = async (data: any) => {
    const formData = new FormData()
    formData.append('nome', data.nome)
    formData.append('email', data.email)
    formData.append('cpf', data.cpf)
    formData.append('dataNascimento', data.dataNascimento)
    formData.append('celular', data.celular)
    if (data.fotoPerfil)
      formData.append('fotoPerfil', data.fotoPerfil, data.fotoPerfil.name)
    formData.append('matricula', data.matricula)
    formData.append('dataAdmissao', data.dataAdmissao)
    formData.append('emailCorporativo', data.emailCorporativo)
    formData.append('setor', data.setor)
    formData.append('cargo', data.cargo)
    formData.append('funcao', data.funcao)
    formData.append('roles', data.roles)


    loadingDadosEdicao.value = true
    try {
      const idColaborador = colaboradorSelecionado.value?.idColaborador
      const response = await editar(idColaborador, formData)
      console.log(data)

      tipoAviso.value = 'sucesso'
      textoAviso.value = response?.message || 'Sucesso'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
    }
    buscarColaboradores()
    avisoAberto.value = true
    loadingDadosEdicao.value = false
    dialogEdicaoAberto.value = false
  }

  const handleEditar = (item: { idColaborador: number }) => {
    colaboradorSelecionado.value = item
    dialogEdicaoAberto.value = true;
    buscarColaboradorEdicaoPorId(item?.idColaborador)
    console.log(item)
  }

  const handleExcluir = (item: { idColaborador: number }) => {
    colaboradorSelecionado.value = item
    dialogExclusaoAberto.value = true
    console.log(item)
  }

  const handleDetalhar = (item: { idColaborador: number }) => {
    if (colaboradorSelecionado?.value?.idColaborador !== item?.idColaborador)
      dadosColaboradorDetalhar.value = undefined
    colaboradorSelecionado.value = item
    dialogDetalhesAberto.value = true
    buscarColaboradorDetalhesPorId(item?.idColaborador)
    console.log(item)
  }

  const handleConfirmarExclusao = async () => {
    try {
      const idColaborador = colaboradorSelecionado.value?.idColaborador
      const response = await excluir(idColaborador)

      tipoAviso.value = 'sucesso'
      textoAviso.value = response?.message || 'Sucesso'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
    }
    buscarColaboradores()
    avisoAberto.value = true
    loadingDadosEdicao.value = false
    dialogExclusaoAberto.value = false
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFiltrar = async (payload: any) => {
    urlFiltros.value = payload.filtroUrl

    await buscarColaboradores()

    console.log(urlFiltros.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateOptions = async (options: any) => {
    page.value = options.page - 1
    itemsPerPage.value = options.itemsPerPage

    await buscarColaboradores()

    console.log(options)
  }

  const buscarColaboradorDetalhesPorId = async (idColaborador: number) => {
    loadingDetalhar.value = true
    try {
      dadosColaboradorDetalhar.value = await buscarPorId(idColaborador);
      console.log(dadosColaboradorDetalhar.value)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }
    loadingDetalhar.value = false
  }

  const buscarColaboradorEdicaoPorId = async (idColaborador: number) => {
    loadingDadosEdicao.value = true
    try {
      dadosColaboradorEdicao.value = await buscarPorId(idColaborador);
      console.log(dadosColaboradorEdicao.value)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }
    loadingDadosEdicao.value = false
  }

  const buscarColaboradores = async () => {
    loadingColaboradores.value = true
    try {
      const response = await filtrarColaboradores(urlFiltrosComPaginacao.value)

      colaboradoresPage.value = response
      console.log(response)
    } catch (error) {
      console.error(error)
    }
    loadingColaboradores.value = false
  }

  const buscarSetores = async () => {
    try {
      const response = await buscarTodosSetores()

      setores.value = response
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  const buscarCargos = async () => {
    try {
      const response = await buscarTodosCargos()

      cargos.value = response
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(async () => {

    buscarSetores()
    buscarCargos()

  })

</script>

<style lang="scss" scoped></style>

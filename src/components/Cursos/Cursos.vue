<template>
  <v-container class="pa-8" fluid>
    <CursoLista
      @alternar-ativo-curso="handleAlternarAtivoCurso"
      @deletar-curso="handleDeletarCurso"
      @editar-curso="handleEditarCurso"
      @novo-curso="handleNovoCurso"
      @visualizar-curso="handleVisualizarCurso"
    />

    <CursoDialog
      v-model:open-local="cursoDialogAberto"
      v-model:step-local="step"
      :editando="editando"
      :loading-salvar-rascunho="loadingSalvarRascunho"
      :visualizando="isVisualizando"
      @deletar-aula="handleDeletarAula"
      @deletar-modulo="handleDeletarModulo"
      @editar-modulo="handleEditarModulo"
      @novo-modulo="handleNovoModulo"
      @publicar="handlePublicar"
      @salvar-aula="handleSalvarAula"
      @salvar-rascunho="handleSalvarRascunho"
    />
  </v-container>
  <ConfirmarExclusaoDialog
    v-model="dialogExclusaoAberto"
    :texto="textoExclusao"
    @excluir="handleConfirmarExclusao"
  />
  <AvisoDialog v-model="avisoAberto" :texto="textoAviso" :tipo="tipoAviso" />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import type { Aula, Curso, Modulo } from '../../types/curso/types'
  import CursoLista from '@/components/Cursos/CursoLista/CursoLista.vue'
  import CursoDialog from '@/components/Cursos/CursoDialog/CursoDialog.vue'
  import { useCursoStore } from '@/store/CursoStore'
  import { buscarPorId, buscarTodos, cadastrar, editarCurso, excluir, publicarCurso, toggleStatusCurso } from '@/services/CursoService'
  import { storeToRefs } from 'pinia'
  import ConfirmarExclusaoDialog from '../ConfirmarExclusaoDialog/ConfirmarExclusaoDialog.vue'
  import { cadastrarModulo, editarModulo, excluirModulo } from '@/services/ModuloService'
  import { cadastrarAulaComUpload, editarAulaComUpload, excluirAula } from '@/services/AulaService'
  import AvisoDialog from '../AvisoDialog/AvisoDialog.vue'

  const cursoStore = useCursoStore()
  const { novoCurso, novoModulo, cursoSelecionado } = storeToRefs(cursoStore)

  onMounted(async () => {
    const cursos = await buscarTodos()
    cursoStore.setCursos(cursos)
  })

  const tipoExclusao = ref<'curso' | 'modulo' | 'aula'>('curso')
  const moduloExcluir = ref<{ moduloId: number }>()
  const aulaExcluir = ref<{ moduloId: number, aulaId: number }>()

  const avisoAberto = ref<boolean>(false)
  const tipoAviso = ref<'sucesso' | 'erro'>('sucesso')
  const textoAviso = ref<string>('Sucesso!')

  const cursoDialogAberto = ref<boolean>(false)
  const dialogExclusaoAberto = ref<boolean>(false)
  const textoExclusao = ref<string>('')
  const step = ref(1)
  watch(step, (novo, antigo) => {
    console.log(`Mudou de ${antigo} → ${novo}`)
  })
  const editando = ref(false)
  const isVisualizando = ref(false)
  const loadingSalvarRascunho = ref(false)

  const handleNovoCurso = () => {
    cursoStore.selecionarCurso(0)
    editando.value = false
    isVisualizando.value = false
    cursoDialogAberto.value = true
    step.value = 1
  }

  const handleEditarCurso = async (curso: Curso) => {
    cursoStore.selecionarCurso(curso.id)
    editando.value = true
    isVisualizando.value = false
    cursoDialogAberto.value = true
    step.value = 1
    const cursoSelecionado = (await buscarPorId(curso.id))
    cursoStore.atualizarCurso(cursoSelecionado)
  }

  const handleDeletarCurso = (curso: Curso) => {
    cursoStore.selecionarCurso(curso.id)
    tipoExclusao.value = 'curso'
    textoExclusao.value = 'Excluir este curso e todo o seu conteúdo?'
    dialogExclusaoAberto.value = true
  }

  const handleVisualizarCurso = async (curso: Curso) => {
    isVisualizando.value = true
    editando.value = false
    cursoStore.selecionarCurso(curso.id)
    try {
      const data = await buscarPorId(curso.id)
      cursoStore.atualizarCurso(data)
      step.value = 4 // etapa de revisão
      cursoDialogAberto.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }
  }

  const handleAlternarAtivoCurso = async (curso: Curso) => {
    try {
      cursoStore.selecionarCurso(curso.id)
      cursoStore.toggleAtivoLocal()
      const response = await toggleStatusCurso(curso.id)
      const cursoAtualizado = response.content as Curso
      cursoStore.atualizarCurso(cursoAtualizado)

      tipoAviso.value = 'sucesso'
      textoAviso.value = response?.message || 'Sucesso'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
    }
    avisoAberto.value = true
  }

  const handleNovoModulo = async (titulo: string) => {
    console.log('Novo Modulo')

    const dataNovoModulo = new FormData()
    dataNovoModulo.append('idCurso', cursoSelecionado.value?.id?.toString() as string)
    dataNovoModulo.append('titulo', titulo as string)

    cursoStore.adicionarModulo(titulo)

    try {
      const response = await cadastrarModulo(dataNovoModulo)
      const moduloAtualizado = response.content as Modulo
      cursoStore.atualizarPropriedadeModulo(novoModulo.value?.id as number, 'id', moduloAtualizado.id)
      cursoStore.atualizarModulo(moduloAtualizado)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }

    cursoStore.setNovoModulo(null)
  }

  const handleEditarModulo = async (valor: { moduloId: number, novoTitulo: string }) => {
    console.log('Editar Modulo')

    const novosDadosModulo = new FormData()
    novosDadosModulo.append('titulo', valor?.novoTitulo as string)

    try {
      const response = await editarModulo(valor.moduloId, novosDadosModulo)
      const moduloAtualizado = response.content as Modulo
      cursoStore.atualizarModulo(moduloAtualizado)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }
  }

  const handleDeletarModulo = (valor: { moduloId: number }) => {
    moduloExcluir.value = valor
    tipoExclusao.value = 'modulo'
    textoExclusao.value = 'Excluir este módulo e todas as aulas dentro dele?'
    dialogExclusaoAberto.value = true
  }

  interface AulaPayload {
    aula: Aula
    formData: FormData
    moduloId: number
    aulaId: number | null
  }

  const handleSalvarAula = async ({
    aula,
    formData,
    moduloId,
    aulaId,
  }: AulaPayload) => {
    console.log('Salvar Aula', aula, formData)

    if (aulaId === null) {
      const aulaTemp = cursoStore.adicionarAula(moduloId, aula) as Aula

      try {
        const { content: aulaSalva } = await cadastrarAulaComUpload(formData)
        cursoStore.atualizarPropriedadeAula(
          aulaTemp.id,
          'id',
          (aulaSalva as Aula).id,
          moduloId
        )
        cursoStore.atualizarAula(aulaSalva as Aula, moduloId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        cursoStore.removerAula(aulaTemp.id, moduloId)
        tipoAviso.value = 'erro'
        textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
        avisoAberto.value = true
      }

      return
    }

    cursoStore.atualizarAula(aula, moduloId)

    try {
      const { content: aulaAtualizada } = await editarAulaComUpload(aulaId, formData)
      cursoStore.atualizarAula(aulaAtualizada as Aula, moduloId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value =
        error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }
  }

  const handleDeletarAula = (valor: { moduloId: number, aulaId: number }) => {
    aulaExcluir.value = valor
    tipoExclusao.value = 'aula'
    textoExclusao.value = 'Excluir esta aula?'
    dialogExclusaoAberto.value = true
  }

  const handlePublicar = async () => {
    try {
      const response = await publicarCurso(cursoSelecionado.value?.id as number)
      const cursoAtualizado = response.content as Curso
      cursoStore.atualizarCurso(cursoAtualizado)

      tipoAviso.value = 'sucesso'
      textoAviso.value = response?.message || 'Sucesso'
      cursoDialogAberto.value = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
    }
    avisoAberto.value = true
  }

  // eslint-disable-next-line complexity
  const handleSalvarRascunho = async () => {
    console.log('Salvar Rascunho Curso')
    loadingSalvarRascunho.value = true
    if (!editando.value) {
      const dataNovoCurso = new FormData()
      dataNovoCurso.append('titulo', novoCurso.value?.titulo as string)
      dataNovoCurso.append('imagemCover', novoCurso.value?.imagemCover as File, novoCurso.value?.imagemCover?.name)
      dataNovoCurso.append('descricao', novoCurso.value?.descricao as string)
      dataNovoCurso.append('categoriaId', novoCurso.value?.categoriaId as unknown as string)
      dataNovoCurso.append('diasParaConcluir', novoCurso.value?.diasParaConcluir as unknown as string)
      dataNovoCurso.append('cargaHoraria', novoCurso.value?.cargaHoraria as unknown as string)

      cursoStore.adicionarCurso(novoCurso.value as Curso)
      editando.value = true

      try {
        const response = await cadastrar(dataNovoCurso)
        const cursoAtualizado = response.content as Curso
        cursoStore.atualizarPropriedadeCurso(novoCurso.value?.id as number, 'id', cursoAtualizado.id)
        cursoStore.atualizarCurso(cursoAtualizado)
        cursoStore.selecionarCurso(cursoAtualizado.id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        tipoAviso.value = 'erro'
        textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
        avisoAberto.value = true
      }

      cursoStore.setNovoCurso(null)
    } else {
      const dadosEdicao = new FormData()
      dadosEdicao.append('titulo', cursoSelecionado.value?.titulo as string)
      if (cursoSelecionado.value?.imagemCover)
        dadosEdicao.append('imagemCover', cursoSelecionado.value?.imagemCover as File, novoCurso.value?.imagemCover?.name)
      dadosEdicao.append('descricao', cursoSelecionado.value?.descricao as string)
      dadosEdicao.append('categoriaId', cursoSelecionado.value?.categoriaId as unknown as string)
      dadosEdicao.append('diasParaConcluir', cursoSelecionado.value?.diasParaConcluir as unknown as string)
      dadosEdicao.append('cargaHoraria', cursoSelecionado.value?.cargaHoraria as unknown as string)
      dadosEdicao.append('imagemCoverUrl', cursoSelecionado.value?.imagemCoverUrl as string)

      editando.value = true

      try {
        const response = await editarCurso(cursoSelecionado.value?.id as number, dadosEdicao)
        const cursoAtualizado = response.content as Curso
        cursoStore.atualizarCurso(cursoAtualizado)
        cursoStore.selecionarCurso(cursoAtualizado.id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        tipoAviso.value = 'erro'
        textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
        avisoAberto.value = true
      }
    }
    loadingSalvarRascunho.value = false
  }

  const handleConfirmarExclusao = () => {
    switch (tipoExclusao.value) {
      case 'curso':
        handleConfirmarExclusaoCurso()
        break
      case 'modulo':
        handleConfirmarExclusaoModulo()
        break
      case 'aula':
        handleConfirmarExclusaoAula()
        break
    }
  }

  const handleConfirmarExclusaoCurso = async () => {
    const idCurso = cursoSelecionado.value?.id as number
    cursoStore.removerCurso(idCurso)

    try {
      await excluir(idCurso)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }

    dialogExclusaoAberto.value = false
  }

  const handleConfirmarExclusaoModulo = async () => {
    const idModulo = moduloExcluir.value?.moduloId as number
    cursoStore.removerModulo(idModulo)

    try {
      await excluirModulo(idModulo)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }

    dialogExclusaoAberto.value = false
  }

  const handleConfirmarExclusaoAula = async () => {
    const idAula = aulaExcluir.value?.aulaId as number
    cursoStore.removerAula(idAula, aulaExcluir.value?.moduloId as number)

    try {
      await excluirAula(idAula)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }

    dialogExclusaoAberto.value = false
  }

</script>

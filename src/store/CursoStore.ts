import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  Alternativa,
  Aula,
  Avaliacao,
  Curso,
  Modulo,
  Pergunta,
} from '@/types/curso/types';

export const useCursoStore = defineStore('cursos', () => {
  const cursos = ref<Curso[]>([]);
  const novoCurso = ref<Curso | null>(null);
  const novoModulo = ref<Modulo | null>(null);
  const idCursoSelecionado = ref<number | null>(null);

  // LEITORES / GETTERS

  const cursoPorId = (id: number) =>
    computed(() => cursos.value.find(c => c.id === id));

  const cursoSelecionado = computed(() =>
    cursos.value.find(c => c.id === idCursoSelecionado.value),
  );

  const moduloPorId = (cursoId: number, moduloId: number) =>
    computed(() =>
      cursos.value.find(c => c.id === cursoId)?.modulos.find(m => m.id === moduloId),
    );

  const aulaPorId = (moduloId: number, aulaId: number, cursoId?: number) =>
    computed<Aula | undefined>(() => {
      const id = cursoId ?? idCursoSelecionado.value;
      if (!id) return undefined;
      const curso = cursos.value.find(c => c.id === id);
      const modulo = curso?.modulos.find(m => m.id === moduloId);
      return modulo?.aulas.find(a => a.id === aulaId);
    });

  // ACOES CURSO / MODULO / AULA

  function setNovoCurso (curso: Curso | null) {
    novoCurso.value = curso;
  }

  function setNovoModulo (modulo: Modulo | null) {
    novoModulo.value = modulo;
  }

  function setAvaliacaoFinal (avaliacao: Avaliacao, cursoId?: number) {
    const id = cursoId ?? idCursoSelecionado.value;
    if (!id) return;
    const curso = cursoPorId(id).value;
    if (curso) curso.avaliacaoFinal = avaliacao;
  }

  function setCursos (lista: Curso[]) {
    cursos.value = lista;
  }

  function selecionarCurso (id: number) {
    idCursoSelecionado.value = id;
  }

  function adicionarCurso (curso: Curso) {
    const novo = { ...curso, id: Date.now(), flPublicado: false, modulos: [], avaliacoes: [] };
    cursos.value.push(novo);
    idCursoSelecionado.value = novo.id;
    novoCurso.value = novo;
  }

  function atualizarCurso (cursoAtualizado: Curso) {
    const idx = cursos.value.findIndex(c => c.id === cursoAtualizado.id);
    if (idx !== -1) cursos.value[idx] = cursoAtualizado;
  }

  function removerCurso (id: number) {
    const idx = cursos.value.findIndex(c => c.id === id);
    if (idx !== -1) {
      cursos.value.splice(idx, 1);
      if (idCursoSelecionado.value === id) idCursoSelecionado.value = null;
    }
  }

  function toggleAtivoLocal () {
    const curso = cursoSelecionado.value
    if (!curso) return
    cursoSelecionado.value.flInativo = !curso.flInativo
  }

  // MÓDULO
  function adicionarModulo (titulo: string, cursoId?: number) {
    const novo = { id: Date.now(), titulo, aulas: [] };
    novoModulo.value = novo;

    const id = cursoId ?? idCursoSelecionado.value;
    if (!id) return;
    cursoPorId(id).value?.modulos.push(novo);
  }

  function atualizarModulo (moduloAtualizado: Modulo, cursoId?: number) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso) return;
    const idx = curso.modulos.findIndex(m => m.id === moduloAtualizado.id);
    if (idx !== -1) curso.modulos[idx] = moduloAtualizado;
  }

  function removerModulo (moduloId: number, cursoId?: number) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso) return;
    const idx = curso.modulos.findIndex(m => m.id === moduloId);
    if (idx !== -1) curso.modulos.splice(idx, 1);
  }

  // AULA
  function adicionarAula (
    moduloId: number,
    aula: Aula,
    cursoId?: number,
  ): Aula | undefined {
    const id = cursoId ?? idCursoSelecionado.value;
    if (!id) return;
    const modulo = moduloPorId(id, moduloId).value;
    if (!modulo) return;
    const nova = { ...aula, id: Date.now() };
    modulo.aulas.push(nova);
    return nova;
  }

  function atualizarAula (
    aulaAtualizada: Aula,
    moduloId: number,
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const modulo = moduloPorId(id!, moduloId).value;
    if (!modulo) return;
    const idx = modulo.aulas.findIndex(a => a.id === aulaAtualizada.id);
    if (idx !== -1) modulo.aulas[idx] = aulaAtualizada;
  }

  function removerAula (aulaId: number, moduloId: number, cursoId?: number) {
    const id = cursoId ?? idCursoSelecionado.value;
    const modulo = moduloPorId(id!, moduloId).value;
    if (!modulo) return;
    const idx = modulo.aulas.findIndex(a => a.id === aulaId);
    if (idx !== -1) modulo.aulas.splice(idx, 1);
  }

  // UPDATES PROPRIEDADES
  function atualizarPropriedadeCurso<K extends keyof Curso> (
    cursoId: number,
    campo: K,
    valor: Curso[K],
  ) {
    const curso = cursoPorId(cursoId).value;
    if (curso) (curso as Curso)[campo] = valor;
  }

  function atualizarPropriedadeModulo<K extends keyof Modulo> (
    moduloId: number,
    campo: K,
    valor: Modulo[K],
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    const modulo = curso?.modulos.find(m => m.id === moduloId);
    if (modulo) (modulo as Modulo)[campo] = valor;
  }

  function atualizarPropriedadeAula<K extends keyof Aula> (
    aulaId: number,
    campo: K,
    valor: Aula[K],
    moduloId: number,
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const modulo = moduloPorId(id!, moduloId).value;
    const aula = modulo?.aulas.find(a => a.id === aulaId);
    if (aula) (aula as Aula)[campo] = valor;
  }

  function atualizarPropriedadeAvaliacao<K extends keyof Avaliacao> (
    avaliacaoId: number,
    campo: K,
    valor: Avaliacao[K],
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso) return;

    if (curso.avaliacaoFinal?.id === avaliacaoId) {
      (curso.avaliacaoFinal as Avaliacao)[campo] = valor;
      return;
    }

    const avaliacao = curso.avaliacoes?.find(a => a.id === avaliacaoId);
    if (avaliacao) (avaliacao as Avaliacao)[campo] = valor;
  }

  function atualizarPropriedadePergunta<K extends keyof Pergunta> (
    perguntaId: number,
    campo: K,
    valor: Pergunta[K],
    avaliacaoId: number,
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso) return;

    const avaliacao = [
      curso.avaliacaoFinal,
      ...(curso.avaliacoes ?? []),
    ].find(a => a.id === avaliacaoId);
    if (!avaliacao) return;

    const pergunta = avaliacao?.perguntas?.find(p => p.id === perguntaId);
    if (pergunta) (pergunta as Pergunta)[campo] = valor;
  }

  function atualizarPropriedadeAlternativa<K extends keyof Alternativa> (
    alternativaId: number,
    campo: K,
    valor: Alternativa[K],
    perguntaId: number,
    avaliacaoId: number,
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso) return;

    const avaliacao = [
      curso.avaliacaoFinal,
      ...(curso.avaliacoes ?? []),
    ].find(a => a.id === avaliacaoId);
    if (!avaliacao) return;

    const pergunta = avaliacao.perguntas.find(p => p.id === perguntaId);
    if (!pergunta) return;

    const alternativa = pergunta.alternativas.find(al => al.id === alternativaId);
    if (alternativa) (alternativa as Alternativa)[campo] = valor;
  }

  // ACOES - AVALIACOES

  function adicionarAvaliacaoCadastrada (
    avaliacao: Avaliacao,
    cursoId?: number,
  ): Avaliacao | undefined {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso) return;

    if (!curso.avaliacoes) curso.avaliacoes = [];
    curso.avaliacoes.push(avaliacao);
    return avaliacao;
  }

  function adicionarAvaliacao (
    avaliacao: Omit<Avaliacao, 'id' | 'perguntas'> & { perguntas?: Pergunta[] },
    cursoId?: number,
  ): Avaliacao | undefined {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso) return;

    const nova: Avaliacao = {
      ...avaliacao,
      id: Date.now(),
      perguntas: avaliacao.perguntas ?? [],
    };
    if (!curso.avaliacoes) curso.avaliacoes = [];
    curso.avaliacoes.push(nova);
    return nova;
  }

  function atualizarAvaliacao (avaliacaoAtualizada: Avaliacao, cursoId?: number) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    const idx = curso?.avaliacoes?.findIndex(a => a.id === avaliacaoAtualizada.id);
    if (idx != null && idx !== -1 && curso?.avaliacoes) {
      curso.avaliacoes[idx] = avaliacaoAtualizada;
    }
  }

  function removerAvaliacao (avaliacaoId: number, cursoId?: number) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    if (!curso?.avaliacoes) return;
    const idx = curso.avaliacoes.findIndex(a => a.id === avaliacaoId);
    if (idx !== -1) curso.avaliacoes.splice(idx, 1);
  }

  // PERGUNTAS

  function adicionarPergunta (
    avaliacaoId: number,
    pergunta: Omit<Pergunta, 'id' | 'alternativas'> & { alternativas?: Alternativa[] },
    cursoId?: number,
  ): Pergunta | undefined {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    const avaliacao = curso?.avaliacoes?.find(a => a.id === avaliacaoId);
    if (!avaliacao) return;

    const nova: Pergunta = {
      ...pergunta,
      id: Date.now(),
      alternativas: pergunta.alternativas ?? [],
    };
    avaliacao.perguntas.push(nova);
    return nova;
  }

  function atualizarPergunta (
    avaliacaoId: number,
    perguntaAtualizada: Pergunta,
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    const avaliacao = curso?.avaliacoes.find(a => a.id === avaliacaoId);
    if (!avaliacao) return;
    const idx = avaliacao?.perguntas.findIndex(p => p.id === perguntaAtualizada.id);
    if (idx !== -1) avaliacao.perguntas[idx] = perguntaAtualizada;
  }

  function removerPergunta (
    avaliacaoId: number,
    perguntaId: number,
    cursoId?: number,
  ) {
    const id = cursoId ?? idCursoSelecionado.value;
    const curso = cursoPorId(id!).value;
    const avaliacao = curso?.avaliacoes?.find(a => a.id === avaliacaoId);
    if (!avaliacao) return;
    const idx = avaliacao.perguntas.findIndex(p => p.id === perguntaId);
    if (idx !== -1) avaliacao.perguntas.splice(idx, 1);
  }

  //RETORNO

  return {
    //estado
    cursos,
    novoCurso,
    novoModulo,
    idCursoSelecionado,

    // leitores
    cursoPorId,
    cursoSelecionado,
    moduloPorId,
    aulaPorId,

    // acoes - curso/modulo/aula
    setNovoCurso,
    setNovoModulo,
    setAvaliacaoFinal,
    setCursos,
    selecionarCurso,
    adicionarCurso,
    atualizarCurso,
    removerCurso,
    toggleAtivoLocal,
    adicionarModulo,
    atualizarModulo,
    removerModulo,
    adicionarAula,
    atualizarAula,
    removerAula,
    atualizarPropriedadeCurso,
    atualizarPropriedadeModulo,
    atualizarPropriedadeAula,

    // acoes - avaliacao/pergunta
    adicionarAvaliacaoCadastrada,
    adicionarAvaliacao,
    atualizarAvaliacao,
    removerAvaliacao,
    adicionarPergunta,
    atualizarPergunta,
    removerPergunta,

    atualizarPropriedadeAvaliacao,
    atualizarPropriedadePergunta,
    atualizarPropriedadeAlternativa,
  };
});

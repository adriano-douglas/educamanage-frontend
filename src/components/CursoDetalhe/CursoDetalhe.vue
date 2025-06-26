<template>
  <v-container class="pt-6" fluid>
    <!-- CABECALHO -->
    <v-row class="mb-4">
      <v-col class="d-flex align-center justify-space-between" cols="12">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ cursoMatricula?.titulo }}
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-0">
            {{ cursoMatricula?.descricao }}
          </p>
        </div>

        <v-btn
          v-if="cursoMatricula?.certificadoDisponivel"
          color="success"
          :href="cursoMatricula.certificadoUrl"
          prepend-icon="mdi-certificate"
          target="_blank"
        >
          Certificado
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- COLUNA PRINCIPAL -->
      <v-col cols="12" md="8">
        <!-- PROVA -->
        <v-card
          v-if="emProva && avaliacao"
          class="pa-8"
          elevation="4"
          rounded="lg"
        >
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h5 font-weight-medium mb-0">
              {{ avaliacao.titulo }}
            </h3>
            <v-btn icon="mdi-close" variant="text" @click="fecharProva" />
          </div>

          <!-- PERGUNTAS -->
          <div
            v-for="(q, qi) in avaliacao.perguntas"
            :key="q.idPergunta"
            class="mb-6"
          >
            <p class="font-weight-medium mb-3">
              {{ qi + 1 }}.&nbsp;{{ q.enunciado }}
            </p>
            <v-radio-group
              v-model="respostas[q.idPergunta]"
              :disabled="!!resultadoProva"
            >
              <v-radio
                v-for="alt in q.alternativas"
                :key="alt.idAlternativa"
                :label="alt.texto"
                :value="alt.idAlternativa"
              />
            </v-radio-group>
          </div>

          <!-- ENVIAR -->
          <v-btn
            v-if="!resultadoProva"
            class="mt-4"
            color="primary"
            :disabled="!todasRespondidas"
            @click="enviarAvaliacao"
          >
            Enviar
          </v-btn>

          <!-- FEEDBACK -->
          <template v-else>
            <v-alert
              class="mt-6"
              :type="resultadoProva.aprovado ? 'success' : 'warning'"
            >
              {{ resultadoProva.aprovado ? 'Aprovado! ' : 'Reprovado. ' }}
              {{ resultadoProva.percentualAcertos.toFixed(1) }} %
              - Tentativa {{ tentativaNumero }}
              <span v-if="resultadoProva.tentativasRestantes >= 0">
                - Tentativas restantes:
                {{ resultadoProva.tentativasRestantes }}
              </span>
            </v-alert>

            <v-list class="mt-4" two-line>
              <v-list-item
                v-for="q in resultadoProva.questoes"
                :key="q.idPergunta"
              >
                <template #prepend>
                  <v-icon
                    :color="q.correta ? 'success' : 'error'"
                    :icon="q.correta ? 'mdi-check' : 'mdi-close'"
                  />
                </template>
                <v-list-item-title>
                  {{ perguntaEnunciado(q.idPergunta) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Você marcou: {{ alternativaTexto(q.idAlternativaMarcada) }}
                  <template v-if="q.idAlternativaCorreta">
                    <br>
                    Correta: {{ alternativaTexto(q.idAlternativaCorreta) }}
                  </template>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <!-- ACOES APOS A PROVA -->
            <v-btn
              v-if="resultadoProva.aprovado"
              class="mt-6"
              color="secondary"
              prepend-icon="mdi-arrow-right"
              @click="continuarAposAvaliacao"
            >
              Continuar
            </v-btn>
            <v-btn
              v-else-if="podeTentarNovamente"
              class="mt-6"
              color="primary"
              prepend-icon="mdi-reload"
              @click="tentarNovamente"
            >
              Tentar novamente
            </v-btn>
          </template>
        </v-card>

        <!-- FEEDBACKS principal -->
        <v-card
          v-else-if="emFeedback"
          elevation="4"
          rounded="lg"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <h3 class="text-h6 font-weight-medium mb-0">Feedbacks do curso</h3>
            <v-btn icon="mdi-close" variant="text" @click="fecharFeedback" />
          </v-card-title>

          <v-divider />

          <!-- LISTA DE FEEDBACKS -->
          <v-card-text class="pb-0">
            <div
              style="max-height: 290px; overflow-y: auto; padding-right: 8px;"
            >
              <v-list v-if="feedbacksPagina.length" density="comfortable">
                <template v-for="(fb, i) in feedbacksPagina" :key="fb.id">
                  <v-list-item class="align-start" style="margin-bottom: 8px;">
                    <template #prepend>
                      <v-avatar class="mr-3" size="40">
                        <v-img
                          v-if="fb.avatar"
                          alt="avatar"
                          cover
                          :src="fb.avatar"
                        />

                        <v-icon v-else icon="mdi-account-circle" size="50" />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium mb-1">
                      {{ fb.anonimo ? 'Anônimo' : fb.nome }}
                    </v-list-item-title>

                    <div
                      class="text-body-2 text-medium-emphasis mb-1"
                      style="white-space: pre-wrap; overflow: visible;"
                    >
                      {{ fb.texto }}
                    </div>

                    <span
                      class="text-caption"
                      style="color: var(--v-theme-secondary);"
                    >
                      {{ fb.data }}
                    </span>
                  </v-list-item>

                  <v-divider
                    v-if="i !== feedbacksPagina.length - 1"
                    class="my-3"
                  />
                </template>
              </v-list>

              <div
                v-else
                class="text-center text-body-2 text-medium-emphasis py-6"
              >
                Não há comentários para este curso.
              </div>
            </div>
          </v-card-text>

          <div class="d-flex justify-center align-center py-2">
            <v-btn
              :disabled="paginaAtual === 1"
              icon="mdi-chevron-left"
              variant="text"
              @click="paginaAnterior"
            />
            <span class="mx-2 text-body-2">{{ paginaAtual }} / {{ totalPaginas }}</span>
            <v-btn
              :disabled="paginaAtual === totalPaginas"
              icon="mdi-chevron-right"
              variant="text"
              @click="proximaPagina"
            />
          </div>

          <v-divider />

          <v-card-text>
            <v-textarea
              v-model="feedbackTexto"
              auto-grow
              clearable
              counter="500"
              label="Deixe seu feedback (máx. 500 caracteres)"
              maxlength="500"
              rows="3"
              variant="outlined"
            />
            <v-checkbox
              v-model="feedbackAnonimo"
              label="Enviar como anônimo"
            />
            <v-btn
              color="primary"
              :disabled="feedbackTexto.trim() === ''"
              @click="enviarFeedback"
            >
              Enviar
            </v-btn>
          </v-card-text>
        </v-card>


        <!--  VIDEO / AULA -->
        <v-card v-else elevation="4" rounded="lg">
          <v-responsive :aspect-ratio="16/9">
            <iframe
              allow="autoplay; fullscreen; picture-in-picture"
              frameborder="0"
              :src="asVimeo(aulaAtual?.videoUrl)"
              style="width: 100%; height: 100%"
            />
          </v-responsive>

          <v-card-text>
            <h3 class="text-h6 font-weight-medium mb-1">
              {{ aulaAtual?.titulo }}
            </h3>
            <p
              v-if="aulaAtual?.descricao"
              class="text-body-2 text-medium-emphasis mb-4"
            >
              {{ aulaAtual?.descricao }}
            </p>

            <h4
              v-if="aulaAtual?.materiais.length"
              class="text-subtitle-2 font-weight-medium mb-2"
            >
              Materiais de apoio
            </h4>
            <v-list
              v-if="aulaAtual?.materiais.length"
              class="mb-0"
              density="compact"
            >
              <v-list-item
                v-for="mat in aulaAtual.materiais"
                :key="mat.idMaterial"
                class="px-0"
              >
                <v-btn
                  color="primary"
                  :href="mat.link"
                  prepend-icon="mdi-download"
                  style="min-width: 0"
                  target="_blank"
                  variant="text"
                >
                  {{ mat.titulo }}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="justify-space-between flex-wrap">
            <v-btn
              class="mr-2 mb-2"
              color="primary"
              :disabled="!progressoMatricula?.idAulaAnterior"
              prepend-icon="mdi-chevron-left"
              variant="outlined"
              @click="irParaAnterior"
            >
              Aula anterior
            </v-btn>
            <v-btn
              append-icon="mdi-chevron-right"
              class="mb-2"
              color="primary"
              :disabled="!podeAvancar"
              variant="outlined"
              @click="irParaProximaOuProva"
            >
              Próxima
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- PAINEL DIREITO -->
      <v-col cols="12" md="4">
        <!-- MODULOS -->
        <v-card class="mb-4" elevation="4" rounded="lg">
          <v-expansion-panels v-model="openPanels" multiple>
            <v-expansion-panel
              v-for="(mod, i) in cursoMatricula?.modulos"
              :key="mod.idModulo"
              :value="mod.idModulo"
            >
              <v-expansion-panel-title>
                <v-icon class="mr-2" icon="mdi-folder-outline" />
                {{ mod.titulo }}
                <v-spacer />
                <v-icon :color="corModulo(mod.status)" :icon="iconeModulo(mod.status)" />
              </v-expansion-panel-title>

              <v-expansion-panel-text class="py-0">
                <v-list density="compact" nav>
                  <!-- AULAS -->
                  <v-list-item
                    v-for="aula in mod.aulas"
                    :key="aula.idAula"
                    :active="!emProva && aulaAtual?.idAula === aula.idAula"
                    color="primary"
                    :disabled="!aula.flAcessoLiberado"
                    @click="clickAula(aula.idAula)"
                  >
                    <template #prepend>
                      <v-icon :icon="iconeAula(aula)" />
                    </template>
                    <v-list-item-title>{{ aula.titulo }}</v-list-item-title>
                  </v-list-item>

                  <!-- AVALIACAO DO MOUDOLO -->
                  <v-list-item
                    v-if="mod.avaliacao"
                    :key="'exam' + mod.idModulo"
                    :active="isAvaliacaoAtualDoModulo(mod.idModulo)"
                    color="secondary"
                    :disabled="!mod.avaliacao.flAcessoLiberado"
                    @click="clickProvaModulo(i)"
                  >
                    <template #prepend>
                      <v-icon
                        :icon="mod.avaliacao.flAprovada
                          ? 'mdi-check-circle'
                          : mod.avaliacao.flAcessoLiberado
                            ? 'mdi-clipboard-text'
                            : 'mdi-lock'"
                      />
                    </template>
                    <v-list-item-title>Avaliação do módulo</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <!-- AVALIACAO FINAL -->
        <v-card class="mb-4" elevation="4" rounded="lg">
          <v-list density="compact" nav>
            <v-list-item
              :active="isAvaliacaoFinalAtual"
              color="primary"
              :disabled="!avaliacaoFinalLiberada"
              @click="avaliacaoFinalLiberada && iniciarAvaliacaoFinal()"
            >
              <template #prepend>
                <v-icon
                  :icon="cursoMatricula?.avaliacaoFinal?.aprovada
                    ? 'mdi-check-circle'
                    : avaliacaoFinalLiberada
                      ? 'mdi-flag-checkered'
                      : 'mdi-lock'"
                />
              </template>
              <v-list-item-title>Avaliação Final</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- FEEDBACKS -->
        <v-card elevation="4" rounded="lg">
          <v-list density="compact" nav>
            <v-list-item
              :active="emFeedback"
              color="primary"
              @click="abrirFeedback"
            >
              <template #prepend>
                <v-icon icon="mdi-comment-multiple-outline" />
              </template>
              <v-list-item-title>Feedbacks</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    buscarPorId,
    buscarProgressoAtual,
    buscarProgressoPorAula,
    buscarUltimaTentativa,
    carregarAvaliacao,
    registrarProgresso,
    submeterAvaliacao,
  } from '@/services/MatriculaCursoService'
  import type {
    AulaMatricula,
    AvaliacaoFull,
    CursoMatricula,
    ProgressoMatricula,
    ResultadoTentativa,
  } from '@/types/matricula-curso/types'
  import type {
    FeedbackCursoRequest,
    FeedbackCursoResponse,
  } from '@/types/feedback-curso/types'
  import { criarFeedback, listarFedbacksPorIdCurso } from '@/services/FeedbackCursoService'

  const idMatriculaCurso = Number(useRoute().params.id)
  const cursoMatricula = ref<CursoMatricula>()
  const progressoMatricula = ref<ProgressoMatricula>()

  const openPanels = ref<number[]>([]) // painéis expandidos
  const emProva = ref(false)
  const emFeedback = ref(false) // ← flag nova
  const avaliacao = ref<AvaliacaoFull | null>(null)
  const respostas = ref<Record<number, number>>({})
  const resultadoProva = ref<ResultadoTentativa | null>(null)
  const tentativaNumero = ref(0)

  let aulaAntesProva: number | null = null
  const avaliacoesTentadas = new Set<number>()

  type StatusModulo = 'FINALIZADO' | 'LIBERADO' | 'BLOQUEADO'

  const feedbacks = ref<FeedbackCursoResponse[]>([])
  const itensPorPagina = 5
  const paginaAtual = ref(1)
  const feedbackTexto = ref('')
  const feedbackAnonimo = ref(false)

  const feedbacksPagina = computed(() => {
    const ini = (paginaAtual.value - 1) * itensPorPagina
    return feedbacks.value.slice(ini, ini + itensPorPagina)
  })
  const totalPaginas = computed(() =>
    Math.max(1, Math.ceil(feedbacks.value.length / itensPorPagina)),
  )

  const todasAulas = computed(() =>
    cursoMatricula.value ? cursoMatricula.value.modulos.flatMap(m => m.aulas) : [],
  )

  const aulaAtual = computed(() =>
    cursoMatricula.value && progressoMatricula.value
      ? todasAulas.value.find(a => a.idAula === progressoMatricula.value?.idAulaAtual) ?? null
      : null,
  )

  const todasRespondidas = computed(() =>
    avaliacao.value
      ? avaliacao.value.perguntas.every(p => respostas.value[p.idPergunta] !== undefined)
      : false,
  )

  function asVimeo (u?: string) {
    if (!u) return ''
    try {
      const id = new URL(u).pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : u
    } catch { return u }
  }

  async function trocarAula (idAula: number) {
    if (!cursoMatricula.value) return

    let prog: ProgressoMatricula | null
    try { prog = await buscarProgressoPorAula(idMatriculaCurso, idAula) }
    catch { prog = null }

    if (!prog) {
      prog = await registrarProgresso(idMatriculaCurso, { idMatriculaCurso, idNovaAula: idAula })
    }

    progressoMatricula.value = prog
    cursoMatricula.value = await buscarPorId(idMatriculaCurso)
    emFeedback.value = false
  }

  function statusAula (a: AulaMatricula) {
    if (aulaAtual.value?.idAula === a.idAula) return 'ativa'
    if (a.flFinalizada) return 'concluida'
    if (!a.flAcessoLiberado) return 'bloqueada'
    return 'proxima'
  }
  const iconeAula = (aula: AulaMatricula) =>
    ({ ativa:'mdi-play-circle', concluida:'mdi-check-circle-outline', proxima:'mdi-play-outline', bloqueada:'mdi-lock-outline' } as const)[statusAula(aula)]

  function avaliacaoJaFeita (aval?: { idAvaliacao: number; flRespondida?: boolean } | null) {
    if (!aval) return false
    if (aval.flRespondida) return true
    return avaliacoesTentadas.has(aval.idAvaliacao)
  }

  function statusModulo (status: StatusModulo) {
    return status;
  }
  const corModulo = (status: StatusModulo) => ({ FINALIZADO:'success', LIBERADO:'warning', BLOQUEADO:'grey' } as const)[statusModulo(status)]
  const iconeModulo = (status: StatusModulo) => ({ FINALIZADO:'mdi-check-circle', LIBERADO:'mdi-progress-clock', BLOQUEADO:'mdi-lock' } as const)[statusModulo(status)]

  const idAvaliacaoFinal = computed(() => cursoMatricula.value?.avaliacaoFinal?.idAvaliacaoFinal ?? null)
  const avaliacaoFinalLiberada = computed(() => cursoMatricula.value?.avaliacaoFinal?.flAcessoLiberado ?? false)

  const idAvaliacaoAtiva = computed(() =>
    emProva.value && avaliacao.value
      ? avaliacao.value.idAvaliacao
      : null,
  )

  function isAvaliacaoAtualDoModulo (idModulo: number) {
    const avalId = idAvaliacaoAtiva.value
    return cursoMatricula.value?.modulos.some(
      m => m.idModulo === idModulo && m.avaliacao?.idAvaliacao === avalId,
    ) ?? false
  }
  const isAvaliacaoFinalAtual = computed(() =>
    idAvaliacaoAtiva.value === idAvaliacaoFinal.value,
  )

  function setPainelParaAvaliacao (idAval: number) {
    if (idAval === idAvaliacaoFinal.value) {
      openPanels.value = []
    } else {
      const m = cursoMatricula.value?.modulos.find(x => x.avaliacao?.idAvaliacao === idAval)
      openPanels.value = m ? [m.idModulo] : []
    }
  }

  watch([aulaAtual, () => avaliacao.value], () => {
    if (!cursoMatricula.value) return
    if (avaliacao.value) {
      setPainelParaAvaliacao(avaliacao.value.idAvaliacao)
    } else if (aulaAtual.value) {
      const m = cursoMatricula.value.modulos.find(x =>
        x.aulas.some(a => a.idAula === aulaAtual.value!.idAula))
      if (m) openPanels.value = [m.idModulo]
    }
  })

  const proximoEhAvaliacao = computed(() => {
    if (!cursoMatricula.value || !aulaAtual.value) return false
    const mod = cursoMatricula.value.modulos.find(m =>
      m.aulas.some(a => a.idAula === aulaAtual.value!.idAula))!
    return (
      mod.aulas.at(-1)!.idAula === aulaAtual.value.idAula &&
      mod.avaliacao?.flAcessoLiberado &&
      !avaliacaoJaFeita(mod.avaliacao)
    )
  })
  const proximoEhFinal = computed(() =>
    avaliacaoFinalLiberada.value &&
    !proximoEhAvaliacao.value &&
    !progressoMatricula.value?.idAulaProxima,
  )
  const podeAvancar = computed(() =>
    !!progressoMatricula.value?.idAulaProxima ||
    proximoEhAvaliacao.value ||
    proximoEhFinal.value,
  )

  function irParaAnterior () {
    if (progressoMatricula.value?.idAulaAnterior)
      trocarAula(progressoMatricula.value.idAulaAnterior)
  }
  function irParaProximaOuProva () {
    if (proximoEhAvaliacao.value) {
      const mod = cursoMatricula.value!.modulos.find(m =>
        m.aulas.some(a => a.idAula === aulaAtual.value!.idAula))!
      iniciarAvaliacaoModulo(mod.avaliacao!.idAvaliacao)

    } else if (proximoEhFinal.value) {
      iniciarAvaliacaoFinal()

    } else if (progressoMatricula.value?.idAulaProxima) {
      trocarAula(progressoMatricula.value.idAulaProxima)
    }
  }

  async function clickAula (id: number) {
    if (emProva.value) await fecharProva(false)
    emFeedback.value = false
    trocarAula(id)
  }
  function clickProvaModulo (idx: number) {
    const aval = cursoMatricula.value!.modulos[idx].avaliacao
    if (!aval?.flAcessoLiberado) return
    emFeedback.value = false
    setPainelParaAvaliacao(aval.idAvaliacao)
    iniciarAvaliacaoModulo(aval.idAvaliacao)
  }

  async function iniciarAvaliacaoModulo (id: number) {
    emFeedback.value = false
    aulaAntesProva = progressoMatricula.value?.idAulaAtual ?? null
    avaliacao.value = await carregarAvaliacao(idMatriculaCurso, id)

    const ult = await buscarUltimaTentativa(idMatriculaCurso, id)
    respostas.value = {}
    if (ult) {
      resultadoProva.value = ult
      tentativaNumero.value = ult.numeroTentativa
      ult.questoes.forEach(q => (respostas.value[q.idPergunta] = q.idAlternativaMarcada))
      avaliacoesTentadas.add(id)
    } else {
      resultadoProva.value = null
      tentativaNumero.value = 0
    }
    setPainelParaAvaliacao(id)
    emProva.value = true
  }
  function iniciarAvaliacaoFinal () {
    if (idAvaliacaoFinal.value) iniciarAvaliacaoModulo(idAvaliacaoFinal.value)
  }

  async function fecharProva (voltar = true) {
    emProva.value = false
    avaliacao.value = null
    respostas.value = {}
    resultadoProva.value = null
    tentativaNumero.value= 0
    if (voltar && aulaAntesProva !== null) await trocarAula(aulaAntesProva)
  }

  async function enviarAvaliacao () {
    if (!avaliacao.value) return;

    resultadoProva.value = await submeterAvaliacao(
      idMatriculaCurso,
      avaliacao.value.idAvaliacao,
      respostas.value,
    );

    tentativaNumero.value++;
    avaliacoesTentadas.add(avaliacao.value.idAvaliacao);

    if (
      resultadoProva.value?.aprovado &&
      resultadoProva.value.tipoAvaliacao === 'FINAL'
    ) {
      const tempoMaximo = 30_000;
      const inicioEm = Date.now();

      while (true) {
        cursoMatricula.value = await buscarPorId(idMatriculaCurso);

        if (cursoMatricula.value?.certificadoDisponivel) {
          break;
        }

        if (Date.now() - inicioEm > tempoMaximo) {
          throw new Error('Tempo de espera pelo certificado excedido (30 s)');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  const podeTentarNovamente = computed(() =>
    resultadoProva.value &&
    !resultadoProva.value.aprovado &&
    (resultadoProva.value.tentativasRestantes > 0 || resultadoProva.value.tentativasRestantes === -1),
  )
  async function tentarNovamente () {
    if (!avaliacao.value) return
    avaliacao.value = await carregarAvaliacao(idMatriculaCurso, avaliacao.value.idAvaliacao)
    respostas.value = {}
    resultadoProva.value = null
  }

  async function continuarAposAvaliacao () {
    if (!resultadoProva.value?.aprovado) return

    const idAval = avaliacao.value!.idAvaliacao
    fecharProva(false)

    const mods = cursoMatricula.value!.modulos
    const idxMod = mods.findIndex(m => m.avaliacao?.idAvaliacao === idAval)

    if (idxMod !== -1 && idxMod + 1 < mods.length) {
      const primeira = mods[idxMod + 1].aulas[0]?.idAula
      if (primeira) {
        await trocarAula(primeira)
        return
      }
    }
    iniciarAvaliacaoFinal()
  }

  const perguntaEnunciado = (id: number) =>
    avaliacao.value?.perguntas.find(p => p.idPergunta === id)?.enunciado ?? ''
  const alternativaTexto = (id: number) =>
    avaliacao.value?.perguntas.flatMap(p => p.alternativas).find(a => a.idAlternativa === id)?.texto ?? ''

  async function loadFeedbacks () {
    try {
      feedbacks.value = await listarFedbacksPorIdCurso(cursoMatricula.value?.idCurso as number)
      paginaAtual.value = 1
    } catch (err) {
      console.error('Erro ao carregar feedbacks', err)
    }
  }
  async function abrirFeedback () {
    if (emProva.value) await fecharProva(false)
    emFeedback.value = true
    openPanels.value = []
    await loadFeedbacks()
  }
  function fecharFeedback () {
    emFeedback.value = false
    feedbackTexto.value = ''
    feedbackAnonimo.value = false
    paginaAtual.value = 1
  }
  async function enviarFeedback () {
    const texto = feedbackTexto.value.trim()
    if (!texto) return

    const payload: FeedbackCursoRequest = {
      anonimo: feedbackAnonimo.value,
      texto,
    }

    try {
      await criarFeedback(cursoMatricula.value?.idCurso as number, payload)
      feedbackTexto.value = ''
      feedbackAnonimo.value = false
      await loadFeedbacks()
    } catch (err) {
      console.error('Erro ao enviar feedback', err)
    }
  }
  async function paginaAnterior () {
    feedbacks.value = await listarFedbacksPorIdCurso(cursoMatricula.value?.idCurso as number)
    if (paginaAtual.value > 1) paginaAtual.value--
  }
  async function proximaPagina () {
    feedbacks.value = await listarFedbacksPorIdCurso(cursoMatricula.value?.idCurso as number)
    if (paginaAtual.value < totalPaginas.value) paginaAtual.value++
  }

  onMounted(async () => {
    progressoMatricula.value = await buscarProgressoAtual(idMatriculaCurso)
    cursoMatricula.value = await buscarPorId(idMatriculaCurso)
  })
</script>

<style scoped>
:root { --primary-color: #3b82f6; }
</style>

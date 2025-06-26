<template>
  <v-card class="pa-4 mb-6" elevation="1" rounded="lg">
    <v-btn class="mb-6" prepend-icon="mdi-plus" variant="tonal" @click="abrirNovaAvaliacao">
      Criar Avaliação
    </v-btn>

    <v-expansion-panels elevation="1" multiple>
      <v-expansion-panel v-for="(aval, aIdx) in avaliacoes" :key="aval.id">
        <v-expansion-panel-title>
          <strong>{{ aval.titulo }}</strong>
          <span class="ml-4 text-caption">({{ aval.pontuacaoMinima }} %)</span>
          <v-spacer />
          <v-btn density="comfortable" icon="mdi-pencil" variant="text" @click.stop="handleEditarAvaliacao(aIdx)" />
          <v-btn
            color="error"
            density="comfortable"
            icon="mdi-delete"
            variant="text"
            @click.stop="handleExcluirAvaliacao(aIdx)"
          />
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <template v-if="aval.perguntas.length">
            <v-card v-for="(perg, pIdx) in aval.perguntas" :key="perg.id" class="questao-card mb-3 pa-3" outlined>
              <div class="d-flex align-center">
                <span class="text-body-2 font-weight-medium">{{ pIdx + 1 }}.</span>
                <span class="text-body-2 font-weight-medium ml-2 flex-grow-1">
                  {{ perg.enunciado }}
                </span>
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="handleEditarPergunta(aIdx, pIdx)"
                />
                <v-btn
                  color="error"
                  density="comfortable"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click="handleExcluirPergunta(aIdx, pIdx)"
                />
              </div>

              <v-list class="alt-lista mt-2" dense>
                <v-list-item v-for="(alt, aIdxx) in perg.alternativas" :key="alt.id" class="py-1">
                  <template #prepend>
                    <v-avatar class="mr-2" :color="alt.flCorreta ? 'success' : 'grey-lighten-3'" size="18">
                      <span :class="alt.flCorreta ? 'text-white' : 'text-grey-darken-3'" style="font-size: 0.65rem;">
                        {{ String.fromCharCode(65 + aIdxx) }}
                      </span>
                    </v-avatar>
                  </template>

                  <v-list-item-title
                    :class="alt.flCorreta ? 'text-success font-weight-medium' : ''"
                    style="line-height: 1.25;"
                  >
                    {{ alt.texto }}
                  </v-list-item-title>

                  <template v-if="alt.flCorreta" #append>
                    <v-icon color="success" size="16">mdi-check-circle</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </template>

          <v-btn prepend-icon="mdi-plus" size="small" variant="tonal" @click="abrirNovaPergunta(aIdx)">
            Adicionar Pergunta
          </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>

  <AvaliacaoDialog
    v-model="dialogAvalAberto"
    :id-avaliacao="dialogAvalEmEdicao?.id ?? null"
    @cadastro-avaliacao-finalizado="handleCadastroAvaliacaoFinalizado"
    @edicao-avaliacao-finalizado="handleEdicaoAvaliacaoFinalizado"
  />

  <PerguntaDialog
    v-model="dialogPergAberto"
    :id-avaliacao="idAvaliacaoGerenciarPerguntas"
    :pergunta="pergEmEdicao.perg"
    @cadastro-pergunta-finalizado="handleCadastroPerguntaFinalizado"
    @edicao-pergunta-finalizado="handleEdicaoPerguntaFinalizado"
  />

  <ConfirmarExclusaoDialog
    v-model="dialogExclusaoAberto"
    :texto="textoExclusao"
    @excluir="handleConfirmarExclusao"
  />

  <AvisoDialog v-model="avisoAberto" :texto="textoAviso" :tipo="tipoAviso" />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import type { Avaliacao, Pergunta } from '@/types/curso/types';
  import AvaliacaoDialog from './AvaliacaoDialog.vue';
  import PerguntaDialog from './PerguntaDialog.vue';
  import { useCursoStore } from '@/store/CursoStore';
  import { excluirAvaliacao } from '@/services/AvaliacaoService';
  import ConfirmarExclusaoDialog from '@/components/ConfirmarExclusaoDialog/ConfirmarExclusaoDialog.vue';
  import AvisoDialog from '@/components/AvisoDialog/AvisoDialog.vue';
  import { excluirPergunta } from '@/services/PerguntaService';

  const cursoStore = useCursoStore();
  const { cursoSelecionado } = storeToRefs(cursoStore);
  const avaliacoes = computed(() => cursoSelecionado.value!.avaliacoes);

  const avisoAberto = ref<boolean>(false)
  const tipoAviso = ref<'sucesso' | 'erro'>('sucesso')
  const textoAviso = ref<string>('Sucesso!')

  const dialogExclusaoAberto = ref<boolean>(false)
  const textoExclusao = ref<string>('')
  const tipoExclusao = ref<'avaliacao' | 'pergunta' | 'alternativa'>('avaliacao')
  const idExclusao = ref<number>(0)
  const idAvaliacaoExclusaoPergunta = ref<number>(0)
  const idAvaliacaoGerenciarPerguntas = ref<number>(0)

  const dialogAvalAberto = ref(false);
  const dialogAvalEmEdicao = ref<Avaliacao | null>(null);

  function abrirNovaAvaliacao () {
    dialogAvalEmEdicao.value = null;
    dialogAvalAberto.value = true;
  }

  function handleEditarAvaliacao (idx: number) {
    dialogAvalEmEdicao.value = { ...JSON.parse(JSON.stringify(avaliacoes.value![idx])) } as Avaliacao;
    dialogAvalAberto.value = true;
  }

  const handleCadastroAvaliacaoFinalizado = async (av: Avaliacao) => {
    cursoStore.adicionarAvaliacaoCadastrada(av)
  }

  const handleEdicaoAvaliacaoFinalizado = async (av: Avaliacao) => {
    cursoStore.atualizarAvaliacao(av)
  }

  const handleCadastroPerguntaFinalizado = async (av: Avaliacao) => {
    cursoStore.atualizarAvaliacao(av)
  }

  const handleEdicaoPerguntaFinalizado = async (av: Avaliacao) => {
    cursoStore.atualizarAvaliacao(av)
  }

  function handleExcluirAvaliacao (idx: number) {
    idExclusao.value = avaliacoes.value![idx].id;
    tipoExclusao.value = 'avaliacao'
    textoExclusao.value = 'Excluir esta avaliação e todas as perguntas dentro dela?'
    dialogExclusaoAberto.value = true
  }

  const dialogPergAberto = ref(false);
  const pergEmEdicao = ref<{ avalIdx: number; perg: Pergunta | null }>({
    avalIdx: -1,
    perg: null,
  });

  function abrirNovaPergunta (avalIdx: number) {
    const idAvaliacao = (JSON.parse(JSON.stringify(avaliacoes.value![avalIdx])) as Avaliacao).id;

    pergEmEdicao.value = { avalIdx, perg: null };
    idAvaliacaoGerenciarPerguntas.value = idAvaliacao

    dialogPergAberto.value = true;
  }

  function handleEditarPergunta (avalIdx: number, pergIdx: number) {
    const copia = JSON.parse(JSON.stringify(avaliacoes.value![avalIdx].perguntas[pergIdx]));
    const idAvaliacao = (JSON.parse(JSON.stringify(avaliacoes.value![avalIdx])) as Avaliacao).id;

    pergEmEdicao.value = { avalIdx, perg: copia };
    idAvaliacaoGerenciarPerguntas.value = idAvaliacao

    console.log(avalIdx)

    dialogPergAberto.value = true;
  }

  function handleExcluirPergunta (avalIdx: number, pergIdx: number) {
    const avalId = avaliacoes.value![avalIdx].id;
    const perguntaId = avaliacoes.value![avalIdx].perguntas[pergIdx].id;
    idExclusao.value = perguntaId
    idAvaliacaoExclusaoPergunta.value = avalId
    tipoExclusao.value = 'pergunta'
    textoExclusao.value = 'Excluir esta pergunta e todas as alternativas dentro dela?'
    dialogExclusaoAberto.value = true
  }

  const handleConfirmarExclusao = () => {
    switch (tipoExclusao.value) {
      case 'avaliacao':
        handleConfirmarExclusaoAvaliacao()
        break
      case 'pergunta':
        handleConfirmarExclusaoPergunta()
        break
      case 'alternativa':
        break
    }
  }

  const handleConfirmarExclusaoAvaliacao = async () => {
    cursoStore.removerAvaliacao(idExclusao.value)

    try {
      await excluirAvaliacao(idExclusao.value)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }

    dialogExclusaoAberto.value = false
  }

  const handleConfirmarExclusaoPergunta = async () => {
    cursoStore.removerPergunta(idAvaliacaoExclusaoPergunta.value, idExclusao.value)

    try {
      await excluirPergunta(idExclusao.value)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    }

    dialogExclusaoAberto.value = false
  }
</script>

<style scoped>
.questao-card {
  line-height: 1.25;
}

.alt-lista {
  padding: 0;
}
</style>

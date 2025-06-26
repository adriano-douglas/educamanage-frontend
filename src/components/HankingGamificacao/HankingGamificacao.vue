<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="d-flex align-center gap-2">
      <v-icon icon="mdi-trophy" /> {{ titulo }}
    </v-card-title>

    <v-list density="comfortable" lines="one">
      <v-list-item
        v-for="(usuario, indice) in melhoresUsuarios"
        :key="usuario.id"
      >
        <template #prepend>
          <v-avatar class="mr-3" size="40">
            <template v-if="usuario.avatar">
              <v-img :src="usuario.avatar" />
            </template>
            <template v-else>
              <span class="text-subtitle-2">{{ iniciais(usuario.nome) }}</span>
            </template>
          </v-avatar>
        </template>

        <v-list-item-title>
          <strong>#{{ indice + 1 }}</strong> {{ usuario.nome }}
        </v-list-item-title>

        <template #append>
          <div class="d-flex align-center gap-2">
            <v-icon
              v-if="indice < 3"
              :color="corMedalha(indice)"
              size="26"
            >mdi-medal</v-icon>
            <v-chip color="primary" label>{{ usuario.pontos }} pts</v-chip>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
  import { listarRanking } from '@/services/ParametroGamificacaoService'
  import type { RankingUsuarioResponse } from '@/types/parametro-gamificacao/types'
  import { computed, onMounted, ref } from 'vue'

  const props = defineProps<{
    ranking?: RankingUsuarioResponse[]
    titulo?: string
    maxItens?: number
  }>()

  const titulo = props.titulo ?? 'Top 10 Ranking'
  const maxItens = props.maxItens ?? 10

  const dadosRanking = ref<RankingUsuarioResponse[]>([])

  onMounted(async () => {
    if (!props.ranking || props.ranking.length === 0) {
      try {
        dadosRanking.value = await listarRanking()
      } catch (erro) {
        console.error(erro)
      }
    }
  })

  const rankingFonte = computed(() =>
    (props.ranking && props.ranking.length > 0)
      ? props.ranking
      : dadosRanking.value
  )

  const melhoresUsuarios = computed(() =>
    rankingFonte.value.slice(0, maxItens)
  )

  function iniciais (nome: string) {
    return nome
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
  }

  function corMedalha (indice: number) {
    if (indice === 0) return 'amber-darken-2'
    if (indice === 1) return 'blue-grey-darken-1'
    if (indice === 2) return 'deep-orange'
    return ''
  }
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

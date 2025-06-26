<template>
  <div>
    <h2 class="text-h5 mb-6">Revisão do Curso</h2>

    <v-card elevation="1" rounded="lg">
      <v-row no-gutters>
        <v-col cols="12" md="4">
          <v-img class="rounded-t-lg rounded-md-lg-0" cover height="180" :src="cursoSelecionado?.imagemCoverUrl" />
        </v-col>

        <v-col class="pa-4" cols="12" md="8">
          <h3 class="text-h6 mb-1 primary--text">{{ cursoSelecionado?.titulo }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-3 grampo-dois">
            {{ cursoSelecionado?.descricao }}
          </p>

          <div class="d-flex flex-wrap">
            <v-chip class="mr-2 mb-2" color="primary" size="small" variant="elevated">
              <v-icon size="18" start>mdi-view-module</v-icon>
              {{ totalModulos }} módulo{{ totalModulos > 1 ? 's' : '' }}
            </v-chip>

            <v-chip class="mr-2 mb-2" color="primary" size="small" variant="elevated">
              <v-icon size="18" start>mdi-play-circle</v-icon>
              {{ totalAulas }} aula{{ totalAulas > 1 ? 's' : '' }}
            </v-chip>

            <v-chip
              v-if="totalAvaliacoes"
              class="mr-2 mb-2"
              color="primary"
              size="small"
              variant="elevated"
            >
              <v-icon size="18" start>mdi-clipboard-text</v-icon>
              {{ totalAvaliacoes }} avaliação{{ totalAvaliacoes > 1 ? 's' : '' }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <v-divider />

      <v-expansion-panels multiple>
        <v-expansion-panel>
          <v-expansion-panel-title class="py-2">
            <v-icon class="mr-2" size="18" start>mdi-view-module</v-icon>
            Módulos & Aulas
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-expansion-panels accordion density="compact">
              <v-expansion-panel v-for="(mod, i) in cursoSelecionado?.modulos" :key="mod.id" elevation="1">
                <v-expansion-panel-title>
                  <strong>Módulo {{ i + 1 }}:</strong>&nbsp;{{ mod.titulo }}

                  <template #actions="{ expanded, collapseIcon, expandIcon }">
                    <v-chip class="mr-2" color="info" size="small" variant="tonal">
                      <v-icon size="16" start>mdi-play-circle</v-icon>
                      {{ mod.aulas.length }}
                      aula{{ mod.aulas.length > 1 ? 's' : '' }}
                    </v-chip>

                    <v-icon :icon="expanded ? collapseIcon : expandIcon" />
                  </template>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-card v-for="(aula, j) in mod.aulas" :key="aula.id" class="pa-3 mb-3" elevation="0">
                    <div class="d-flex align-center mb-1">
                      <v-icon class="mr-2" size="18">mdi-play-circle</v-icon>
                      <span class="font-weight-medium">{{ j + 1 }}. {{ aula.titulo }}</span>
                    </div>

                    <p class="text-body-2 text-medium-emphasis mb-2 grampo-dois">
                      {{ aula.descricao }}
                    </p>

                    <div class="d-flex flex-wrap">
                      <a class="no-underline" :href="aula.videoUrl" target="_blank">
                        <v-chip class="mr-2 mb-2" color="primary" size="small" variant="outlined">
                          <v-icon size="16" start>mdi-video</v-icon>
                          Vídeo
                        </v-chip>
                      </a>

                      <v-chip
                        v-for="mat in aula.materiais"
                        :key="mat.id"
                        class="mr-2 mb-2"
                        color="secondary"
                        size="small"
                        variant="outlined"
                      >
                        <v-icon size="16" start>mdi-file-document-outline</v-icon>
                        {{ mat.titulo }}
                      </v-chip>
                    </div>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel v-if="totalAvaliacoes">
          <v-expansion-panel-title class="py-2">
            <v-icon class="mr-2" size="18" start>mdi-clipboard-text</v-icon>
            Avaliações
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-expansion-panels accordion density="compact">
              <v-expansion-panel v-for="aval in cursoSelecionado?.avaliacoes" :key="aval.id" elevation="1">
                <v-expansion-panel-title>
                  <strong>{{ aval.titulo }}</strong>
                  <span class="ml-2 text-caption">({{ aval.pontuacaoMinima }}%)</span>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-expansion-panels accordion density="compact">
                    <v-expansion-panel v-for="(perg, k) in aval.perguntas" :key="perg.id" elevation="0">
                      <v-expansion-panel-title>
                        <v-avatar class="mr-2" color="grey-lighten-3" size="18">
                          <span style="font-size:0.65rem;">{{ k + 1 }}</span>
                        </v-avatar>
                        <span class="grampo-um">{{ perg.enunciado }}</span>
                      </v-expansion-panel-title>

                      <v-expansion-panel-text>
                        <v-list density="compact">
                          <v-list-item v-for="(alt, aIdx) in perg.alternativas" :key="alt.id" class="py-1">
                            <template #prepend>
                              <v-avatar class="mr-2" :color="alt.flCorreta ? 'success' : 'grey-lighten-3'" size="18">
                                <span
                                  :class="alt.flCorreta ? 'text-white' : 'text-grey-darken-3'"
                                  style="font-size:0.65rem;"
                                >
                                  {{ String.fromCharCode(65 + aIdx) }}
                                </span>
                              </v-avatar>
                            </template>

                            <v-list-item-title
                              :class="alt.flCorreta ? 'text-success font-weight-medium' : ''"
                              style="line-height:1.25;"
                            >
                              {{ alt.texto }}
                            </v-list-item-title>

                            <template v-if="alt.flCorreta" #append>
                              <v-icon color="success" size="16">mdi-check-circle</v-icon>
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useCursoStore } from '@/store/CursoStore'
  import { storeToRefs } from 'pinia'

  const { cursoSelecionado } = storeToRefs(useCursoStore())

  const totalModulos = computed(() => cursoSelecionado.value?.modulos.length ?? 0)
  const totalAulas = computed(
    () => cursoSelecionado.value?.modulos.reduce((sum, m) => sum + m.aulas.length, 0) ?? 0,
  )
  const totalAvaliacoes = computed(() => cursoSelecionado.value?.avaliacoes?.length ?? 0)
</script>

<style scoped>
.grampo-um {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grampo-dois {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

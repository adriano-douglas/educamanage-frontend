<template>
  <v-dialog v-model="isOpen" persistent>
    <v-sheet
      class="pa-4 text-center mx-auto"
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
    >
      <v-icon class="mb-5" :color="getCor" :icon="getIcon" size="80" />

      <h2 class="text-h6 mb-6">{{ props.texto }}</h2>

      <v-divider class="mb-4" />

      <div class="text-end">
        <v-btn
          class="text-none"
          :color="getCor"
          variant="text"
          width="90"
          @click="isOpen = false"
        >
          Fechar
        </v-btn>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  type Tipo = 'sucesso' | 'erro'

  const props = withDefaults(
    defineProps<{
      tipo?: Tipo;
      texto: string;
    }>(),
    {
      tipo: 'sucesso',
    }
  );

  const isOpen = defineModel<boolean>()

  const getCor = computed(() => {
    return props.tipo === 'sucesso' ? 'success' : 'error'
  })

  const getIcon = computed(() => {
    return props.tipo === 'sucesso' ? 'mdi-check-circle' : 'mdi-alert-circle'
  })

</script>

<style lang="scss" scoped></style>

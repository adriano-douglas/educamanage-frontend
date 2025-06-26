<template>
  <v-dialog v-model="isOpen" persistent>
    <v-sheet
      class="pa-4 text-center mx-auto"
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
    >
      <v-icon
        class="mb-5"
        color="warning"
        icon="mdi-alert-outline"
        size="80"
      />

      <h2 class="text-h6 mb-6">{{ props.texto }}</h2>

      <p class="mb-4 text-medium-emphasis text-body-1">
        Essa ação não poderá ser desfeita.
      </p>

      <v-divider class="mb-4" />

      <div class="text-end">
        <v-btn
          class="text-none"
          color="grey-darken-1"
          variant="text"
          width="90"
          @click="isOpen = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="text-none"
          color="success"
          variant="text"
          width="90"
          @click="onConfirmar"
        >
          Confirmar
        </v-btn>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">

  const isOpen = defineModel<boolean>()

  const emit = defineEmits(['excluir'])

  const props = withDefaults(
    defineProps<{
      texto?: string;
    }>(),
    {
      texto: 'Deseja realmente excluir o registro?',
    }
  );

  const onConfirmar = () => {
    emit('excluir', true)
  }

</script>

<style lang="scss" scoped></style>

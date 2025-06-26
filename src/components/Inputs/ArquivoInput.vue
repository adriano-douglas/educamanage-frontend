<template>
  <v-file-input
    v-model="model"
    :accept="accept"
    :chips="chips"
    :clearable="clearable"
    :color="color"
    :label="label"
    :variant="variant"
  />
</template>

<script setup lang="ts">
  import { defineModel, defineProps, withDefaults } from 'vue'

  type VariantType = 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'

  const model = defineModel<File | null>()

  withDefaults(
    defineProps<{
      clearable?: boolean
      color?: string
      placeholder?: string
      label: string
      variant?: VariantType
      accept?: string
      chips?: boolean
    }>(),
    {
      clearable: true,
      color: 'success',
      placeholder: undefined,
      variant: 'outlined',
      accept: 'image/*',
      chips: true,
    }
  )

</script>

<style lang="scss" scoped></style>

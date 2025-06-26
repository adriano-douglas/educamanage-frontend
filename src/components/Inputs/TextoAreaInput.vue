<template>
  <v-textarea
    v-model="model"
    :auto-grow="autoGrow"
    :clearable="clearable"
    :color="color"
    :counter="counter"
    :label="label"
    :rows="rows"
    :variant="variant"
  />
</template>

<script setup lang="ts">
  import { defineModel, defineProps, withDefaults } from 'vue'

  type VariantType = 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'

  const model = defineModel<string | unknown>()

  withDefaults(
    defineProps<{
      clearable?: boolean
      color?: string
      counter?: string | number | true
      placeholder?: string
      label: string
      variant?: VariantType
      autoGrow?: boolean
      rows?: string | number
    }>(),
    {
      clearable: true,
      color: 'success',
      counter: 100,
      placeholder: undefined,
      variant: 'outlined',
      autoGrow: true,
      rows: 1,
    }
  )

</script>

<style lang="scss" scoped></style>

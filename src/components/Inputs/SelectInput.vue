<template>
  <v-select
    v-model="model"
    :chips="chips"
    :clearable="clearable"
    :closable-chips="closableChips"
    :color="color"
    :items="items"
    :label="label"
    :multiple="multiple"
    :variant="variant"
  />
</template>

<script setup lang="ts">
  import { defineModel, defineProps, withDefaults } from 'vue'

  type VariantType = 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'

  const model = defineModel<string[] | null>()

  withDefaults(
    defineProps<{
      clearable?: boolean
      color?: string
      placeholder?: string
      label: string
      variant?: VariantType
      chips?: boolean
      items?: string[]
      multiple?: true
      closableChips?: boolean
    }>(),
    {
      clearable: true,
      color: 'success',
      placeholder: undefined,
      variant: 'outlined',
      chips: true,
      items: undefined,
      multiple: true,
      closableChips: true,
    }
  )

</script>

<style lang="scss" scoped></style>

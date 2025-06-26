<template>
  <v-text-field
    v-model="model"
    v-maska="maska"
    :clearable="clearable"
    :color="color"
    :counter="contador"
    :label="label"
    :type="type"
    :variant="variant"
  />
</template>

<script setup lang="ts">
  import { computed, defineModel, defineProps, withDefaults } from 'vue'

  type VariantType = 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  type TypeType = 'text' | 'email'

  const model = defineModel<string | unknown>()

  const props = withDefaults(
    defineProps<{
      clearable?: boolean
      color?: string
      counter?: string | number | boolean
      placeholder?: string
      label: string
      variant?: VariantType
      type?: TypeType
      maska?: string
    }>(),
    {
      clearable: true,
      color: 'success',
      counter: 30,
      placeholder: undefined,
      variant: 'outlined',
      type: 'text',
      maska: undefined,
    }
  )

  const contador = computed(() => {
    return props.type === 'email' ? 50 : props.counter
  })

</script>

<style lang="scss" scoped></style>

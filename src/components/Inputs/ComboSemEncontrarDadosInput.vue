<template>
  <v-combobox
    v-model="model"
    v-model:search="search"
    :clearable="clearable"
    :color="color"
    :hide-no-data="hideNoData"
    :items="items"
    :label="label"
    :variant="variant"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          Nenhum resultado corrrespondente "<strong>{{ search }}</strong>". Pressione <kbd>enter</kbd> para criar um novo
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script setup lang="ts">
  import { defineModel, defineProps, ref, withDefaults } from 'vue'

  type VariantType = 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'

  const model = defineModel<string | null>()
  const search = ref(null)

  withDefaults(
    defineProps<{
      clearable?: boolean
      color?: string
      placeholder?: string
      label: string
      variant?: VariantType
      items?: string[]
      hideNoData?: boolean
    }>(),
    {
      clearable: true,
      color: 'success',
      placeholder: undefined,
      variant: 'outlined',
      hideNoData: false,
      items: undefined,
    }
  )

</script>

<style lang="scss" scoped></style>

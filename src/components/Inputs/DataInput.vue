<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y transition="scale-transition">
    <template #activator="{ props }">
      <v-text-field
        v-bind="props"
        v-model="dataFormatada"
        :clearable="clearable"
        :color="color"
        :density="density"
        :error-messages="errorMessages"
        :label="label"
        :placeholder="placeholder"
        :prepend-icon="prependIcon"
        :readonly="readonly"
        :variant="variant"
        @click:clear="model = null"
      />
    </template>

    <v-date-picker v-model="model" :color="color" @update:model-value="menu = false" />
  </v-menu>
</template>

<script setup lang="ts">
  import { format } from 'date-fns';
  import { computed, defineModel, defineProps, ref, withDefaults } from 'vue'
  import type { Density } from 'vuetify/lib/composables/density.mjs';
  import type { IconValue } from 'vuetify/lib/composables/icons.mjs';

  type VariantType = 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'

  const model = defineModel<Date | null | string>()
  const menu = ref<boolean>(false)

  withDefaults(
    defineProps<{
      clearable?: boolean
      color?: string
      placeholder?: string
      errorMessages?: string | readonly string[] | null
      label: string
      variant?: VariantType
      prependIcon?: IconValue
      readonly?: boolean | null
      density?: Density
    }>(),
    {
      clearable: true,
      color: 'success',
      placeholder: 'dd/mm/aaaa',
      variant: 'outlined',
      prependIcon: 'mdi-calendar',
      readonly: true,
    }
  )

  const dataFormatada = computed({
    get: () => model.value ? format(model.value.toString(), 'dd/MM/yyyy') : null,
    set: val => model.value = val,
  })

</script>

<style lang="scss" scoped></style>

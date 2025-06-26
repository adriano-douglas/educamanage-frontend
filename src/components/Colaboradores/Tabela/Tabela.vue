<template>
  <v-data-table-server
    :headers="headers"
    item-value="matricula"
    :items="props.serverItems"
    :items-length="props.totalItems"
    :items-per-page="props.itemsPerPage"
    :items-per-page-options="[5, 10, 15, 20]"
    items-per-page-text="Itens por página:"
    :loading="props.loading"
    no-data-text="Nenhum resultado encontrado"
    :page-text="'Exibindo {0}-{1} de {2}'"
    :search="props.search"
    :server-items-length="props.totalItems"
    @update:options="updateOptions"
  >
    <template #item.acoes="{ item }">
      <v-btn
        color="grey-darken-1"
        icon="mdi-magnify"
        size="large"
        variant="text"
        @click="emit('detalhar', item)"
      />
      <v-btn
        color="grey-darken-1"
        icon="mdi-pencil"
        size="large"
        variant="text"
        @click="emit('editar', item)"
      />
      <v-btn
        color="grey-darken-1"
        icon="mdi-delete"
        size="large"
        variant="text"
        @click="emit('excluir', item)"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const emit = defineEmits(['update-options', 'editar', 'excluir', 'detalhar'])

  const props = withDefaults(
    defineProps<{
      search?: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serverItems?: any[]
      loading?: boolean
      itemsPerPage?: number
      totalItems?: number
    }>(),
    {
      search: '',
      loading: false,
      itemsPerPage: 5,
      totalItems: 0,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers = ref<any>([
    { title: 'Nome', align: 'start', sortable: false, key: 'nome' },
    { title: 'CPF', align: 'start', sortable: false, key: 'cpf' },
    { title: 'Email', align: 'start', sortable: false, key: 'email' },
    { title: 'Celular', align: 'start', sortable: false, key: 'celular' },
    { title: 'Data Nascimento', align: 'start', sortable: false, key: 'dataNascimento' },
    { title: 'Matrícula', align: 'start', sortable: false, key: 'matricula' },
    { title: 'Ações', align: 'end', sortable: false, key: 'acoes' },
  ])

  const updateOptions = (options: { page: number, itemsPerPage: number }) => {

    emit('update-options', options)

  }

</script>

<style lang="scss" scoped></style>

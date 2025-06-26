<template>
  <v-expansion-panels class="border-sm border-success rounded-lg" elevation="0">
    <v-expansion-panel class="rounded-lg">

      <v-expansion-panel-title class="py-7">
        <span class="text-h6 text-grey-darken-2">Filtro</span>
        <template #actions="{ expanded }">
          <v-btn
            :color="!expanded ? 'teal' : 'error'"
            :icon="expanded ? 'mdi-filter-remove' : 'mdi-filter-menu'"
            variant="tonal"
          />
        </template>
      </v-expansion-panel-title>

      <v-expansion-panel-text class="border-t-sm">
        <v-form @submit.prevent="onSubmit">
          <v-row class="d-flex ma-0">

            <v-col lg="3" md="6">
              <TextoInput v-model="nome" density="comfortable" :error-messages="errors.nome" label="Nome" />
            </v-col>

            <v-col lg="4" md="6">
              <TextoInput
                v-model="email"
                density="comfortable"
                :error-messages="errors.email"
                label="E-mail"
                type="email"
              />
            </v-col>

            <v-col lg="2" md="6">
              <TextoInput
                v-model="cpf"
                :counter="false"
                density="comfortable"
                :error-messages="errors.cpf"
                label="CPF"
                maska="###.###.###-##"
              />
            </v-col>

            <v-col lg="3" md="6">
              <DataInput
                v-model="dataNascimento"
                :density="'comfortable'"
                :error-messages="errors.dataNascimento"
                label="Data Nascimento"
              />
            </v-col>

            <v-col lg="3" md="6">
              <TextoInput
                v-model="celular"
                :counter="false"
                density="comfortable"
                :error-messages="errors.celular"
                label="Celular"
                maska="(##) #####-####"
              />
            </v-col>

            <v-col lg="2" md="6">
              <TextoInput
                v-model="matricula"
                :counter="10"
                density="comfortable"
                :error-messages="errors.matricula"
                label="Matrícula"
              />
            </v-col>

            <v-col lg="3" md="6">
              <DataInput
                v-model="dataAdmissao"
                :density="'comfortable'"
                :error-messages="errors.dataAdmissao"
                label="Data Admissão"
              />
            </v-col>

            <v-col lg="4" md="6">
              <TextoInput
                v-model="emailCorporativo"
                density="comfortable"
                :error-messages="errors.emailCorporativo"
                label="E-mail Corporativo"
                type="email"
              />
            </v-col>

            <v-col lg="2" md="6">
              <ComboSemEncontrarDadosInput
                v-model="setor"
                density="comfortable"
                :error-messages="errors.setor"
                :items="props?.items?.setor"
                label="Setor"
              />
            </v-col>

            <v-col lg="2" md="6">
              <ComboSemEncontrarDadosInput
                v-model="cargo"
                density="comfortable"
                :error-messages="errors.cargo"
                :items="props?.items?.cargo"
                label="Cargo"
              />
            </v-col>

            <v-col lg="5" md="6">
              <TextoAreaInput v-model="funcao" density="comfortable" :error-messages="errors.funcao" label="Função" />
            </v-col>

            <v-col lg="3" md="6">
              <SelectInput
                v-model="roles"
                density="comfortable"
                :error-messages="errors.roles"
                :items="['ADMINISTRADOR', 'COLABORADOR']"
                label="Roles"
              />
            </v-col>

          </v-row>

          <v-card-actions class="d-flex justify-end ga-5 my-2 px-3">
            <v-btn variant="text" @click="resetForm">Limpar</v-btn>
            <v-btn color="teal" prepend-icon="mdi-filter" type="submit" variant="elevated">Filtrar</v-btn>
          </v-card-actions>
        </v-form>
      </v-expansion-panel-text>

    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
  import { useField, useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import TextoInput from '@/components/Inputs/TextoInput.vue'
  import DataInput from '@/components/Inputs/DataInput.vue'
  import ComboSemEncontrarDadosInput from '@/components/Inputs/ComboSemEncontrarDadosInput.vue'
  import TextoAreaInput from '@/components/Inputs/TextoAreaInput.vue'
  import SelectInput from '@/components/Inputs/SelectInput.vue'
  import type { FiltroColaboradorRequest } from '@/types/colaborador/FiltroColaboradorRequest'
  import { schemaFiltroColaborador } from '../validadorFiltroColaborador'
  import { computed } from 'vue'

  const emit = defineEmits(['filtrar'])

  const props = withDefaults(
    defineProps<{
      items?: {
        setor?: string[],
        cargo?: string[]
      }
    }>(),
    {}
  );

  const { handleSubmit, errors, resetForm } = useForm<FiltroColaboradorRequest>({
    initialValues: {
      nome: null,
      email: null,
      cpf: null,
      dataNascimento: null,
      celular: null,
      matricula: null,
      dataAdmissao: null,
      emailCorporativo: null,
      setor: null,
      cargo: null,
      funcao: null,
      roles: null,
    },
    validationSchema: toTypedSchema(schemaFiltroColaborador),
  })

  const { value: nome } = useField<string | null>('nome')
  const { value: email } = useField<string | null>('email')
  const { value: cpf } = useField<string | null>('cpf')
  const { value: dataNascimento } = useField<Date | null>('dataNascimento')
  const { value: celular } = useField<string | null>('celular')
  const { value: matricula } = useField<string | null>('matricula')
  const { value: dataAdmissao } = useField<Date | null>('dataAdmissao')
  const { value: emailCorporativo } = useField<string | null>('emailCorporativo')
  const { value: setor } = useField<string | null>('setor')
  const { value: cargo } = useField<string | null>('cargo')
  const { value: funcao } = useField<string | null>('funcao')
  const { value: roles } = useField<string[] | null>('roles')

  const filtroUrl = computed<string>(() => {
    let filtros = ''
    filtros += nome.value ? `&nome=${nome.value}` : ''
    filtros += email.value ? `&email=${email.value}` : ''
    filtros += cpf.value ? `&cpf=${cpf.value}` : ''
    filtros += dataNascimento.value ? `&dataNascimento=${dataNascimento.value?.toISOString().replace('Z', '')}` : ''
    filtros += celular.value ? `&celular=${celular.value}` : ''
    filtros += matricula.value ? `&matricula=${matricula.value}` : ''
    filtros += dataAdmissao.value ? `&dataAdmissao=${dataAdmissao.value?.toISOString().replace('Z', '')}` : ''
    filtros += emailCorporativo.value ? `&emailCorporativo=${emailCorporativo.value}` : ''
    filtros += setor.value ? `&setor=${setor.value}` : ''
    filtros += cargo.value ? `&cargo=${cargo.value}` : ''
    filtros += funcao.value ? `&funcao=${funcao.value}` : ''
    filtros += roles.value ? `&roles=${roles.value?.toString()}` : ''
    return filtros
  })

  const onSubmit = handleSubmit(values => {
    const payload = {
      ...values,
      dataNascimento: values?.dataNascimento?.toISOString().replace('Z', ''),
      dataAdmissao: values?.dataAdmissao?.toISOString().replace('Z', ''),
      filtroUrl: filtroUrl.value,
    }

    emit('filtrar', payload)
  })

</script>

<style lang="scss" scoped>
.v-col {
  padding: 4px;
}
</style>

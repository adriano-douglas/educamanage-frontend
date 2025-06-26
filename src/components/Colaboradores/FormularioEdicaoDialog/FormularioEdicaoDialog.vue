<template>
  <v-dialog max-width="900px" :model-value="isOpen" persistent>
    <v-card :loading="props?.loadingDados">
      <v-card-title class="px-5 py-7">
        <span class="text-h5">Editar Colaborador</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent>
          <v-row class="d-flex ma-0">

            <v-col cols="6">
              <TextoInput v-model="nome" :error-messages="errorsInd.nome" label="Nome" />
            </v-col>

            <v-col cols="6">
              <TextoInput v-model="email" :error-messages="errorsInd.email" label="E-mail" type="email" />
            </v-col>

            <v-col cols="4">
              <TextoInput
                v-model="cpf"
                :counter="false"
                :error-messages="errorsInd.cpf"
                label="CPF"
                maska="###.###.###-##"
              />
            </v-col>

            <v-col cols="4">
              <DataInput
                v-model="dataNascimento"
                :error-messages="errorsInd.dataNascimento"
                label="Data Nascimento"
              />
            </v-col>

            <v-col cols="4">
              <TextoInput
                v-model="celular"
                :counter="false"
                :error-messages="errorsInd.celular"
                label="Celular"
                maska="(##) #####-####"
              />
            </v-col>

            <v-col cols="4">
              <ArquivoInput v-model="fotoPerfil" :error-messages="errorsInd.fotoPerfil" label="Foto Perfil" />
            </v-col>

            <v-col cols="4">
              <TextoInput
                v-model="matricula"
                :counter="10"
                :error-messages="errorsInd.matricula"
                label="Matrícula"
              />
            </v-col>

            <v-col cols="4">
              <DataInput v-model="dataAdmissao" :error-messages="errorsInd.dataAdmissao" label="Data Admissão" />
            </v-col>

            <v-col cols="4">
              <TextoInput
                v-model="emailCorporativo"
                :error-messages="errorsInd.emailCorporativo"
                label="E-mail Corporativo"
                type="email"
              />
            </v-col>

            <v-col cols="4">
              <ComboSemEncontrarDadosInput
                v-model="setor"
                :error-messages="errorsInd.setor"
                :items="props?.items?.setor"
                label="Setor"
              />
            </v-col>

            <v-col cols="4">
              <ComboSemEncontrarDadosInput
                v-model="cargo"
                :error-messages="errorsInd.cargo"
                :items="props?.items?.cargo"
                label="Cargo"
              />
            </v-col>

            <v-col cols="6">
              <TextoAreaInput v-model="funcao" :error-messages="errorsInd.funcao" label="Função" />
            </v-col>

            <v-col cols="6">
              <SelectInput
                v-model="roles"
                :error-messages="errorsInd.roles"
                :items="['ADMINISTRADOR', 'COLABORADOR']"
                label="Roles"
              />
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="d-flex mx-5 my-2 ga-5 pa-0">
        <v-btn variant="text" @click="isOpen = false">Cancelar</v-btn>
        <v-btn color="success" :disabled="loadingDados" variant="elevated" @click="onSalvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { useField, useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { watch } from 'vue'
  import TextoInput from '@/components/Inputs/TextoInput.vue'
  import DataInput from '@/components/Inputs/DataInput.vue'
  import ArquivoInput from '@/components/Inputs/ArquivoInput.vue'
  import ComboSemEncontrarDadosInput from '@/components/Inputs/ComboSemEncontrarDadosInput.vue'
  import TextoAreaInput from '@/components/Inputs/TextoAreaInput.vue'
  import SelectInput from '@/components/Inputs/SelectInput.vue'
  import { schemaCadastroEdicaoIndividual } from '../validadorCadastroEdicaoColaborador'
  import type { CadastroEdicaoColaboradorIndRequest } from '@/types/colaborador/CadastroEdicaoColaboradorIndRequest'
  import type { DadosColaboradorResponse } from '@/types/colaborador/DadosColaboradorResponse'
  import { parse } from 'date-fns'

  const isOpen = defineModel<boolean>()

  const emit = defineEmits(['salvar'])

  const props = withDefaults(
    defineProps<{
      items?: {
        setor?: string[],
        cargo?: string[]
      }
      dadosFormulario?: DadosColaboradorResponse
      loadingDados?: boolean
    }>(),
    {
      loadingDados: true,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch(isOpen, (newv, _oldv) => {
    if (newv) {
      resetFormEdicao()
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch(props, (newv, _oldv) => {
    if (newv && !props?.loadingDados) {
      const dados = { ...newv?.dadosFormulario }
      nome.value = dados?.nome
      email.value = dados?.email
      cpf.value = dados?.cpf
      dataNascimento.value = dados?.dataNascimento ? parse(dados?.dataNascimento, 'dd/MM/yyyy', new Date()) : null
      celular.value = dados?.celular
      matricula.value = dados?.matricula
      dataAdmissao.value = dados?.dataAdmissao ? parse(dados?.dataAdmissao, 'dd/MM/yyyy', new Date()) : null
      emailCorporativo.value = dados?.emailCorporativo
      setor.value = dados?.setor
      cargo.value = dados?.cargo
      funcao.value = dados?.funcao
      roles.value = dados?.roles
    }
  })

  const {
    handleSubmit: handleSubmitInd,
    errors: errorsInd,
    resetForm: resetFormEdicao,
  } = useForm<CadastroEdicaoColaboradorIndRequest>({
    initialValues: { funcao: null, fotoPerfil: null },
    validationSchema: toTypedSchema(schemaCadastroEdicaoIndividual),
  })

  const { value: nome } = useField<string | null | undefined>('nome')
  const { value: email } = useField<string | null | undefined>('email')
  const { value: cpf } = useField<string | null | undefined>('cpf')
  const { value: dataNascimento } = useField<Date | null | undefined>('dataNascimento')
  const { value: celular } = useField<string | null | undefined>('celular')
  const { value: fotoPerfil } = useField<File | null | undefined>('fotoPerfil')
  const { value: matricula } = useField<string | null | undefined>('matricula')
  const { value: dataAdmissao } = useField<Date | null | undefined>('dataAdmissao')
  const { value: emailCorporativo } = useField<string | null | undefined>('emailCorporativo')
  const { value: setor } = useField<string | null | undefined>('setor')
  const { value: cargo } = useField<string | null | undefined>('cargo')
  const { value: funcao } = useField<string | null | undefined>('funcao')
  const { value: roles } = useField<string[] | null | undefined>('roles')

  const onSalvarEdicao = (values: CadastroEdicaoColaboradorIndRequest) => {
    const payload = {
      ...values,
      dataNascimento: values.dataNascimento.toISOString().replace('Z', ''),
      dataAdmissao: values.dataAdmissao.toISOString().replace('Z', ''),
    }

    emit('salvar', payload)
  }

  const onSalvar = () => {
    handleSubmitInd(onSalvarEdicao)()
  }

</script>

<style lang="scss" scoped>
.v-col {
  padding: 8px;
}
</style>

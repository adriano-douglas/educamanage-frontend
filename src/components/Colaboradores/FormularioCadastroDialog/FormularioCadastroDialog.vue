<template>
  <v-dialog max-width="900px" :model-value="aberto" persistent>
    <v-card>
      <v-card-title class="px-5 py-7">
        <span class="text-h5">Cadastrar Colaborador</span>
      </v-card-title>

      <v-tabs v-model="aba" class="px-5" color="success">
        <v-tab value="individual">Individual</v-tab>
        <v-tab value="coletivo">Coletivo</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="aba">
          <v-tabs-window-item value="individual">
            <v-form @submit.prevent>
              <v-row class="ma-0 pa-2">
                <v-col cols="6">
                  <TextoInput v-model="nome" :error-messages="errosInd.nome" label="Nome" />
                </v-col>

                <v-col cols="6">
                  <TextoInput v-model="email" :error-messages="errosInd.email" label="E-mail" type="email" />
                </v-col>

                <v-col cols="4">
                  <TextoInput
                    v-model="cpf"
                    :counter="false"
                    :error-messages="errosInd.cpf"
                    label="CPF"
                    maska="###.###.###-##"
                  />
                </v-col>

                <v-col cols="4">
                  <DataInput
                    v-model="dataNascimento"
                    :error-messages="errosInd.dataNascimento"
                    label="Data de nascimento"
                  />
                </v-col>

                <v-col cols="4">
                  <TextoInput
                    v-model="celular"
                    :counter="false"
                    :error-messages="errosInd.celular"
                    label="Celular"
                    maska="(##) #####-####"
                  />
                </v-col>

                <v-col cols="4">
                  <ArquivoInput v-model="fotoPerfil" :error-messages="errosInd.fotoPerfil" label="Foto de perfil" />
                </v-col>

                <v-col cols="4">
                  <TextoInput
                    v-model="matricula"
                    :counter="10"
                    :error-messages="errosInd.matricula"
                    label="Matrícula"
                  />
                </v-col>

                <v-col cols="4">
                  <DataInput
                    v-model="dataAdmissao"
                    :error-messages="errosInd.dataAdmissao"
                    label="Data de admissão"
                  />
                </v-col>

                <v-col cols="4">
                  <TextoInput
                    v-model="emailCorporativo"
                    :error-messages="errosInd.emailCorporativo"
                    label="E-mail corporativo"
                    type="email"
                  />
                </v-col>

                <v-col cols="4">
                  <ComboSemEncontrarDadosInput
                    v-model="setor"
                    :error-messages="errosInd.setor"
                    :items="props?.items?.setor"
                    label="Setor"
                  />
                </v-col>

                <v-col cols="4">
                  <ComboSemEncontrarDadosInput
                    v-model="cargo"
                    :error-messages="errosInd.cargo"
                    :items="props?.items?.cargo"
                    label="Cargo"
                  />
                </v-col>

                <v-col cols="6">
                  <TextoAreaInput v-model="funcao" :error-messages="errosInd.funcao" label="Função" />
                </v-col>

                <v-col cols="6">
                  <SelectInput
                    v-model="roles"
                    :error-messages="errosInd.roles"
                    :items="['ADMINISTRADOR', 'COLABORADOR']"
                    label="Perfis (roles)"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>

          <v-tabs-window-item value="coletivo">
            <v-alert
              border="start"
              class="mx-2 my-5"
              prominent
              type="info"
              variant="outlined"
            >
              <b>Padrão de cada linha do CSV (sem cabeçalho):</b>

              <div class="mt-2 d-flex flex-wrap gap-2">
                <v-chip
                  v-for="(campo, i) in camposCsv"
                  :key="campo"
                  color="primary"
                  size="small"
                  variant="outlined"
                >
                  {{ i + 1 }} — {{ campo }}
                </v-chip>
              </div>

              <v-sheet
                class="bg-grey-lighten-4 rounded pa-3 mt-3 text-caption"
                elevation="0"
              >
                <code>{{ linhaExemplo }}</code>
              </v-sheet>

              <v-btn class="mt-2" size="small" variant="text" @click="baixarModeloCsv">
                <v-icon start>mdi-download</v-icon>Baixar modelo
              </v-btn>
            </v-alert>

            <v-form @submit.prevent>
              <v-col cols="12">
                <ArquivoInput
                  v-model="arquivoCsv"
                  accept=".csv,text/csv"
                  :error-messages="errosCol.arquivoCsv"
                  label="Arquivo CSV"
                  :prepend-icon="false"
                  prepend-inner-icon="mdi-paperclip"
                />
              </v-col>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-divider />

      <v-card-actions class="d-flex mx-5 my-2 ga-5 pa-0">
        <v-btn variant="text" @click="aberto = false">Cancelar</v-btn>
        <v-btn color="success" variant="elevated" @click="aoSalvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { useField, useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { ref, watch } from 'vue'

  import TextoInput from '@/components/Inputs/TextoInput.vue'
  import DataInput from '@/components/Inputs/DataInput.vue'
  import ArquivoInput from '@/components/Inputs/ArquivoInput.vue'
  import ComboSemEncontrarDadosInput from '@/components/Inputs/ComboSemEncontrarDadosInput.vue'
  import TextoAreaInput from '@/components/Inputs/TextoAreaInput.vue'
  import SelectInput from '@/components/Inputs/SelectInput.vue'

  import {
    schemaCadastroColetivo,
    schemaCadastroEdicaoIndividual,
  } from '../validadorCadastroEdicaoColaborador'

  import type { CadastroEdicaoColaboradorIndRequest } from '@/types/colaborador/CadastroEdicaoColaboradorIndRequest'
  import type { CadastroColaboradorColRequest } from '@/types/colaborador/CadastroColaboradorColRequest'

  const aba = ref<'individual' | 'coletivo'>('individual')
  const aberto = defineModel<boolean>()
  const emitir = defineEmits(['salvar'])

  const props = withDefaults(
    defineProps<{ items?: { setor?: string[]; cargo?: string[] } }>(),
    {}
  )

  watch(aberto, on => {
    if (on) {
      limparFormInd()
      limparFormCol()
      aba.value = 'individual'
    }
  })

  const {
    handleSubmit: submeterInd,
    errors: errosInd,
    resetForm: limparFormInd,
  } = useForm<CadastroEdicaoColaboradorIndRequest>({
    initialValues: { funcao: null, fotoPerfil: null },
    validationSchema: toTypedSchema(schemaCadastroEdicaoIndividual),
  })

  const { value: nome } = useField('nome')
  const { value: email } = useField('email')
  const { value: cpf } = useField('cpf')
  const { value: dataNascimento } = useField<Date>('dataNascimento')
  const { value: celular } = useField('celular')
  const { value: fotoPerfil } = useField<File | null>('fotoPerfil')
  const { value: matricula } = useField('matricula')
  const { value: dataAdmissao } = useField<Date>('dataAdmissao')
  const { value: emailCorporativo } = useField('emailCorporativo')
  const { value: setor } = useField<string | null>('setor')
  const { value: cargo } = useField<string | null>('cargo')
  const { value: funcao } = useField('funcao')
  const { value: roles } = useField<string[] | null>('roles')

  function salvarIndividual (dados: CadastroEdicaoColaboradorIndRequest) {
    emitir('salvar', {
      tipo: 'individual',
      payload: {
        ...dados,
        dataNascimento: dados.dataNascimento.toISOString().replace('Z', ''),
        dataAdmissao: dados.dataAdmissao.toISOString().replace('Z', ''),
      },
    })
  }

  const {
    handleSubmit: submeterCol,
    errors: errosCol,
    resetForm: limparFormCol,
  } = useForm<CadastroColaboradorColRequest>({
    validationSchema: toTypedSchema(schemaCadastroColetivo),
  })

  const { value: arquivoCsv } = useField<File | null>('arquivoCsv')

  const camposCsv = [
    'nome',
    'email',
    'cpf',
    'dataNascimento',
    'celular',
    'matricula',
    'dataAdmissao',
    'emailCorporativo',
    'setor',
    'cargo',
    'funcao',
    'roles',
  ] as const

  const linhaExemplo =
    'Adriano Douglas;adriano.douglas@email.com;12345678901;12/05/1990;11998765432;MAT001;15/01/2015;' +
    'adriano.douglas@empresa.com;TI;Desenvolvedor;Back-end;ADMINISTRADOR,COLABORADOR;'

  function salvarColetivo (dados: CadastroColaboradorColRequest) {
    emitir('salvar', { tipo: 'coletivo', payload: { ...dados } })
  }

  function baixarModeloCsv () {
    const blob = new Blob([linhaExemplo + '\n'], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)

    const link = Object.assign(document.createElement('a'), {
      href: url,
      download: 'modelo_colaborador.csv',
    })
    link.click()
    URL.revokeObjectURL(url)
  }

  function aoSalvar () {
    if (aba.value === 'individual') {
      submeterInd(salvarIndividual)()
    } else {
      submeterCol(salvarColetivo)()
    }
  }
</script>

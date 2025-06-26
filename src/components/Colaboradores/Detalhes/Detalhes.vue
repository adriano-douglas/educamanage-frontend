<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card elevation="5" :loading="props?.loadingDados">
      <v-card-title class="d-flex align-center pa-5 ga-4">
        <v-avatar class="text-white" color="info" size="72">
          <span class="text-h5">{{ iniciais ?? '—' }}</span>
        </v-avatar>
        <div>
          <div class="text-h5 font-weight-bold">{{ props?.dadosColaborador?.nome ?? '—' }}</div>
          <div class="text-body-2 text-grey">{{ props?.dadosColaborador?.cargo ?? '—' }} • {{
            props?.dadosColaborador?.setor ?? '—' }}</div>
        </div>
      </v-card-title>

      <v-card-text class="pa-5 d-flex flex-column ga-4">
        <v-sheet class="pa-3" elevation="1" rounded>
          <div class="text-subtitle-2 font-weight-medium mb-3">Informações Pessoais</div>
          <v-row class="d-flex flex-wrap ga-0">
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">CPF</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.cpf ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Email</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.email ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Nascimento</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.dataNascimento ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Celular</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.celular ?? '—' }}</div>
            </v-col>
          </v-row>
        </v-sheet>

        <v-sheet class="pa-3" elevation="1" rounded>
          <div class="text-subtitle-2 font-weight-medium mb-3">Informações de Trabalho</div>
          <v-row class="d-flex flex-wrap ga-0">
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Matrícula</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.matricula ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Email Corporativo</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.emailCorporativo ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Admissão</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.dataAdmissao ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Cargo</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.cargo ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Setor</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.setor ?? '—' }}</div>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-caption pa-0">Função</v-card-subtitle>
              <div class="text-body-2">{{ props?.dadosColaborador?.funcao ?? '—' }}</div>
            </v-col>
          </v-row>
        </v-sheet>
      </v-card-text>

      <v-divider />

      <v-card-text class="pa-6">
        <div class="text-subtitle-2 font-weight-medium mb-3">Perfis de Acesso</div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="role in props?.dadosColaborador?.roles"
            :key="role"
            color="info"
            size="small"
            variant="outlined"
          >
            {{ role }}
          </v-chip>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-5">
        <v-spacer />
        <v-btn color="info" variant="text" @click="dialog = false">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { DadosColaboradorResponse } from '@/types/colaborador/DadosColaboradorResponse';
  import { computed } from 'vue';

  const dialog = defineModel<boolean>();

  const props = withDefaults(
    defineProps<{
      dadosColaborador?: DadosColaboradorResponse | undefined
      loadingDados?: boolean
    }>(),
    {
      loadingDados: true,
    }
  );

  const iniciais = computed(() =>
    props?.dadosColaborador?.nome
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
  );

</script>

<style scoped></style>

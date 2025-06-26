<template>
  <v-dialog v-model="openLocal" max-width="660" persistent transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="white" elevation="1" flat>
        <v-toolbar-title>
          {{ isEditando ? 'Editar Pergunta' : 'Nova Pergunta' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form @submit.prevent="salvar">
          <Field v-slot="{ value, errorMessage, handleChange, handleBlur }" name="enunciado">
            <v-textarea
              auto-grow
              class="mb-4"
              density="compact"
              :error-messages="errorMessage"
              label="Enunciado"
              :model-value="value"
              rows="2"
              variant="outlined"
              @blur="handleBlur"
              @update:model-value="handleChange"
            />
          </Field>

          <v-select
            v-model="numAlternativas"
            class="mb-4"
            density="compact"
            :items="[2, 3, 4, 5]"
            label="Número de alternativas"
            variant="outlined"
          />

          <v-divider class="mb-4" />

          <v-radio-group v-model="corretaIdx" :error-messages="alternativasError">
            <v-row v-for="(alt, idx) in alternativas" :key="alt.id" class="align-center mb-3">
              <v-col cols="11">
                <Field
                  v-slot="{
                    value,
                    errorMessage,
                    handleChange,
                    handleBlur
                  }"
                  :name="`alternativas.${idx}.texto`"
                >
                  <v-textarea
                    auto-grow
                    density="compact"
                    :error-messages="errorMessage"
                    hide-details="auto"
                    :label="`Alternativa ${idx + 1}`"
                    :model-value="value"
                    rows="1"
                    variant="outlined"
                    @blur="handleBlur"
                    @update:model-value="handleChange"
                  >
                    <template #prepend-inner>
                      <v-avatar
                        class="mr-2"
                        :color="alternativas![idx].flCorreta
                          ? 'success'
                          : 'grey-lighten-3'
                        "
                        size="24"
                      >
                        <span
                          :class="alternativas![idx].flCorreta
                            ? 'text-white'
                            : 'text-grey-darken-3'
                          "
                          style="font-size: 0.7rem"
                        >
                          {{ String.fromCharCode(65 + idx) }}
                        </span>
                      </v-avatar>
                    </template>
                  </v-textarea>
                </Field>
              </v-col>

              <v-col class="d-flex align-center justify-center" cols="1">
                <v-radio color="success" density="compact" :value="idx" />
              </v-col>
            </v-row>
          </v-radio-group>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Cancelar</v-btn>
        <v-btn color="primary" :disabled="loading" :loading="loading" @click="salvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <AvisoDialog v-model="avisoAberto" :texto="textoAviso" :tipo="tipoAviso" />
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { Field, useForm } from 'vee-validate';
  import { z } from 'zod';
  import { toTypedSchema } from '@vee-validate/zod';
  import type { Alternativa, Avaliacao, Pergunta } from '@/types/curso/types';
  import { cadastrarPerguntaRetornoAvaliacao, editarPerguntaRetornoAvaliacao } from '@/services/PerguntaService';

  const avisoAberto = ref<boolean>(false)
  const tipoAviso = ref<'sucesso' | 'erro'>('sucesso')
  const textoAviso = ref<string>('Sucesso!')
  const loading = ref<boolean>(false)

  const genId = () => -(Date.now() + Math.random());

  const props = defineProps<{ pergunta: Pergunta | null, idAvaliacao: number }>();
  const emit = defineEmits<{
    (e: 'cadastro-pergunta-finalizado', avaliacao: Avaliacao): void,
    (e: 'edicao-pergunta-finalizado', avaliacao: Avaliacao): void,
  }>()

  const openLocal = defineModel<boolean>();

  const altSchema = z.object({
    id: z.number(),
    texto: z.string().min(1, 'Campo obrigatório'),
    flCorreta: z.boolean(),
  });

  const formSchema = z
    .object({
      enunciado: z.string().min(1, 'Campo obrigatório'),
      alternativas: z.array(altSchema).min(2).max(5),
    })
    .refine(d => d.alternativas.some(a => a.flCorreta), {
      message: 'Selecione uma alternativa flCorreta',
      path: ['alternativas'],
    });

  const {
    handleSubmit,
    errors,
    resetForm,
    values,
    submitCount,
    setFieldValue,
  } = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: getValoresIniciais(),
  });

  function getValoresIniciais () {
    if (props.pergunta) return props.pergunta;
    return {
      enunciado: '',
      alternativas: Array.from({ length: 4 }, () => ({
        id: genId(),
        texto: '',
        flCorreta: false,
      } as Alternativa)),
    };
  }

  const alternativas = computed(() => values.alternativas);

  const corretaIdx = computed<number>({
    get: () => alternativas.value!.findIndex(a => a.flCorreta),
    set: idx => {
      const chosenId = alternativas.value![idx]?.id;
      setAlternativaComoCorreta(chosenId);
    },
  });

  function setAlternativaComoCorreta (id?: number) {
    const updated = alternativas.value!.map(a => ({
      ...a,
      flCorreta: a.id === id,
    }));
    writeAlts(updated);
  }

  function writeAlts (arr: Alternativa[]) {
    setFieldValue('alternativas', arr);
  }

  const numAlternativas = computed({
    get: () => alternativas.value!.length,
    set: n => setAlternativeCount(n as number),
  });

  function setAlternativeCount (n: number) {
    const currentList = alternativas.value;
    const currentCorr = currentList!.find(a => a.flCorreta)?.id;

    let arr: Alternativa[];

    if (n >= currentList!.length) {
      const blanks = Array.from({ length: n - currentList!.length }, () => ({
        id: genId(),
        texto: '',
        flCorreta: false,
      } as Alternativa));
      arr = [...currentList!, ...blanks];
    } else {
      arr = currentList!.slice(0, n);
    }

    if (!arr.some(a => a.id === currentCorr)) {
      arr = arr.map(a => ({ ...a, flCorreta: false }));
    }

    const first = arr.findIndex(a => a.flCorreta);
    if (first !== -1) {
      arr = arr.map((a, i) => ({ ...a, flCorreta: i === first }));
    }

    writeAlts(arr);
  }

  const alternativasError = computed<string | undefined>(() =>
    submitCount.value > 0
      ? (errors.value as Record<string, string | undefined>).alternativas
      : undefined,
  );

  function close () {
    openLocal.value = false;
    resetForm({
      values: getValoresIniciais(),
      errors: {},
      touched: {},
      submitCount: 0,
    });
  }

  function formatarPayload (basePergunta: Pergunta): Pergunta {
    return {
      id: basePergunta.id ? basePergunta.id : null,
      idAvaliacao: props.idAvaliacao,
      enunciado: basePergunta.enunciado,
      alternativas: (basePergunta.alternativas || []).map(a => ({
        ...a,
        id: a.id != null && a.id >= 0 ? a.id : null,
      })),
    } as Pergunta
  }

  const salvar = handleSubmit(vals => {
    const pergunta = formatarPayload({ ...props.pergunta, ...vals } as Pergunta)

    handleSalvar(pergunta)
  })

  const handleSalvar = async (payload: Pergunta) => {
    loading.value = true
    try {

      if (!isEditando.value) {
        const response = (await cadastrarPerguntaRetornoAvaliacao(payload)).content as Avaliacao
        emit('cadastro-pergunta-finalizado', response)

        close()
        return
      }

      const response = (await editarPerguntaRetornoAvaliacao(payload.id, payload)).content as Avaliacao
      emit('edicao-pergunta-finalizado', response)

      close()
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tipoAviso.value = 'erro'
      textoAviso.value = error?.response?.data?.message || 'Erro inesperado'
      avisoAberto.value = true
    } finally {
      loading.value = false
    }
  }

  watch(
    () => openLocal.value,
    opened =>
      opened &&
      resetForm({
        values: getValoresIniciais(),
        errors: {},
        touched: {},
        submitCount: 0,
      }),
  );

  watch(
    () => props.pergunta,
    () =>
      resetForm({
        values: getValoresIniciais(),
        errors: {},
        touched: {},
        submitCount: 0,
      }),
  );

  const isEditando = computed(() => !!props.pergunta?.id);
</script>

<style scoped></style>

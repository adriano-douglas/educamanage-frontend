/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'
import DateFnsAdapter from '@date-io/date-fns'
import { ptBR } from 'date-fns/locale'
import { VStepperVertical, VStepperVerticalActions, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  components: {
    VStepperVertical,
    VStepperVerticalActions,
    VStepperVerticalItem,
  },
  locale: {
    locale: 'pt',
    fallback: 'pt',
    messages: { pt },
  },
  date: {
    adapter: new DateFnsAdapter({
      locale: ptBR,
    }),
  },
})

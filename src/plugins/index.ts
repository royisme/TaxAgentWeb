/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { vuetify } from './vuetify'
import pinia from '../stores'
import router from '../router'

// Types
import type { App } from 'vue'
import auth0 from './auth0'
export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(auth0)
    .use(pinia)
}

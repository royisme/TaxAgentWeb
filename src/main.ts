/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Pinia

// Styles
import './styles/main.scss'
const app = createApp(App)

// Register Plugins
registerPlugins(app)
// Mount App
app.mount('#app')

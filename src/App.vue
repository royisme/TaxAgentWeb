<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
  import { useThemeStore } from '@/stores/theme'
  import { useAuth0 } from '@auth0/auth0-vue'
  const themeStore = useThemeStore()
  const authStore = useAuthStore()
  const us = useAuth0()
  themeStore.initializeTheme()
  console.log('App.vue',us)

</script>

<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </v-app>
</template>
<style>
#app {
  width: 100%;
  height: 100%;
}
</style>

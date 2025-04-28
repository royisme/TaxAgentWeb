<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="text-2xl font-bold">Loading...</div>
    <v-progress-circular color="primary" indeterminate />
  </div>
</template>
<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  authStore.initializeAuth()

</script>

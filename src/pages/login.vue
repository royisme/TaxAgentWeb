<template>
  <div class="auth-page">
    <v-card class="auth-card mx-auto" max-width="450">
      <v-card-title class="text-center pt-5">
        <div class="logo-container mb-4">
          <v-icon color="primary" size="x-large">mdi-shield</v-icon>
        </div>
        <h1 class="text-h4 font-weight-bold">Welcome Back</h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-2">
          Sign in to continue to your account
        </p>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="auth0Error"
          class="mb-4"
          closable
          type="error"
          variant="tonal"
          @click:close="auth0ClearError"
        >
          {{ auth0Error?.message || 'An authentication error occurred.' }}
        </v-alert>
        <div v-if="isLoading" class="text-center my-4">
          <v-progress-circular color="primary" indeterminate />
          <p>{{ auth0IsLoading ? 'Processing authentication...' : 'Redirecting...' }}</p>
        </div>
        <!-- Firebase UI 容器 -->
        <v-btn
          block
          class="google-btn"
          color="primary"
          :disabled="auth0IsLoading || auth0IsAuthenticated"
          :loading="isLoading"
          prepend-icon="mdi-google"
          size="large"
          @click="handleLogin"
        >
          Login with Google </v-btn>
      </v-card-text>

      <v-card-text class="text-center text-caption pt-0">
        <p class="text-medium-emphasis">
          By signing in, you agree to our
          <a class="text-decoration-none" href="#">Terms of Service</a> and
          <a class="text-decoration-none" href="#">Privacy Policy</a>
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

  <script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { useThemeStore } from '@/stores/theme';
  import { useAuth0 } from '@auth0/auth0-vue';

  const themeStore = useThemeStore();

  // Get Auth0 composable methods and state
  const {
    isAuthenticated: auth0IsAuthenticated, // Rename to avoid conflict if you still have a local isAuthenticated ref
    user: auth0User, // Rename
    isLoading: auth0IsLoading, // Rename
    error: auth0Error, // Rename
    loginWithRedirect,
    // loginWithPopup, // Use if you prefer popup
    // getAccessTokenSilently, // Use this in API calls
    // logout, // Use this for logout
  } = useAuth0();
  const isLoading = ref(false);
  const router = useRouter();
  onMounted(() => {
    if (auth0IsAuthenticated.value) {
      console.log('Auth0: User is already authenticated on login page mount, redirecting.');
      router.push('/chat'); // Adjust redirection target
    }
  });
  const handleLogin = async () => {
    isLoading.value = true; // Local loading state
    try {
      await loginWithRedirect();
    } catch (e: any) {
      console.error('Auth0 Login Initiation Error:', e);
      isLoading.value = false;
    }
  };
  watch(auth0IsAuthenticated, newValue => {
    if (newValue) {
      console.log('Auth0: isAuthenticated became true, redirecting to chat.');
      router.push('/chat'); // Redirect to chat or desired page after successful login
    }
  });

  // Optional: Add a method to clear the auth0Error if the composable doesn't provide one
  const auth0ClearError = () => {
    auth0Error.value = null;
  };

  </script>

  <style scoped>
  .auth-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 85vh;
    padding: 16px;
  }

  .auth-card {
    width: 100%;
    border-radius: 12px;
  }

  .logo-container {
    width: 64px;
    height: 64px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: v-bind("themeStore.isDark ? 'var(--v-theme-surface-variant)' : 'var(--v-theme-primary-lighten-5)'");
    border-radius: 50%;
  }

  /* Firebase UI 定制样式覆盖 */
  :deep(.firebaseui-container) {
    max-width: 100%;
    background: transparent;
  }

  :deep(.firebaseui-card-content) {
    padding: 0;
  }

  :deep(.firebaseui-idp-button) {
    border-radius: 8px;
    padding: 8px 12px;
  }

  :deep(.firebaseui-idp-text) {
    font-size: 16px;
  }
  </style>

/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuth0 } from '@auth0/auth0-vue'
const authRequiredRoutes = ['/chat', '/user'];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0(); // Get state and login method
  const requiresAuth = authRequiredRoutes.some(route => to.path.startsWith(route));
  console.log(
    `Router Guard: Navigating to '${to.path}'. Requires Auth: ${requiresAuth}. Auth0 isAuthenticated: ${isAuthenticated.value}. Auth0 isLoading: ${isLoading.value}`
  );
  if (requiresAuth && isLoading.value) {
    console.log('Auth0: Route requires auth, but SDK is loading. Allowing navigation, component will handle final state.');
    next();
  }
  else if (requiresAuth && !isLoading.value && !isAuthenticated.value) {
    console.log('Auth0: Route requires auth, user not authenticated, not loading. Redirecting to login.');
    // Trigger Auth0 login redirect
    await loginWithRedirect({
      appState: { targetUrl: to.fullPath }, // Store the intended path
    });
    // loginWithRedirect performs a full page redirect, so no need to call next()
  }
  else {
    console.log('Auth0: Authentication state allows navigation. Proceeding.');
    next();
  }
});


// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})


export default router

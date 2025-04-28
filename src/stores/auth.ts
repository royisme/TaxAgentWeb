import { defineStore } from 'pinia';
import { computed } from 'vue';

import type { User } from '@/types/auth';
// import { type User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth0 } from '@auth0/auth0-vue';
// import { use } from 'marked'


export const useAuthStore = defineStore('auth', () => {
  const {
    isAuthenticated: auth0IsAuthenticated,
    user: auth0User,
    isLoading: auth0IsLoading, // Provides loading state
    error: auth0Error, // Provides error state
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();
  // Getters - Based on YOUR internal token
  const isAuthenticated = computed(() => auth0IsAuthenticated.value);
  const user = computed<User | null>(() => {
    const auth0UserData = auth0User.value;
    if (!auth0UserData || !auth0UserData.sub) {
      return null;
    }
    // --- NEW: Extract the part of 'sub' after the pipe symbol ---
    const auth0Sub = auth0UserData.sub as string;
    const pipeIndex = auth0Sub.indexOf('|');
    let internalUserId = auth0Sub; // Default to full sub if no pipe found

    if (pipeIndex !== -1) {
      internalUserId = auth0Sub.substring(pipeIndex + 1);
    }
    const mappedUser: User = {
      id: internalUserId, // Use Auth0 'sub' as your internal user ID
      email: auth0UserData.email || 'unknown@example.com',
      name: auth0UserData.name || auth0UserData.nickname || auth0UserData.email || 'Unknown User', // Fallback name
      picture: auth0UserData.picture,
      // Add other fields from Auth0 user if needed, e.g., updated_at
      // preferences: // Still needs to come from your backend/MongoDB
      createdAt: auth0UserData.updated_at, // Auth0 ID Token might have updated_at
      updatedAt: auth0UserData.updated_at, // Use updated_at from Auth0 as an example timestamp
    };
    return mappedUser;
  });
  const isLoading = computed(() => auth0IsLoading.value); // Expose loading state


  // --- Actions ---
  // Simply wrap the Auth0 SDK methods
  async function login () {
    await loginWithRedirect();
  }

  async function logoutUser () {
  // Example: try { await authService.logout(); } catch (e) { console.error("Backend logout failed:", e); }
  // Then call Auth0 logout which redirects
    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  // Action to get the Access Token silently
  async function getToken (): Promise<string | null> {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (e: any) {
      console.error('Auth Store: Failed to get Access Token silently:', e);
      // Depending on context, you might trigger a login redirect here
      // if (e.error === 'login_required') { await login(); }
      return null;
    }
  }


  return {
    // State & Getters
    user,
    isAuthenticated,
    isLoading, // Expose loading from Auth0 SDK

    // Actions
    login,
    logoutUser,
    getToken, // Method to get the Access Token for API calls
    auth0Error: computed(() => auth0Error.value),
  };
});

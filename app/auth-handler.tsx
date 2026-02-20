'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check if there's an auth token in the URL hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      
      if (access_token && refresh_token) {
        // Store the session
        const storageKey = 'sb-xahwxprmponwfyelcfsj-auth-token';
        
        // Parse the JWT to get user info
        const base64Url = access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        const session = {
          access_token,
          refresh_token,
          expires_at: payload.exp,
          expires_in: parseInt(hashParams.get('expires_in') || '3600'),
          token_type: 'bearer',
          user: {
            id: payload.sub,
            email: payload.email,
            app_metadata: payload.app_metadata || {},
            user_metadata: payload.user_metadata || {},
            aud: payload.aud,
            role: payload.role
          }
        };
        
        localStorage.setItem(storageKey, JSON.stringify(session));
        
        // Clear the hash and redirect
        window.history.replaceState(null, '', window.location.pathname);
        router.push('/dashboard');
      }
    }
  }, [router]);

  return null;
}
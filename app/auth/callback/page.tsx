'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase-auth';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        
        if (access_token && refresh_token) {
          // Store the session in localStorage
          const storageKey = 'sb-xahwxprmponwfyelcfsj-auth-token';
          
          // Get user details from token
          const supabase = createBrowserClient();
          const { data: { user }, error } = await supabase.auth.getUser(access_token);
          
          if (!error && user) {
            const session = {
              access_token,
              refresh_token,
              expires_at: Math.floor(Date.now() / 1000) + parseInt(hashParams.get('expires_in') || '3600'),
              expires_in: parseInt(hashParams.get('expires_in') || '3600'),
              token_type: 'bearer',
              user
            };
            
            localStorage.setItem(storageKey, JSON.stringify(session));
            
            // Set the session with Supabase client
            await supabase.auth.setSession({
              access_token,
              refresh_token
            });
            
            // Redirect to dashboard
            window.location.href = '/dashboard';
          } else {
            console.error('Failed to get user:', error);
            router.push('/login?error=auth_failed');
          }
        } else {
          // No tokens in URL, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Authenticating...</h2>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
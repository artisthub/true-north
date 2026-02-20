'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store session in localStorage for Supabase client
      if (data.session) {
        // The storage key format Supabase uses
        const storageKey = 'sb-xahwxprmponwfyelcfsj-auth-token';
        localStorage.setItem(storageKey, JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in,
          token_type: 'bearer',
          user: data.session.user
        }));
      }

      // Force a reload to ensure cookies and storage are synced
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gradient">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="decorative-star star-1">✦</div>
        <div className="decorative-star star-2">✧</div>
        <div className="decorative-star star-3">✦</div>
        <div className="decorative-star star-4">✧</div>
      </div>

      <div className="content-wrapper">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="logo-wrapper">
                <Link href="/">
                  <img src="/logo.svg" alt="True North Logo" style={{ width: '96px', height: '96px', objectFit: 'contain', display: 'block' }} />
                </Link>
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to manage your music distribution</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  className="form-input"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="error-message">{error}</div>
              )}

              <button 
                type="submit" 
                className="btn-primary"
                style={{ width: '100%', padding: '14px 30px', fontSize: '16px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="login-footer">
              <p>Don&apos;t have an account?</p>
              <Link href="/apply" className="apply-link">
                Apply for Membership
              </Link>
            </div>
          </div>

          <style jsx>{`
            .login-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
            }

            .login-card {
              max-width: 450px;
              width: 100%;
              background: linear-gradient(135deg, rgba(255, 20, 147, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%);
              border: 1px solid rgba(255, 20, 147, 0.2);
              border-radius: 30px;
              padding: 3.5rem;
              box-shadow: 0 30px 80px rgba(255, 20, 147, 0.2);
              position: relative;
              overflow: hidden;
            }

            .login-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, transparent 100%);
              opacity: 0;
              transition: opacity 0.4s ease;
            }

            .login-card:hover::before {
              opacity: 1;
            }

            .login-header {
              text-align: center;
              margin-bottom: 3rem;
              position: relative;
              z-index: 1;
            }

            .logo-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 1.5rem;
            }
            
            .logo-wrapper a {
              display: block;
              line-height: 0;
            }

            .login-header h1 {
              font-size: 2.5rem;
              margin-bottom: 0.5rem;
              background: linear-gradient(135deg, #ffffff 0%, #FF69B4 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: 700;
              letter-spacing: -1px;
            }

            .login-header p {
              color: #999;
              font-size: 1.1rem;
              margin: 0;
            }

            .login-form {
              margin-bottom: 2rem;
              position: relative;
              z-index: 1;
            }

            .error-message {
              background: rgba(255, 20, 147, 0.1);
              border: 1px solid #FF1493;
              color: #FF69B4;
              padding: 0.75rem 1rem;
              border-radius: 12px;
              margin-bottom: 1.5rem;
              font-size: 0.95rem;
            }

            .login-footer {
              text-align: center;
              padding-top: 2rem;
              border-top: 1px solid rgba(255, 20, 147, 0.1);
              position: relative;
              z-index: 1;
            }

            .login-footer p {
              color: #999;
              margin-bottom: 0.5rem;
            }

            .apply-link {
              color: #FF1493;
              text-decoration: none;
              font-weight: 600;
              transition: all 0.3s ease;
            }

            .apply-link:hover {
              color: #FF69B4;
              text-decoration: underline;
            }
            
            a {
              color: #FF1493;
              text-decoration: none;
              transition: all 0.3s ease;
            }
            
            a:hover {
              color: #FF69B4;
            }

            @media (max-width: 768px) {
              .login-card {
                padding: 2.5rem;
              }

              .login-header h1 {
                font-size: 2rem;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
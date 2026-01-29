'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="bg-gradient"></div>
      <div className="content-wrapper">
        <header>
          <div className="container">
            <div className="header-content">
              <Link href="/" className="logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                True North
              </Link>
            </div>
          </div>
        </header>

        <main className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            <div className="login-container">
              <div className="login-card">
                <div className="login-header">
                  <h1>Admin Login</h1>
                  <p>Enter your password to access the admin dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      placeholder="Enter admin password"
                      required
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn-primary login-btn"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <div className="login-footer">
                  <Link href="/" className="back-link">
                    ← Back to homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .login-wrapper .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .login-wrapper .content-wrapper {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        .login-container {
          max-width: 450px;
          margin: 0 auto;
        }

        .login-card {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 20, 147, 0.3);
          border-radius: 24px;
          padding: 60px 50px;
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
          pointer-events: none;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .login-header h1 {
          font-size: 32px;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .login-header p {
          color: #ccc;
          font-size: 16px;
        }

        .login-form {
          position: relative;
          z-index: 1;
        }

        .login-btn {
          width: 100%;
          margin-top: 20px;
          padding: 16px;
          font-size: 16px;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #dc3545;
          padding: 12px 16px;
          border-radius: 12px;
          margin: 20px 0;
          font-size: 14px;
        }

        .login-footer {
          text-align: center;
          margin-top: 30px;
          position: relative;
          z-index: 1;
        }

        .back-link {
          color: #999;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: #FF69B4;
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 40px 30px;
            margin: 20px;
          }

          .login-header h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
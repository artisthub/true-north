'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserInfo {
  id: string;
  email: string;
  accountType: 'artist' | 'label';
  artistName?: string;
  labelName?: string;
}

interface Pitch {
  id: string;
  created_at: string;
  release_title: string;
  track_name: string;
  main_pitch: string;
  status?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
    fetchPitches();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      router.push('/login');
    }
  };

  const fetchPitches = async () => {
    try {
      const response = await fetch('/api/user/pitches');
      if (response.ok) {
        const data = await response.json();
        setPitches(data.pitches || []);
      }
    } catch (error) {
      console.error('Failed to fetch pitches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

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
        <header>
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <div className="logo-icon">
                  <img src="/logo.svg" alt="True North Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
              </div>
              <nav>
                <Link href="/">Home</Link>
                <Link href="#releases">Releases</Link>
                <Link href="#analytics">Analytics</Link>
                <Link href="#payments">Payments</Link>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <div className="container">
            {/* User Info Section */}
            <section className="dashboard-hero">
              <div className="hero-content">
                <div className="dashboard-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {user?.accountType === 'artist' ? 'ARTIST' : 'LABEL'} ACCOUNT
                </div>
                <h1 className="dashboard-title">Welcome back, <span className="text-gradient-direction">{user?.accountType === 'artist' ? user.artistName : user?.labelName}</span></h1>
                <p className="dashboard-desc">{user?.email}</p>
              </div>
            </section>

            {/* Actions Section */}
            <section className="section">
              <div className="dashboard-actions">
                <Link href="/pitch" className="feature-card">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient-pitch)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient-pitch" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                          <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                        </linearGradient>
                      </defs>
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3>Submit New Pitch</h3>
                  <p>Create a pitch for DSP playlist consideration</p>
                </Link>
                
                <Link href="#analytics" className="feature-card">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient-analytics)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient-analytics" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                          <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                        </linearGradient>
                      </defs>
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <h3>View Analytics</h3>
                  <p>Track performance across all platforms</p>
                </Link>

                <Link href="#payments" className="feature-card">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient-payments)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient-payments" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                          <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                        </linearGradient>
                      </defs>
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <h3>Payments & Splits</h3>
                  <p>Manage royalties and collaborator splits</p>
                </Link>
              </div>
            </section>

            {/* Pitches Section */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Recent Pitches</h2>
              </div>
              {pitches.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient-empty)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient-empty" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '0.3' }} />
                          <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '0.3' }} />
                        </linearGradient>
                      </defs>
                      <path d="M9 11H3v10h18V11h-6M9 11V3h6v8M9 11h6"/>
                    </svg>
                  </div>
                  <h3>No pitches yet</h3>
                  <p>Start by submitting your first pitch for playlist consideration</p>
                  <Link href="/pitch" className="btn-primary" style={{ marginTop: '20px' }}>
                    Submit Your First Pitch
                  </Link>
                </div>
              ) : (
                <div className="pitches-grid">
                  {pitches.map((pitch) => (
                    <div key={pitch.id} className="pitch-card">
                      <div className="pitch-header">
                        <h3>{pitch.release_title}</h3>
                        <span className="pitch-date">{formatDate(pitch.created_at)}</span>
                      </div>
                      <p className="track-name">{pitch.track_name}</p>
                      <p className="pitch-excerpt">{pitch.main_pitch.substring(0, 150)}...</p>
                      <div className="pitch-footer">
                        <span className={`status-badge ${pitch.status || 'submitted'}`}>
                          {pitch.status || 'Submitted'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <style jsx>{`
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: white;
            font-size: 1.5rem;
          }

          .dashboard-hero {
            text-align: center;
            padding: 140px 0 80px;
            position: relative;
          }

          .dashboard-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(255, 20, 147, 0.15) 0%, transparent 70%);
            filter: blur(80px);
            pointer-events: none;
          }

          .hero-content {
            position: relative;
            z-index: 1;
          }

          .dashboard-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 20, 147, 0.1);
            border: 1px solid rgba(255, 20, 147, 0.3);
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            color: #FF1493;
            margin-bottom: 30px;
            letter-spacing: 0.5px;
          }

          .dashboard-title {
            font-size: 56px;
            margin-bottom: 20px;
            line-height: 1.1;
            font-weight: 700;
            letter-spacing: -2px;
          }

          .dashboard-desc {
            font-size: 20px;
            color: #999;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.6;
          }

          .dashboard-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 30px;
            margin-bottom: 60px;
          }

          .dashboard-actions .feature-card {
            cursor: pointer;
            text-decoration: none;
            color: inherit;
          }

          .empty-state {
            text-align: center;
            padding: 80px 40px;
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%);
            border: 1px solid rgba(255, 20, 147, 0.15);
            border-radius: 30px;
          }

          .empty-icon {
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-icon svg {
            width: 80px;
            height: 80px;
          }

          .empty-state h3 {
            font-size: 32px;
            margin-bottom: 15px;
            color: #fff;
          }

          .empty-state p {
            color: #999;
            font-size: 18px;
            margin-bottom: 1.5rem;
          }

          .pitches-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
          }

          .pitch-card {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%);
            border: 1px solid rgba(255, 20, 147, 0.2);
            border-radius: 24px;
            padding: 30px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
          }

          .pitch-card::before {
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

          .pitch-card:hover {
            transform: translateY(-5px);
            border-color: #FF1493;
            box-shadow: 0 20px 60px rgba(255, 20, 147, 0.2);
          }

          .pitch-card:hover::before {
            opacity: 1;
          }

          .pitch-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
          }

          .pitch-header h3 {
            color: #fff;
            font-size: 1.3rem;
            margin: 0;
            font-weight: 600;
          }

          .pitch-date {
            color: #999;
            font-size: 0.9rem;
          }

          .track-name {
            color: #FF69B4;
            font-weight: 500;
            margin-bottom: 1rem;
            font-size: 1rem;
            position: relative;
            z-index: 1;
          }

          .pitch-excerpt {
            color: #bbb;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
          }

          .pitch-footer {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            z-index: 1;
          }

          .status-badge {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .status-badge.submitted {
            background: rgba(255, 20, 147, 0.1);
            border: 1px solid rgba(255, 20, 147, 0.3);
            color: #FF69B4;
          }

          @media (max-width: 768px) {
            .dashboard-title {
              font-size: 36px;
            }

            .dashboard-actions {
              grid-template-columns: 1fr;
            }

            .pitches-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </>
  );
}
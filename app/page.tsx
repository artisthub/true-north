'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    } as const;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

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
                <a href="#distribution">Distribution</a>
                <a href="/about">About</a>
                <a href="#pricing">Pricing</a>
                <a href="#features">Features</a>
                <a className="btn-primary" href="/get-started">Get Started</a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section className="hero">
            <div className="container">
              <div className="hero-content">
                <h1 className="hero-title fade-in">
                  Release with <br />
                  <span className="text-gradient-direction">Direction</span>
                </h1>
                <p className="hero-desc fade-in fade-in-delay-1">
                  Global distribution, clean splits, fast data—no busywork.
                  <span className="hero-desc-sub">For artists and labels who want less admin and more release days.</span>
                </p>
                
                <div className="hero-actions fade-in fade-in-delay-2">
                  <a href="/get-started" className="btn-primary" style={{ fontSize: '18px', padding: '16px 40px' }}>
                    Start Distributing
                  </a>
                  <a href="#features" className="btn-secondary" style={{ fontSize: '18px', padding: '16px 40px' }}>
                    View Features
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="distribution">
            <div className="container">
              <div className="section-header fade-in">
                <h2 className="section-title">Drop once. Live everywhere.</h2>
                <p className="section-desc">Ship to Spotify, Apple Music, YouTube Music, Amazon Music, TikTok, Instagram, Pandora, Deezer, TIDAL and 100+ DSPs from a single dashboard. Pre‑saves, smart links, and white‑label pages are ready out of the box.</p>
              </div>

              <div className="dsp-logos fade-in">
                <div className="dsp-logo spotify">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">Spotify</div>
                </div>

                <div className="dsp-logo apple">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">Apple Music</div>
                </div>

                <div className="dsp-logo youtube">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">YouTube</div>
                </div>

                <div className="dsp-logo amazon">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.61-4.516.61-2.265 0-4.463-.4-6.59-1.195-2.11-.794-3.935-1.89-5.43-3.286-.088-.08-.104-.15-.045-.248zm23.71-1.935c-.165-.17-.345-.258-.53-.258-.184 0-.368.088-.534.258-.166.17-.248.35-.248.533 0 .184.082.364.248.533.166.17.35.257.533.257.185 0 .365-.087.53-.257.166-.17.25-.35.25-.533 0-.184-.084-.364-.25-.533zm-.705 3.022c-.062-.065-.137-.097-.226-.097-.09 0-.164.032-.226.097-.062.064-.094.139-.094.226 0 .088.032.163.094.226.062.064.137.097.226.097.09 0 .164-.033.226-.097.062-.063.094-.138.094-.226 0-.087-.032-.162-.094-.226z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">Amazon</div>
                </div>

                <div className="dsp-logo tiktok">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">TikTok</div>
                </div>

                <div className="dsp-logo instagram">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">Instagram</div>
                </div>

                <div className="dsp-logo soundcloud">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.334c0-.061-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.119.12.061 0 .12-.061.12-.12l.254-2.474-.254-2.548c-.007-.06-.061-.12-.135-.12m.973-.278c-.07 0-.135.06-.15.135l-.193 2.341.21 2.443c0 .06.06.134.134.134.075 0 .134-.06.134-.134l.24-2.458-.24-2.326c-.007-.075-.074-.135-.135-.135m.828-1.019c-.075 0-.15.074-.15.149l-.18 3.389.18 3.463c.015.074.09.149.165.149.09 0 .149-.074.164-.149l.21-3.463-.21-3.389c-.008-.075-.075-.149-.165-.149m.976.187c-.09 0-.18.09-.18.18l-.15 3.201.165 3.563c0 .074.074.164.164.164.074 0 .164-.074.18-.18l.194-3.548-.194-3.201c-.016-.074-.091-.18-.18-.18m1.038 6.273c-.09 0-.18-.09-.195-.194l-.179-3.389.18-3.015c0-.09.074-.18.179-.18.09 0 .18.074.18.18l.209 3 .015.015-.209 3.389c-.015.09-.09.194-.18.194m.984-7.777c-.104 0-.194.089-.194.194l-.18 4.608.18 3.449c.016.104.09.194.194.194.09 0 .195-.09.195-.194l.209-3.449-.209-4.608c-.016-.104-.09-.194-.195-.194m1.065.119c-.105 0-.21.09-.21.21l-.164 4.488.164 3.45c.016.119.105.21.21.21.119 0 .224-.091.224-.21l.195-3.45-.195-4.488c-.015-.12-.105-.21-.224-.21m1.004 7.776c-.105 0-.195-.074-.21-.18l-.209-3.389.209-4.443c.015-.104.105-.194.21-.194.104 0 .194.089.209.194l.225 4.443-.225 3.389c-.015.104-.104.18-.209.18m1.245-.119c-.119 0-.209-.089-.209-.21l-.195-3.269.195-4.967c.016-.12.09-.21.209-.21.105 0 .21.09.21.21l.224 4.967-.224 3.269c-.016.119-.105.21-.21.21m1.004-8.192c-.119 0-.224.09-.224.225l-.195 5.026.195 3.15c.016.134.105.224.224.224.12 0 .225-.09.225-.224l.209-3.15-.209-5.026c-.016-.134-.105-.225-.225-.225M24 14.479c0-2.09-1.703-3.793-3.792-3.793-.45 0-.899.075-1.319.195-.135-5.115-4.373-9.194-9.563-9.194-1.35 0-2.595.285-3.748.794-.24.104-.285.285-.255.525v19.897c.016.24.195.419.435.45h14.325c2.09 0 3.793-1.703 3.793-3.792z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">SoundCloud</div>
                </div>

                <div className="dsp-logo pandora">
                  <div className="dsp-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-1.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5zm-1.125-6.75h2.25V8.625h3.375V6.75h-5.625v9z"/>
                    </svg>
                  </div>
                  <div className="dsp-name">Pandora</div>
                </div>

                <div className="dsp-more">
                  <span>+100 more</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-alt" id="features">
            <div className="container-wide">
              {/* Full-width Feature 1 */}
              <div className="feature-full fade-in">
                <div className="feature-content">
                  <h3>Splits that don&apos;t need spreadsheets</h3>
                  <p>Set splits in seconds, add recoupables, track costs, and pay collaborators automatically. Statements are clean. Payouts are fast. Rights stay yours.</p>
                </div>
                <div className="feature-visual">
                  <div className="feature-icon-large">
                    <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                        <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v12M9 8h6M9 16h6"/>
                    <path d="M16 12H8"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Full-width Feature 2 (Reversed) */}
            <div className="feature-full reverse fade-in">
              <div className="feature-content">
                <h3>Data you&apos;ll actually use</h3>
                <p>Real‑time trends by platform, territory, and track. See what&apos;s working, skip what isn&apos;t. Export anything.</p>
              </div>
              <div className="feature-visual">
                <div className="feature-icon-large">
                  <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                      <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                    </linearGradient>
                  </defs>
                  <polyline points="3 17 9 11 13 15 21 7"/>
                  <polyline points="14 7 21 7 21 14"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Grid Features */}
          <div className="feature-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                    <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                  </linearGradient>
                </defs>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
              </svg>
            </div>
            <h3>Lyrics land day one</h3>
            <p>Deliver lyrics through musicmatch + LyricFind, so fans can sing along the moment you go live.</p>
          </div>

          <div className="feature-card fade-in fade-in-delay-1">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                  <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                </linearGradient>
              </defs>
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <h3>Video & UGC, covered</h3>
          <p>Turn on YouTube Content ID + UGC monetization to catch uses and claim revenue—without babysitting your catalog.</p>
        </div>
      </div>

      {/* Enterprise Feature - Full Width */}
      <div className="feature-enterprise fade-in">
        <div className="enterprise-content">
          <div className="enterprise-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            ENTERPRISE GRADE
          </div>
          <h3>Built to scale, quietly</h3>
          <p>Powered by Revelator under the hood: DDEX‑compliant deliveries, UPC/ISRC generation, automated updates, and the reliability you&apos;d expect from enterprise—minus the enterprise headache.</p>

          <div className="enterprise-features">
            <div className="enterprise-feature-item">
              <div className="enterprise-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient10)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="gradient10" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                    <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                  </linearGradient>
                </defs>
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h4>DDEX Compliant</h4>
            <p>Industry-standard data exchange</p>
          </div>

          <div className="enterprise-feature-item">
            <div className="enterprise-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient11)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="gradient11" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                  <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                </linearGradient>
              </defs>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h4>UPC/ISRC Auto-Gen</h4>
          <p>Automatic code generation</p>
        </div>

        <div className="enterprise-feature-item">
          <div className="enterprise-feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient12)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient12" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
              </linearGradient>
            </defs>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h4>99.9% Uptime</h4>
        <p>Enterprise reliability</p>
      </div>

      <div className="enterprise-feature-item">
        <div className="enterprise-feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient13)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="gradient13" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
              <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
            </linearGradient>
          </defs>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      </div>
      <h4>Automated Updates</h4>
      <p>Set it and forget it</p>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section className="quote-section">
        <div className="container">
          <p className="quote fade-in">&quot;Move in the right direction.&quot;</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-section fade-in">
            <div className="stats-header">
              <h2 className="stats-title">Why True North?</h2>
              <p className="stats-subtitle">Everything you need to succeed, built into one platform</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                      <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">100+</div>
                <div className="stat-label">DSPs Worldwide</div>
                <p className="stat-desc">Worldwide delivery to every major platform, niche territories included.</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                    <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                  </linearGradient>
                </defs>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">One</div>
              <div className="stat-label">Unified Dashboard</div>
              <p className="stat-desc">Catalog, splits, statements, and links all in one place.</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="gradient8" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                  <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                </linearGradient>
              </defs>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">Zero</div>
            <div className="stat-label">Hidden Fees</div>
            <p className="stat-desc">Clear terms and transparent pricing. Keep control of your music.</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient9" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
              </linearGradient>
            </defs>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div className="stat-content">
          <div className="stat-number">DDEX</div>
          <div className="stat-label">Compliant</div>
          <p className="stat-desc">Industry‑standard pipelines and enterprise reliability.</p>
        </div>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">Pricing</h2>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card featured fade-in">
              <div className="plan-name">Active</div>
              <div className="plan-price">$59<span className="plan-price-small">/yr</span></div>
              <p className="plan-desc">Includes global distribution, automated splits & payouts, analytics, smart links, and lyrics delivery (musicmatch + LyricFind).</p>
              <a href="#start" className="btn-primary" style={{ width: '100%', padding: '15px' }}>Choose Active</a>
            </div>

            <div className="pricing-card fade-in fade-in-delay-1">
              <div className="plan-name">Partner</div>
              <div className="plan-price">15%<span className="plan-price-small"> revenue</span></div>
              <p className="plan-desc">Full distribution suite with automated royalties, analytics, and white‑label links—ideal for active catalogs and labels.</p>
              <a href="#start" className="btn-primary" style={{ width: '100%', padding: '15px' }}>Choose Partner</a>
            </div>
          </div>

          <div className="addons fade-in">
            <h3>Add‑Ons</h3>
            <ul>
              <li>
                <span>Sync Licensing</span>
                <span>40% commission</span>
              </li>
              <li>
                <span>YouTube Content ID + UGC</span>
                <span>30%</span>
              </li>
              <li>
                <span>Video Distribution</span>
                <span>$100 per video</span>
              </li>
              <li>
                <span>Blog Placement</span>
                <span>On request</span>
              </li>
              <li>
                <span>SoundExchange Collection</span>
                <span>On request</span>
              </li>
              <li>
                <span>White‑label links for merch & records</span>
                <span>Included</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section" id="start">
        <div className="container">
          <h2 className="cta-title fade-in">Ready when you are.</h2>
          <p className="cta-desc fade-in fade-in-delay-1">Upload the single, set your splits, and point your compass north.</p>
          <a href="/get-started" className="btn-primary fade-in fade-in-delay-2" style={{ fontSize: '18px', padding: '18px 50px' }}>Get Started Now</a>
        </div>
      </section>

          <section className="section legal-section" id="legal">
            <div className="container">
              <div className="section-header fade-in">
                <h2 className="section-title">Legal Center</h2>
                <p className="section-desc">
                  Explore the policies that govern distribution on True North, from terms of service to privacy, cookies, and DMCA guidelines.
                </p>
              </div>

              <div className="legal-grid">
                <div className="legal-card fade-in">
                  <h3>Terms &amp; Conditions</h3>
                  <p>
                    Understand the agreement that governs distribution, royalty payouts, and your responsibilities when releasing with True North.
                  </p>
                  <a className="btn-secondary" href="/legal/terms">
                    Review Terms
                  </a>
                </div>

                <div className="legal-card fade-in fade-in-delay-1">
                  <h3>Privacy Policy</h3>
                  <p>
                    Learn how we collect, use, and protect account data, catalog information, and analytics across dashboards and artist tools.
                  </p>
                  <a className="btn-secondary" href="/legal/privacy">
                    Read Privacy Policy
                  </a>
                </div>

                <div className="legal-card fade-in fade-in-delay-2">
                  <h3>Cookie Policy</h3>
                  <p>
                    See how cookies keep your sessions secure, power analytics, and how to control your preferences across True North experiences.
                  </p>
                  <a className="btn-secondary" href="/legal/cookie-policy">
                    Read Cookie Policy
                  </a>
                </div>

                <div className="legal-card fade-in fade-in-delay-3">
                  <h3>DMCA Policy</h3>
                  <p>
                    Find the steps for reporting infringing material or filing counter-notices so we can keep releases online for legitimate creators.
                  </p>
                  <a className="btn-secondary" href="/legal/dmca">
                    Read DMCA Policy
                  </a>
                </div>
              </div>
            </div>
          </section>

      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#">Distribution</a>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">FAQs</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="/about">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#">Help Center</a>
              <a href="#">Community</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="/legal/terms">Terms &amp; Conditions</a>
              <a href="/legal/privacy">Privacy Policy</a>
              <a href="/legal/cookie-policy">Cookie Policy</a>
              <a href="/legal/dmca">DMCA</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 True North Music Distribution. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

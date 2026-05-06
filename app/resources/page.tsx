'use client';

import Link from 'next/link';

interface Resource {
  name: string;
  tagline: string;
  description: string;
  color: string;
  logo: string | null;
  heroImage: string | null;
  link: string;
  cta: string;
  isExternal: boolean;
}

const RESOURCES: Resource[] = [
  {
    name: 'Blue Avenue Music Group',
    tagline: 'Start Your Journey',
    description:
      'The place to BE... BE Creative. BE Artistic. BE Valued. Your artist management partner, providing unique, cost-effective resources to help you build a solid business foundation for your career.',
    color: '#385B83',
    logo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/BamGTransparentWhite(1)_53d8934d.png',
    heroImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/hero-blue-avenue_a046bf7e.png',
    link: 'https://www.blueavemusic.com',
    cta: 'Start Your Journey',
    isExternal: true,
  },
  {
    name: 'Artisthub',
    tagline: 'Music Marketing Magic',
    description:
      'Grow your streams and sales with smart music links and fan outreach tools. Build hype with pre-saves, reach your fans directly, and track your growth with powerful analytics.',
    color: '#9C27B0',
    logo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/AHLogoWordmarkonBlack(3)_b80caf84.png',
    heroImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/hero-artisthub_fe62dfd9.png',
    link: 'https://artisthub.io',
    cta: 'Grow Your Audience',
    isExternal: true,
  },
  {
    name: 'True North Distribution',
    tagline: 'Release in the Right Direction',
    description:
      'Global distribution to 100+ DSPs with clean splits and fast data. Drop once, live everywhere. Ship to Spotify, Apple Music, YouTube Music, Amazon Music, TikTok, and more from a single dashboard.',
    color: '#FF00A3',
    logo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/TrueNorthFaviconPink_Black_4218a425.png',
    heroImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/hero-true-north_6cf119d1.png',
    link: 'https://truenorthdistro.com',
    cta: 'Distribute Your Music',
    isExternal: true,
  },
  {
    name: 'NVOKO',
    tagline: 'Bridging Collaboration & Legalities',
    description:
      'Protect and manage your music rights with modern contracts and rights management. Create and manage music contracts, and track your ownership across all of your collaborations.',
    color: '#FF035A',
    logo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/nvoko_logo_fb_1ee693b5.png',
    heroImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/hero-nvoko_baa10d49.png',
    link: 'https://nvoko.com',
    cta: 'Protect Your Rights',
    isExternal: true,
  },
  {
    name: 'Sapphire Sync',
    tagline: 'Sync Licensing Opportunities',
    description:
      'Unlock new revenue streams through sync licensing. Get your music placed in films, TV shows, commercials, and more with our specialized sync licensing network.',
    color: '#4A90E2',
    logo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/BlueSapphireSync_BlueAve_aa648770.gif',
    heroImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/hero-sapphire-sync-Su6z3dpcYxpT8qNifDpTm2.png',
    link: '/sapphire-sync',
    cta: 'Get Synced',
    isExternal: false,
  },
  {
    name: 'Indi-Go Publishing',
    tagline: 'Music Registration & Publishing',
    description:
      'Register your music and manage your publishing rights. Ensure you receive all royalties and maintain control of your intellectual property across all platforms.',
    color: '#2C5AA0',
    logo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/BlueIndi-GoPublishing_BlueAve_00a6603e.png',
    heroImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/hero-indi-go-publishing-KXXZedvs3XaQbJLye6a7gf.webp',
    link: '/indi-go-waitlist',
    cta: 'Join the Waiting List',
    isExternal: false,
  },
  {
    name: 'OnBEAT Community',
    tagline: 'Keeping Your Career OnBEAT',
    description:
      'Learn the music industry business foundations, join Artist Branding workshops, participate in weekly Q&As with industry experts, and meet other professionals building their careers.',
    color: '#9C27B0',
    logo: null,
    heroImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431631342/Xb4huRgtYfGUxqpYLgzpFU/hero-onbeat-convergence-AZAFWfmL7BNyJAo9N2JfF3.webp',
    link: 'https://community.blueavemusic.com/join?invitation_token=6227d1a338176e60d1b1ab89640596b74487a156-f0a80ccc-edd9-46e6-82bc-071c3b624ca9',
    cta: 'Join the Community',
    isExternal: true,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <div className="bg-gradient">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="decorative-star star-1">&#10022;</div>
        <div className="decorative-star star-2">&#10023;</div>
        <div className="decorative-star star-3">&#10022;</div>
        <div className="decorative-star star-4">&#10023;</div>
      </div>

      <div className="content-wrapper">
        <header>
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <Link href="/">
                  <div className="logo-icon">
                    <img
                      src="/True_North_Pink_Black.png"
                      alt="True North Logo"
                      style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                    />
                  </div>
                </Link>
              </div>
              <nav>
                <a href="/">Home</a>
                <a href="/#distribution">Distribution</a>
                <a href="/about">About</a>
                <a href="/resources">Resources</a>
                <a className="btn-primary" href="/apply">
                  Get Started
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section className="resources-hero">
            <div className="container">
              <div className="fade-in">
                <div className="about-badge" style={{ marginBottom: '20px' }}>
                  Ecosystem
                </div>
                <h1
                  style={{
                    fontSize: 'clamp(36px, 5vw, 64px)',
                    fontWeight: 800,
                    letterSpacing: '-2px',
                    lineHeight: 1.1,
                    marginBottom: '20px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #FF69B4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  The Artist Journey
                </h1>
                <p
                  style={{
                    fontSize: '20px',
                    color: '#ccc',
                    maxWidth: '760px',
                    margin: '0 auto',
                    lineHeight: 1.8,
                  }}
                >
                  Your complete ecosystem for music creation, distribution, rights management, and
                  community. Every tool you need, working together.
                </p>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container-wide">
              <div className="resources-grid">
                {RESOURCES.map((resource) => (
                  <div className="resource-card" key={resource.name}>
                    <div
                      className="resource-card-image"
                      style={{
                        backgroundImage: `url(${resource.heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div
                        className="resource-card-overlay"
                        style={{
                          background: `linear-gradient(135deg, ${resource.color}00 0%, ${resource.color}40 100%)`,
                        }}
                      />
                    </div>

                    <div className="resource-card-content">
                      {resource.logo && (
                        <div className="resource-card-logo">
                          <img
                            src={resource.logo}
                            alt={resource.name}
                            style={{
                              maxWidth: '180px',
                              maxHeight: '56px',
                              objectFit: 'contain',
                              filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                            }}
                          />
                        </div>
                      )}

                      {!resource.logo && (
                        <h3
                          className="resource-card-name"
                          style={{ color: resource.color }}
                        >
                          {resource.name}
                        </h3>
                      )}

                      <p
                        className="resource-card-tagline"
                        style={{ color: resource.color }}
                      >
                        {resource.tagline}
                      </p>

                      <p className="resource-card-desc">{resource.description}</p>

                      <a
                        href={resource.link}
                        target={resource.isExternal ? '_blank' : undefined}
                        rel={resource.isExternal ? 'noopener noreferrer' : undefined}
                        className="resource-card-cta"
                        style={{
                          background: resource.color,
                          color: '#0b0b0b',
                        }}
                      >
                        {resource.cta}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="/#distribution">Distribution</a>
                <a href="/#features">Features</a>
                <a href="/#pricing">Pricing</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="/about">About</a>
                <a href="/apply">Get Started</a>
              </div>
              <div className="footer-section">
                <h4>Resources</h4>
                <a href="/resources">Ecosystem</a>
                <a href="/support">Support Forms</a>
              </div>
              <div className="footer-section">
                <h4>Legal</h4>
                <a href="/legal/terms">Terms &amp; Conditions</a>
                <a href="/legal/distribution">Distribution Agreement</a>
                <a href="/legal/privacy">Privacy Policy</a>
                <a href="/legal/cookie-policy">Cookie Policy</a>
                <a href="/legal/dmca">DMCA</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 True North Music Distribution. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
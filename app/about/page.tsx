import Link from 'next/link';

export default function AboutPage() {
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

      <div className="content-wrapper about-wrapper">
        <header>
          <div className="container">
            <div className="header-content">
              <Link href="/" className="logo">
                <div className="logo-icon">↑</div>
                True North
              </Link>
              <nav>
                <a href="/">Home</a>
                <a href="/#distribution">Distribution</a>
                <a href="/#features">Features</a>
                <a href="/#pricing">Pricing</a>
                <Link className="btn-primary" href="/get-started">
                  Get Started
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section className="about-hero">
            <div className="container">
              <div className="about-hero-content fade-in">
                <span className="about-badge">Born from ArtistHub</span>
                <h1>About True North</h1>
                <p>
                  True North is the distribution engine built by the same team that scaled ArtistHub&apos;s smart
                  links to millions of fans. We believe release day should feel electric—not administrative—so we
                  turned our campaign DNA into a platform that helps artists move faster, stay compliant, and keep
                  control.
                </p>
              </div>
              <div className="about-hero-stats">
                <div className="about-stat fade-in">
                  <span className="about-stat-label">ArtistHub Legacy</span>
                  <span className="about-stat-value">15K+</span>
                  <span className="about-stat-meta">campaigns shipped with conversion-grade UX</span>
                </div>
                <div className="about-stat fade-in fade-in-delay-1">
                  <span className="about-stat-label">Catalog Ready</span>
                  <span className="about-stat-value">120+</span>
                  <span className="about-stat-meta">DSP &amp; rights partners out of the gate</span>
                </div>
                <div className="about-stat fade-in fade-in-delay-2">
                  <span className="about-stat-label">Split Automation</span>
                  <span className="about-stat-value">60%</span>
                  <span className="about-stat-meta">average reduction in royalty admin for beta labels</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section about-story">
            <div className="container-wide">
              <div className="about-grid">
                <div className="about-story-card fade-in">
                  <h2>The ArtistHub lineage</h2>
                  <p>
                    Our team spent the last five years building ArtistHub&apos;s marketing stack—smart links, landing
                    pages, and fan funnels trusted by majors, indies, and DIY creators. Along the way, we learned that
                    getting music live everywhere is still the hardest part of the journey.
                  </p>
                  <p>
                    True North carries that product DNA forward. The same engineers, designers, and rights specialists
                    who obsessed over conversion rates now obsess over split accuracy, metadata fidelity, and artist
                    experience.
                  </p>
                </div>
                <div className="about-story-card fade-in fade-in-delay-1">
                  <h2>Distribution without the drag</h2>
                  <p>
                    We pair enterprise-grade infrastructure—DDEX pipelines, compliance automation, real-time analytics—with
                    the user experience polish of ArtistHub. Every release, dashboard, and payout is designed so your team
                    spends more time planning the next drop and less time chasing paperwork.
                  </p>
                  <ul>
                    <li>Automated splits, recoupment, and payout scheduling.</li>
                    <li>Marketing touchpoints powered by ArtistHub smart links.</li>
                    <li>Hands-on human support when releases need white-glove attention.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="section about-values">
            <div className="container">
              <div className="section-header fade-in">
                <h2 className="section-title">What guides us</h2>
                <p className="section-desc">
                  The north star is simple: do right by artists and their teams. We make choices that keep catalogs safe
                  and careers compounding.
                </p>
              </div>
              <div className="about-values-grid">
                <div className="about-value-card fade-in">
                  <h3>Artist-first economics</h3>
                  <p>We only win when artists do. Transparent pricing, flexible deals, and clear statements—always.</p>
                </div>
                <div className="about-value-card fade-in fade-in-delay-1">
                  <h3>Data with context</h3>
                  <p>Streams and sales are just numbers without narrative. We surface insights that make next steps obvious.</p>
                </div>
                <div className="about-value-card fade-in fade-in-delay-2">
                  <h3>Human + automated</h3>
                  <p>Automation handles the repetitive parts; our team steps in when decisions need real experience.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section about-team">
            <div className="container-wide">
              <div className="about-team-card fade-in">
                <div className="about-team-copy">
                  <span className="about-team-badge">Leadership</span>
                  <h2>Ship velocity, not volume</h2>
                  <p>
                    We helped ArtistHub artists convert curious fans into lifelong supporters. With True North, we&apos;re
                    making sure their music journeys stay smooth from master delivery to sync licensing. Whether you&apos;re
                    a bedroom producer or a catalog-rich label, our mission is the same: set you up to release with
                    confidence.
                  </p>
                  <p className="about-team-signoff">— The True North &amp; ArtistHub crew</p>
                </div>
                <div className="about-team-meta">
                  <div>
                    <span className="about-meta-label">HQ</span>
                    <span className="about-meta-value">Remote-first</span>
                  </div>
                  <div>
                    <span className="about-meta-label">Focus</span>
                    <span className="about-meta-value">Artists, labels, distributors</span>
                  </div>
                  <div>
                    <span className="about-meta-label">Backed by</span>
                    <span className="about-meta-value">ArtistHub product team</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section about-cta">
            <div className="container">
              <div className="about-cta-card fade-in">
                <h2>Ready to move your catalog?</h2>
                <p>Bring the momentum from ArtistHub straight into distribution. We&apos;ll help you migrate, launch, and grow.</p>
                <div className="about-cta-actions">
                  <Link className="btn-primary" href="/get-started">
                    Start a release
                  </Link>
                  <a className="btn-secondary" href="mailto:hello@truenorthmusic.com">
                    Talk to our team
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="about-footer">
          <div className="container">
            <p>© 2025 True North. Built by the team behind ArtistHub.</p>
            <nav>
              <a href="/">Home</a>
              <a href="/legal/terms">Terms &amp; Conditions</a>
              <a href="/#pricing">Pricing</a>
              <a href="/#dmca-policy">DMCA</a>
              <a href="/#cookie-policy">Cookie Policy</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

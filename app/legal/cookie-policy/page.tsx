import Link from 'next/link';

const LAST_UPDATED = 'November 6, 2025';

export default function CookiePolicyPage() {
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

      <div className="terms-wrapper">
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
                <a href="/about">About</a>
                <a href="/#pricing">Pricing</a>
                <a className="btn-primary" href="/get-started">
                  Get Started
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section className="terms-hero">
            <div className="container">
              <div className="terms-hero-content fade-in">
                <h1>Cookie Policy</h1>
                <p className="terms-effective">Last updated: {LAST_UPDATED}</p>
                <p>
                  This Cookie Policy explains how True North uses cookies and similar technologies across our marketing
                  pages, dashboards, and artist tools. It also describes the choices you have in managing your preferences.
                </p>
              </div>
            </div>
          </section>

          <section className="section terms-content">
            <div className="container">
              <div className="terms-section fade-in">
                <h2>1. What are cookies?</h2>
                <p>
                  Cookies are small text files that a website stores on your device. They help us remember your preferences,
                  keep sessions secure, and understand how you interact with the platform. We also use similar technologies
                  like local storage and tracking pixels.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>2. How we use cookies</h2>
                <ul className="terms-list">
                  <li>
                    <strong>Essential cookies.</strong> Required for sign-in, session management, and core features like catalog
                    management and collaborator payouts.
                  </li>
                  <li>
                    <strong>Performance cookies.</strong> Provide analytics on product usage so we can improve reporting, splits, and
                    delivery tools.
                  </li>
                  <li>
                    <strong>Marketing cookies.</strong> Support optional features such as smart links, promotional widgets, and campaign
                    retargeting. These are only activated with your consent.
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>3. Managing preferences</h2>
                <p>
                  You can update cookie choices in your browser settings, adjust consent preferences in the dashboard where
                  available, or contact us for assistance. We honor browser-based opt-out signals, such as Global Privacy Control,
                  where legally required.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>4. Third-party technologies</h2>
                <p>
                  Some cookies are placed by third parties, including analytics providers (for example, Plausible) and payment
                  partners. We only authorize partners that meet our security and privacy requirements, but their practices are
                  governed by their own policies.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>5. Updates</h2>
                <p>
                  We may update this Cookie Policy when we introduce new tools or partners. We will post updates here and adjust the
                  effective date. Continued use after changes means you accept the revised policy.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>6. Contact</h2>
                <p>
                  Questions about cookies or consent preferences? Email <a href="mailto:privacy@truenorthmusic.com">privacy@truenorthmusic.com</a>
                  and our team will help configure your workspace.
                </p>
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
              <a href="/legal/privacy">Privacy Policy</a>
              <a href="/legal/dmca">DMCA</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

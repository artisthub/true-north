import Link from 'next/link';

const EFFECTIVE_DATE = 'November 6, 2025';

export default function PrivacyPolicyPage() {
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
                <h1>Privacy Policy</h1>
                <p className="terms-effective">Effective date: {EFFECTIVE_DATE}</p>
                <p>
                  This Privacy Policy describes how True North Distribution, LLC (“True North,” “we,” “us,” “our”) collects,
                  uses, and shares information about artists, labels, collaborators, and visitors to our websites and dashboards.
                  By using our services, you agree to the practices described here.
                </p>
              </div>
            </div>
          </section>

          <section className="section terms-content">
            <div className="container">
              <div className="terms-section fade-in">
                <h2>1. Information we collect</h2>
                <ul className="terms-list">
                  <li>
                    <strong>Account information.</strong> Names, email addresses, passwords, artist or label details, payout preferences,
                    and collaborator contact details you provide when creating or managing an account.
                  </li>
                  <li>
                    <strong>Catalog data.</strong> Release metadata, artwork, audio files, splits, and royalty statements uploaded through
                    the platform or sent to our team.
                  </li>
                  <li>
                    <strong>Usage data.</strong> Device information, IP addresses, browser type, and analytics on how you interact with our
                    marketing pages and dashboards.
                  </li>
                  <li>
                    <strong>Financial information.</strong> Payment and payout details processed through Stripe Connect or other third-party
                    partners. We do not store full card numbers on our servers.
                  </li>
                  <li>
                    <strong>Support communications.</strong> Messages sent to support channels, feedback forms, or interviews for product
                    research.
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>2. How we use information</h2>
                <ul className="terms-list">
                  <li>Provide distribution, royalty accounting, analytics, and collaborator management services.</li>
                  <li>Deliver statements, payment notifications, and product updates.</li>
                  <li>Improve and personalize tools, including testing new features and troubleshooting issues.</li>
                  <li>Protect True North and our partners from fraud, abuse, or violations of law.</li>
                  <li>Comply with legal obligations, including DMCA requests, tax reporting, and court orders.</li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>3. Sharing information</h2>
                <ul className="terms-list">
                  <li>
                    <strong>Distribution partners.</strong> DSPs, social platforms, and monetization services receive catalog data needed to
                    deliver and monetize your releases.
                  </li>
                  <li>
                    <strong>Service providers.</strong> Vendors that host infrastructure, analytics, support tools, and payment processing
                    access data solely to provide services on our behalf.
                  </li>
                  <li>
                    <strong>Collaborators.</strong> Artists, managers, labels, or accountants that you add to a project may see statements,
                    splits, or billing data you share with them.
                  </li>
                  <li>
                    <strong>Compliance.</strong> We may disclose information when required by law, court order, or to address security or
                    fraud concerns.
                  </li>
                  <li>
                    <strong>Business transfers.</strong> If we engage in a merger, acquisition, or financing, information may transfer as part
                    of that process subject to appropriate safeguards.
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>4. Your choices</h2>
                <ul className="terms-list">
                  <li>
                    Manage marketing communications by using the unsubscribe link or updating notification preferences in the dashboard.
                  </li>
                  <li>
                    Update account or payout details in settings or by contacting <a href="mailto:support@truenorthmusic.com">support@truenorthmusic.com</a>.
                  </li>
                  <li>
                    Adjust cookie preferences through browser settings or as described in our <a href="/legal/cookie-policy">Cookie Policy</a>.
                  </li>
                  <li>
                    Request access, correction, deletion, or portability of personal data by emailing
                    <a href="mailto:privacy@truenorthmusic.com"> privacy@truenorthmusic.com</a>. We may ask for verification before fulfilling requests.
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>5. Data retention</h2>
                <p>
                  We retain information for as long as needed to provide the Services, comply with legal obligations, resolve disputes,
                  and enforce agreements. Release files and statements may be kept to meet contractual reporting requirements even after
                  an account is closed.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>6. Security</h2>
                <p>
                  True North uses encryption, access controls, and regular monitoring to protect your data. No system is completely secure,
                  so we encourage you to use strong passwords, enable multi-factor authentication where available, and contact us immediately
                  if you suspect unauthorized activity.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>7. International data transfers</h2>
                <p>
                  We operate in the United States and may process information in other countries where our service providers operate. When
                  transferring personal data internationally, we use lawful mechanisms such as standard contractual clauses or rely on partners&apos;
                  participation in recognized frameworks.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>8. Changes to this policy</h2>
                <p>
                  We may update this Privacy Policy periodically. If changes are material we will notify you via email or dashboard alerts.
                  Continued use of the Services after the effective date constitutes acceptance of the updated policy.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>9. Contact</h2>
                <p>
                  For privacy questions or requests, email <a href="mailto:privacy@truenorthmusic.com">privacy@truenorthmusic.com</a> or mail us at
                  True North Distribution, 45 Main Street, Suite 500, Brooklyn, NY 11201.
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
              <a href="/legal/dmca">DMCA</a>
              <a href="/legal/cookie-policy">Cookie Policy</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

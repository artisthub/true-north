import Link from 'next/link';

export default function DmcaPolicyPage() {
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
                <h1>Digital Millennium Copyright Act (DMCA) Policy</h1>
                <p>
                  True North respects the rights of creators and copyright holders. This policy explains how to submit a notice
                  or counter-notice in line with the Digital Millennium Copyright Act so that we can act quickly and fairly.
                </p>
              </div>
            </div>
          </section>

          <section className="section terms-content">
            <div className="container">
              <div className="terms-section fade-in">
                <h2>1. Submitting a takedown notice</h2>
                <p>
                  If you believe material distributed through True North infringes your copyright, email a written notice to
                  <a href="mailto:dmca@truenorthmusic.com"> dmca@truenorthmusic.com</a> with the following details:
                </p>
                <ul className="terms-list">
                  <li>Your full legal name, business affiliation (if any), mailing address, phone number, and email.</li>
                  <li>Identification of the copyrighted work you believe has been infringed.</li>
                  <li>
                    Links, release identifiers, or other information that helps us locate the allegedly infringing material within
                    True North or on downstream platforms.
                  </li>
                  <li>
                    A statement that you have a good-faith belief the disputed use is not authorized by the copyright owner,
                    its agent, or the law.
                  </li>
                  <li>
                    A statement that the information in the notice is accurate and, under penalty of perjury, that you are the
                    copyright owner or authorized to act on the owner&apos;s behalf.
                  </li>
                  <li>Your physical or electronic signature.</li>
                </ul>
                <p>
                  After we receive a complete notice, we will acknowledge receipt, review the claim, and remove or disable access
                  to the referenced content if appropriate.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>2. Counter-notices</h2>
                <p>
                  If you are an artist or label whose content was removed due to a DMCA notice, you may submit a counter-notice
                  if you believe the removal was a mistake or misidentification. Email
                  <a href="mailto:dmca@truenorthmusic.com"> dmca@truenorthmusic.com</a> with:
                </p>
                <ul className="terms-list">
                  <li>Your name, mailing address, phone number, and email.</li>
                  <li>The release or content that was removed, including any relevant identifiers.</li>
                  <li>
                    A statement under penalty of perjury that you have a good-faith belief the material was removed or disabled as
                    a result of mistake or misidentification.
                  </li>
                  <li>
                    Your consent to the jurisdiction of the federal district court for the judicial district in which you reside
                    (or, if outside the United States, the Northern District of California) and that you will accept service of
                    process from the claimant who submitted the original DMCA notice or their agent.
                  </li>
                  <li>Your physical or electronic signature.</li>
                </ul>
                <p>
                  When a valid counter-notice is received, we will forward it to the complainant. Unless the complainant informs us
                  within 10 business days that they have filed an action seeking a court order, we may restore the content.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>3. Repeat infringement</h2>
                <p>
                  We reserve the right to terminate accounts or remove content from users who repeatedly infringe copyrights.
                  Determinations are made at True North&apos;s discretion, taking into account the circumstances of each case.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>4. Questions</h2>
                <p>
                  For questions about this policy or the status of a notice, email <a href="mailto:dmca@truenorthmusic.com">dmca@truenorthmusic.com</a>.
                  We aim to respond promptly to help protect rights holders while keeping releases online for legitimate creators.
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
              <a href="/legal/cookie-policy">Cookie Policy</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

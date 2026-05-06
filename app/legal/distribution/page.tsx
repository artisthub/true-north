/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';

const EFFECTIVE_DATE = 'February 12, 2026';

export default function DistributionAgreementPage() {
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
                <Link href="/">
                  <div className="logo-icon">
                    <img src="/True_North_Pink_Black.png" alt="True North Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                  </div>
                </Link>
              </div>
              <nav>
                <a href="/">Home</a>
                <a href="/#distribution">Distribution</a>
                <a href="/resources">Resources</a>
                <a href="/about">About</a>
                <a href="/#pricing">Pricing</a>
                <a className="btn-primary" href="/apply">
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
                <h1>Distribution Agreement</h1>
                <p className="terms-effective">Appendix A — Last updated: {EFFECTIVE_DATE}</p>
                <p>
                  This Distribution Agreement supplements the{' '}
                  <a href="/legal/terms">True North Terms &amp; Conditions</a> and governs your use
                  of the True North digital distribution service. By using the Distribution Service,
                  you agree to both documents. Capitalized terms not defined here have the meanings
                  given in the Terms &amp; Conditions.
                </p>
              </div>
            </div>
          </section>

          <section className="section terms-content">
            <div className="container">

              <div className="terms-section fade-in">
                <h2>1. Description of Service</h2>
                <p>
                  The Distribution Service digitally distributes your music through various digital
                  Internet retailers. You must be a registered user of the Site to use the Distribution
                  Service. Additional information about the Distribution Service is located on{' '}
                  <a href="https://www.truenorthdistro.com" target="_blank" rel="noopener noreferrer">
                    www.truenorthdistro.com
                  </a>.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>2. Defined Terms</h2>
                <ul className="terms-list">
                  <li>
                    <strong>"Album Release(s)"</strong> means the Digital Distribution of multiple Recordings
                    to the DSPs as a single album or extended play (EP) format and not to exceed one hundred
                    (100) tracks.
                  </li>
                  <li>
                    <strong>"Digital Distribution"</strong> or <strong>"Digitally Distribute"</strong> means
                    the digital distribution of Recording(s) for the sublicensing, sale, public performance,
                    electronic transmission, or other distribution to end users in any media whether now known
                    or existing in the future, including but not limited to permanent digital downloads, limited
                    or temporary digital downloads, ringtones, ring-back tones, interactive streaming,
                    noninteractive streaming, and cloud services, whether or not a direct or indirect charge is
                    made to receive the transmission.
                  </li>
                  <li>
                    <strong>"Recording(s)"</strong> means sound recordings and audiovisual recordings of
                    underlying musical compositions that you provide, or previously provided, to us for Digital
                    Distribution as Release(s), together with materials submitted therewith including associated
                    metadata, copyright management information, artwork, graphics, logos, and any other related
                    materials.
                  </li>
                  <li>
                    <strong>"Release(s)"</strong> means, as applicable, an Album Release and a Singles Release.
                  </li>
                  <li>
                    <strong>"Digital Service Provider" / "DSP(s)"</strong> means our licensees and the digital
                    Internet consumer stores with respect to which we have agreements (whether directly or
                    indirectly) to Digitally Distribute Recordings. DSPs may change from time to time at our
                    sole discretion, subject only to your right to terminate the Distribution Service as
                    provided below.
                  </li>
                  <li>
                    <strong>"Single Release(s)"</strong> means the Digital Distribution of a single Recording
                    to the DSPs as a single track.
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>3. Submission of Materials and Ownership</h2>
                <p>
                  Recordings and all relevant information shall be submitted to us for Digital Distribution
                  as Releases from your Dashboard in accordance with and subject to the Terms &amp; Conditions.
                  Such submissions shall be deemed User Content and subject to all applicable representations,
                  warranties, and agreements thereunder.
                </p>
                <p>
                  To the extent you do not own any underlying musical compositions, sound recordings, samples,
                  publicity rights, or other materials in your User Content, it is your obligation to secure
                  all appropriate permissions, clearances, licenses, or other authorizations and agreements,
                  and to pay directly all third-party fees and royalties as may be required, including
                  mechanical royalties, digital phonograph delivery royalties, public performance royalties,
                  and any other royalties, fees, and/or sums payable with respect to your User Content.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>4. Authorization</h2>
                <p>
                  Without limitation of your grant of rights in the Terms &amp; Conditions, such rights
                  include the right to Digitally Distribute all Recording(s) as Release(s) and to otherwise
                  use the Recordings to the extent necessary to facilitate such Digital Distribution,
                  including the rights to:
                </p>
                <ul className="terms-list">
                  <li>
                    Reproduce, convert, and create derivative works of your Recordings and related materials
                    for Digital Distribution of your Release(s);
                  </li>
                  <li>
                    Reproduce, promote, advertise, market, sublicense, sell, publicly perform, display, host,
                    distribute, deliver, transmit, and otherwise exploit and use Recordings and related
                    materials for Digital Distribution of your Release(s);
                  </li>
                  <li>
                    Display any and all lyrics associated with a musical composition embodied in any Recording
                    in connection with the Digital Distribution of your Release(s);
                  </li>
                  <li>
                    Use the name(s), voice(s), likeness(es), photograph(s), images, artwork, logos, trademarks,
                    service marks, biographical materials, and other rights of publicity with respect to
                    materials and information that you provide to us in connection with the Digital Distribution
                    of your Release(s);
                  </li>
                  <li>Collect all income deriving from the Digital Distribution of your Release(s);</li>
                  <li>
                    Exercise all rights granted herein, including the right to edit and publicly perform
                    Recordings consistent with industry standards, for purposes of publicizing, promoting,
                    marketing, and advertising the availability of the Recordings for Digital Distribution;
                  </li>
                  <li>Sublicense all rights granted in this Section to DSPs or other licensees.</li>
                </ul>
                <p>
                  You agree not to use any other Digital Distribution service with respect to any DSPs except
                  only to the extent that an Internet consumer store is no longer a DSP hereunder.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>5. Distribution Service</h2>
                <p>
                  True North will submit your Recordings to DSPs for Digital Distribution in accordance with
                  the type of Release you have purchased and these terms. The scope and type of Digital
                  Distribution provided by each DSP varies in accordance with the particular service(s) any
                  particular DSP offers. True North reserves the right to decline to distribute or discontinue
                  the distribution of any Recording(s) in our sole discretion.
                </p>
                <p>
                  Your Dashboard will indicate which types of Releases are currently available for your account,
                  which may vary by customer and change over time.
                </p>
                <p>
                  As part of the compensation paid by you to True North, True North provides ISRCs or Universal
                  Product Codes (UPCs) for your Recording(s). These are for use only in connection with the
                  Distribution Service provided by us and may not be transferred or resold. If you have
                  previously obtained ISRCs or UPCs from another source, you shall provide such
                  previously-assigned codes when submitting your Recording(s) to us.
                </p>
                <p>
                  You acknowledge that in providing the Distribution Service and payments hereunder, we have
                  entered into one or more agreements with respect to the DSPs. You agree that these terms shall
                  be subject to any applicable terms and conditions of those agreements, and to the extent of
                  any conflict, the terms of the DSP agreements shall control.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>6. Distribution Service Fees and Payment</h2>
                <p>
                  For each Release, you are required to pay the applicable Service Fees in accordance with our
                  policies set forth in the Terms &amp; Conditions. Current fee schedules are available on the
                  Site or in your Dashboard. These fees may be amended from time to time by us without notice
                  to you. You are solely responsible for all charges, fees, duties, and taxes incurred by your
                  user account in connection with the Distribution Service.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>7. Sales Income</h2>
                <p>
                  We will pay you an amount equal to one hundred percent (100%) of our actual receipts in
                  connection with the Digital Distribution of your Release(s), minus any applicable
                  disbursement fees as determined by us from time to time and except as otherwise provided in
                  these Distribution Terms ("Sales Income"). Sales Income will be posted in U.S. Dollars to
                  your True North Credit Account in a timely fashion after our receipt thereof, together with
                  related sales and accounting data. To the extent that you owe any amounts to us, we shall
                  have the right to deduct all or a portion of such amounts from any Sales Income otherwise
                  payable to you.
                </p>
                <p>
                  In the event that we have reason to suspect that your account has been subjected to
                  fraudulent or infringing activities: (i) we reserve the right to discontinue the posting of
                  Sales Income to your account and block your ability to withdraw funds; (ii) Sales Income may
                  be forfeited by you; and (iii) if we elect to engage an attorney in connection therewith, we
                  shall have the right to deduct from any monies otherwise payable to you an additional fee of
                  a minimum of seven hundred dollars ($700 U.S.) to offset the costs of associated legal fees
                  and expenses.
                </p>
                <p>
                  As we receive sales information from the DSPs with respect to your Recording(s), we will
                  make this information available to you through your Dashboard. This information comes from a
                  DSP and we are not responsible for any errors or inaccuracies in the information.
                </p>
                <p>
                  You acknowledge and agree that we and any of the DSPs shall have the right to market,
                  promote, advertise, and distribute Recordings in connection with Digital Distribution
                  promotional programs for which we or the DSPs receive no payment, and in connection with
                  such promotions we and the DSP shall have no payment obligations to you.
                </p>
                <p>
                  You acknowledge and agree that you will not use any automated means or method not authorized
                  by any applicable DSP, including bots, botnets, robots, spiders, scrapers, data mining
                  tools, or automated scripts, to access your Recording(s) from the DSPs to generate plays,
                  streams, or other uses for the purpose of generating fraudulent Sales Income.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>8. Termination</h2>
                <p>
                  You may terminate your use of the Distribution Service in accordance with the Terms &amp;
                  Conditions. Following our receipt of your written notice of termination, we may notify all
                  applicable DSPs to discontinue the distribution and sale of the applicable Recording(s). You
                  will not be entitled to reimbursement of any pre-paid fees with respect to any terminated
                  Recording(s).
                </p>
                <p>
                  Upon our termination of your use of the Distribution Service, we may notify all DSPs to
                  discontinue the distribution and sale of your Recording(s). You will not be entitled to
                  reimbursement of any pre-paid fees with respect to any terminated Recording(s).
                </p>
                <p>
                  In the event that the Digital Distribution of any Release is terminated for any reason and
                  you still owe applicable Service Fees (including any applicable takedown fees): (i) we may
                  elect to continue the distribution and sale of your Release(s); (ii) all rights granted to
                  us hereunder and the DSPs will continue; (iii) we will be entitled to keep one hundred
                  percent (100%) of Sales Income due to you until the applicable Service Fee is fully
                  recouped; and (iv) you will continue to be responsible for all of your obligations under
                  these terms.
                </p>
                <p className="terms-disclaimer">
                  YOU UNDERSTAND AND AGREE THAT WE AND THE DSPs HAVE THE RIGHT, BUT NO OBLIGATION, TO
                  MARKET, PROMOTE, AND ADVERTISE YOUR RELEASE(S). WE MAKE NO GUARANTEES WHATSOEVER WITH
                  RESPECT TO THE SCOPE OF EACH DSP'S DISTRIBUTION OF YOUR RELEASE(S), MINIMUM SALES OF YOUR
                  RECORDING(S), PAYMENTS TO YOU UNDER THESE DISTRIBUTION TERMS, THE MARKETING OR PROMOTION
                  OF YOUR RECORDING(S) BY THE DSPs, OR WHETHER A DSP WILL ACTUALLY OFFER YOUR RECORDING(S)
                  FOR SALE. EACH DSP HAS TOTAL DISCRETION AS TO WHETHER IT WILL OFFER YOUR RECORDING(S) FOR
                  SALE.
                </p>
              </div>

              <div className="terms-section fade-in">
                <p className="terms-signoff">
                  By using the Distribution Service, you acknowledge that you have read, understood, and agree
                  to this Distribution Agreement and the{' '}
                  <a href="/legal/terms">True North Terms &amp; Conditions</a>.
                </p>
              </div>

            </div>
          </section>
        </main>

        <footer className="terms-footer">
          <div className="container">
            <p>© 2025 True North. All rights reserved.</p>
            <nav>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/#pricing">Pricing</a>
              <a href="/legal/terms">Terms &amp; Conditions</a>
              <a href="/legal/dmca">DMCA</a>
              <a href="/legal/cookie-policy">Cookie Policy</a>
              <a href="/legal/privacy">Privacy Policy</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

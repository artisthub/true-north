import Link from 'next/link';

const EFFECTIVE_DATE = 'November 6, 2025';

export default function TermsPage() {
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
                <a className="btn-primary" href="/#start">
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
                <h1>True North Distribution Terms &amp; Conditions</h1>
                <p className="terms-effective">Effective date: {EFFECTIVE_DATE}</p>
                <p>
                  These Terms &amp; Conditions form a binding agreement between you and True North Distribution, LLC
                  (including applicable affiliates). By creating an account or using our distribution and related services,
                  you accept every provision below. Review them carefully and reach out to legal counsel if you need
                  guidance on how they apply to your catalog.
                </p>
              </div>
            </div>
          </section>

          <section className="section terms-content">
            <div className="container">
              <div className="terms-section fade-in">
                <h2>1. Who we are &amp; how these terms work</h2>
                <p>
                  These Terms &amp; Conditions (the “Terms”) govern your access to and use of True North Distribution’s
                  music distribution, monetization, and related services (the “Services”). The agreement is between True
                  North Distribution, LLC (or the relevant affiliate, “True North,” “we,” “us,” or “our”) and the artist,
                  label, or other rightsholder (“you”). Using the Services constitutes acceptance of these Terms.
                </p>
                <p>
                  We may offer different service plans (for example, subscription or revenue-share models). Any order
                  form, checkout page, dashboard selection, or signed addendum that you accept (“Plan Terms”) becomes
                  part of these Terms. If Plan Terms conflict with this document, the Plan Terms govern for that plan.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>2. Key definitions</h2>
                <ul className="terms-list">
                  <li>
                    <strong>Content.</strong> The sound recordings (masters), musical compositions embodied in those
                    recordings, artwork, metadata, images, clips, lyrics, and any other materials you submit to the Services.
                  </li>
                  <li>
                    <strong>DSPs.</strong> Digital service providers such as Spotify, Apple Music, YouTube Music, Amazon
                    Music, TikTok, Instagram, and similar platforms.
                  </li>
                  <li>
                    <strong>Gross Receipts.</strong> Amounts actually received by True North from DSPs or other partners
                    that are directly attributable to the exploitation of your Content via the Services, excluding sums that
                    are never received by us.
                  </li>
                  <li>
                    <strong>Net Receipts.</strong> Gross Receipts minus: (i) our Distribution Fee (if applicable); (ii) payment
                    processing, transfer, or currency conversion fees; (iii) refunds and chargebacks; (iv) taxes, tariffs, or
                    mandatory withholdings; and (v) any amounts attributable to fraud or prohibited activity.
                  </li>
                  <li>
                    <strong>Streaming Receipts.</strong> Gross Receipts derived from on-demand streaming and UGC/audio
                    platforms (for example, Spotify, Apple Music, YouTube Music/Content ID/Shorts, TikTok, Instagram, or
                    Facebook).
                  </li>
                  <li>
                    <strong>Other Receipts.</strong> Gross Receipts from non-streaming uses (for example, downloads,
                    ad-supported sales outside streaming, or physical sales reported via DSP partners).
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>3. Account, eligibility &amp; security</h2>
                <p>
                  You must be at least the age of majority in your jurisdiction (and at least 18 years old) and have the
                  authority to bind the rightsholder to these Terms. You are responsible for the security of your account
                  credentials and for keeping all account, payout, and tax information accurate and up to date.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>4. Non-exclusive grant of rights (you retain ownership)</h2>
                <p>
                  You retain all ownership rights in the Content. You grant True North a non-exclusive, worldwide,
                  transferable, sublicensable license during the Term to: (a) reproduce, adapt, distribute, publicly perform,
                  communicate to the public, display, and otherwise make the Content available on or through DSPs and
                  partner platforms; (b) create or authorize the technical adaptations needed to operate the Services (for
                  example, transcodes, clips, fingerprints, and ID files); (c) use your approved name, likeness, trademarks,
                  and biographies to identify and promote the availability of the Content; and (d) collect, receive, and
                  administer royalties and other income from DSPs in connection with the Content.
                </p>
                <p>
                  Except for the license above, no ownership interest transfers to True North. You may work with other
                  distributors unless you sign a separate exclusive agreement. Withdrawal rights are described in Section 12.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>5. Your responsibilities &amp; clearances</h2>
                <p>
                  You represent and warrant that you own or control all rights necessary for the distribution described in
                  these Terms, including all master, composition, and artwork rights. You must secure and timely pay for
                  all required licenses and permissions (for example, writer and publisher mechanical licenses, sample
                  clearances, producer and mixer agreements, artwork and photo rights, and any required union or guild
                  payments). The Content and your use of the Services must not infringe, misappropriate, or violate any
                  third-party rights or laws.
                </p>
                <p>
                  <strong>Covers &amp; samples.</strong> If you distribute a cover or a recording containing samples, you are solely
                  responsible for obtaining and maintaining all required licenses. We may reject or remove Content that
                  lacks proper clearances.
                </p>
                <p>
                  <strong>Prohibited conduct.</strong> You will not use the Services for illegal, deceptive, defamatory, pornographic,
                  or harmful purposes; introduce malware; or engage in activity that creates a security, legal, reputational,
                  or platform-policy risk. You will not participate in artificial streaming, bots, click-farms, or other fraud.
                  We may suspend payouts and/or remove Content that we reasonably believe is fraudulent or non-compliant.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>6. Pricing &amp; plans</h2>
                <p>
                  We currently offer two plans. The selection you make in the dashboard or checkout experience (the Plan
                  Terms) governs plan-specific details.
                </p>
                <h3>Tier 1 – Flat fee distribution</h3>
                <ul className="terms-list">
                  <li>Price: $39 per year (per artist profile or account).</li>
                  <li>Distribution fee: 0% on Streaming Receipts and downloads reported through DSPs.</li>
                  <li>Add-ons: Optional services (for example, UGC/YouTube monetization) may carry additional splits or fees.</li>
                  <li>
                    Included features: delivery to supported DSPs (no territory exclusions), routine quality control,
                    catalog and metadata tools, artist/client portal access, periodic statements, standard royalty
                    accounting, and basic collaborator split support.
                  </li>
                </ul>
                <p>
                  If you enable the UGC/YouTube monetization add-on for a release, royalties reported by YouTube or UGC
                  platforms are allocated 70% to you, 10% to True North (administration fee), and 20% to Revelator (platform
                  provider). The split applies only to UGC receipts for the enabled release and is deducted before payout. You
                  can enable or disable the add-on per release; DSP processing timelines apply.
                </p>
                <h3>Tier 2 – Revenue share</h3>
                <ul className="terms-list">
                  <li>Distribution fee: 15% of Streaming Receipts (streaming only).</li>
                  <li>Downloads and other non-streaming receipts: 0% distribution fee.</li>
                  <li>Minimum: $60 per account per 12-month contract year, applied against earnings (shortfalls may be invoiced).</li>
                  <li>Payout frequency: Monthly statements on or about the 25th; payouts triggered within 24–48 hours after statements (subject to receipt of funds).</li>
                  <li>Minimum withdrawal: $25.</li>
                  <li>UGC/YouTube add-on: Same 70/10/20 split described above, applied to the enabled release(s).</li>
                </ul>
                <h3>6B. Fees &amp; refunds</h3>
                <p>
                  All fees—including subscriptions, minimums, and add-ons—are non-refundable once any release has been
                  delivered to a DSP, unless required otherwise by law.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>7. Statements, payouts &amp; taxes</h2>
                <ul className="terms-list">
                  <li>
                    <strong>Statements &amp; timing.</strong> We provide monthly statements on the 25th of each month and trigger
                    payouts within 24–48 hours after statements are generated, subject to our actual receipt of DSP funds
                    (industry reporting lags are typically 60–90 days).
                  </li>
                  <li>
                    <strong>Payout method.</strong> Payouts are executed through Stripe Connect (Express). You must complete
                    Stripe onboarding and know-your-customer requirements.
                  </li>
                  <li>
                    <strong>Thresholds &amp; fees.</strong> Minimum withdrawal threshold is $25. You are responsible for third-party
                    transfer, payout, and currency conversion fees deducted by payment providers or intermediaries.
                  </li>
                  <li>
                    <strong>Compliance holds.</strong> We may withhold or delay payments (and request additional KYC documentation)
                    if we suspect fraud, infringement, account compromise, sanctions issues, or inaccurate tax information.
                  </li>
                  <li>
                    <strong>Tax forms.</strong> Provide valid W-9/W-8 (or local equivalent) forms. We may withhold amounts as required
                    by law. You are solely responsible for your taxes.
                  </li>
                  <li>
                    <strong>Recoupment &amp; offset.</strong> We may offset overpayments, chargebacks, clawbacks, or DSP adjustments
                    against current or future sums owed to you.
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>8. Delivery standards &amp; technical processing</h2>
                <p>
                  You must follow our published delivery specifications (including audio formats, metadata accuracy,
                  ISRC/UPC/EAN codes, territories, release dates, marketing rights, lyrics, and clean or explicit flags). We may
                  edit or re-format metadata and transcode audio to meet DSP requirements. We may refuse or request
                  takedown of Content that fails quality control or platform policies.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>9. Platform rules &amp; takedowns</h2>
                <p>
                  DSPs maintain their own policies and may refuse, remove, geo-block, or reclassify Content at any time. True
                  North is not responsible for third-party decisions or timing. If we receive a copyright complaint (DMCA or
                  equivalent), we may remove or disable access to the Content and notify you. If you submit a valid counter-
                  notice, we will process it consistent with applicable law. Repeated or egregious violations may result in
                  account termination.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>10. Marketing, name/likeness &amp; promotion</h2>
                <p>
                  You grant us a non-exclusive, royalty-free license to use your approved names, trademarks, logos, and
                  likenesses to identify you and to promote the availability of your Content through the Services and DSPs. We
                  will not falsely imply your endorsement of third-party products without your consent.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>11. Third-party services</h2>
                <p>
                  We rely on trusted third-party providers to operate portions of the Services. Without limitation, we
                  currently use: (a) Revelator for catalog management, deliveries to DSPs, client and artist portal access, and
                  royalty and statement administration; and (b) Stripe Connect (Express) for onboarding, identity verification,
                  and payouts.
                </p>
                <p>
                  Your agreement for the Services is with True North. Using third-party providers does not create a customer
                  relationship between you and those providers, though their terms and privacy practices may apply to the
                  components they power. We may change providers at any time without materially reducing the Services.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>12. Term, termination &amp; keeping releases live</h2>
                <p>
                  These Terms begin when you create an account or first use the Services and continue until terminated.
                  You may remove specific releases or close your account by giving 30 days’ notice through the dashboard or
                  support channels, after which we will request takedowns from DSPs. Timing of removals depends on DSP
                  processing.
                </p>
                <p>
                  We may suspend or terminate the Services or your account for breach, legal or compliance reasons,
                  platform policies, business changes, inactivity, or for any reason with reasonable notice when practicable.
                </p>
                <p>
                  <strong>Post-cancellation policy (Tier 1).</strong> If you cancel Tier 1 ($39/year), releases remain live on DSPs; however,
                  your account enters maintenance mode: we retain 15% of Streaming Receipts (downloads remain at 0%),
                  UGC/YouTube monetization and other optional features are disabled, and support is limited to critical
                  compliance matters. You may resubscribe to restore Tier 1 benefits at any time.
                </p>
                <p>
                  Upon termination or takedown, we will account for and pay Net Receipts actually received up to the
                  effective date. Sections that by nature should survive (for example, payments due, warranties, indemnities,
                  limitations of liability, and dispute resolution provisions) remain in effect.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>13. Warranties &amp; compliance</h2>
                <p>
                  <strong>By you.</strong> You warrant that: (i) all metadata you provide is accurate and not misleading; (ii) no Content
                  contains undisclosed samples; (iii) you have paid and will pay all contributors and rightsholders; and (iv)
                  your activities comply with sanctions, export, and anti-bribery laws.
                </p>
                <p>
                  <strong>By us.</strong> The Services are provided “as is” and “as available.” We disclaim all warranties not expressly
                  stated in these Terms, including implied warranties of merchantability, fitness for a particular purpose, title,
                  and non-infringement. We do not warrant uninterrupted or error-free operation or specific results on any
                  DSP.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>14. Indemnity</h2>
                <p>
                  You will defend, indemnify, and hold harmless True North, its affiliates, and their directors, officers,
                  employees, and agents from any third-party claims, damages, costs, and expenses (including reasonable
                  attorneys’ fees) arising out of: (a) the Content; (b) any breach of these Terms or your warranties; (c) failure
                  to secure or maintain required licenses or to pay contributors; (d) fraud or prohibited conduct; or (e) your use
                  of the Services.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>15. Limitation of liability</h2>
                <p>
                  To the fullest extent permitted by law: (a) neither party is liable for indirect, special, incidental,
                  consequential, exemplary, or punitive damages; and (b) each party’s total liability for all claims in the
                  aggregate is capped at the greater of (i) the amounts paid or payable by you to True North in the 12 months
                  preceding the claim or (ii) USD $100. Nothing in these Terms limits liability for fraud, willful misconduct, or
                  amounts that cannot be limited by law.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>16. Dispute resolution &amp; class-action waiver</h2>
                <p>
                  <strong>Governing law &amp; venue.</strong> These Terms are governed by the laws of the State of Florida, without
                  regard to its conflicts of law principles. The exclusive venue for any action not subject to arbitration is the
                  state or federal courts located in Palm Beach County, Florida, and each party consents to personal
                  jurisdiction there.
                </p>
                <p>
                  <strong>Arbitration.</strong> Except for claims seeking injunctive relief or matters that qualify for small-claims court,
                  any dispute will be resolved by binding individual arbitration administered by JAMS under its applicable
                  rules. Class actions are waived. Judgment on the arbitration award may be entered in any court of competent
                  jurisdiction. You may opt out of arbitration by providing written notice within 30 days of account creation.
                  Details are available upon request.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>17. Changes to the Services or these Terms</h2>
                <p>
                  We may modify the Services or these Terms prospectively. If we make material changes, we will notify you
                  by email or through the dashboard. Continued use after the effective date of the updated Terms constitutes
                  acceptance. If you do not agree, you must stop using the Services and request removal of your Content.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>18. Privacy</h2>
                <p>
                  Our Privacy Policy explains how we collect, use, and share information. By using the Services, you consent
                  to our data practices as described in that policy.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>19. Notices</h2>
                <p>
                  You may contact us for legal or account notices through the dashboard support channel or via
                  <a href="mailto:legal@truenorthdistro.com"> legal@truenorthdistro.com</a>. Stripe Connect (Express) is our payment processing
                  and payout provider.
                </p>
              </div>

              <div className="terms-section fade-in">
                <h2>20. Miscellaneous</h2>
                <ul className="terms-list">
                  <li>
                    <strong>Independent parties.</strong> Nothing in these Terms creates a partnership, employment, or fiduciary
                    relationship.
                  </li>
                  <li>
                    <strong>Assignment.</strong> You may not assign these Terms without our prior written consent; we may assign them
                    to an affiliate or in connection with a merger, sale, or reorganization.
                  </li>
                  <li>
                    <strong>Entire agreement.</strong> These Terms and any applicable Plan Terms constitute the entire agreement and
                    supersede prior understandings related to the Services.
                  </li>
                  <li>
                    <strong>Severability &amp; waiver.</strong> If a provision is unenforceable, it will be modified to achieve the parties’
                    intent, and the remainder remains in effect. Our failure to enforce a provision is not a waiver.
                  </li>
                  <li>
                    <strong>Force majeure.</strong> Neither party is liable for delays or failures caused by events beyond reasonable
                    control (for example, platform outages, network failures, strikes, government action, war, terrorism, or
                    natural disasters).
                  </li>
                </ul>
              </div>

              <div className="terms-section fade-in">
                <h2>21. Plan schedule</h2>
                <div className="terms-plan-grid">
                  <div>
                    <h3>Tier 1 – Flat fee distribution</h3>
                    <ul className="terms-list">
                      <li>Price: $39 per year (per artist profile or account).</li>
                      <li>Distribution fee: 0% of Streaming Receipts and downloads.</li>
                      <li>
                        UGC/YouTube add-on: Receipts split 70% Artist / 10% True North / 20% Revelator for enabled releases.
                      </li>
                      <li>
                        Included benefits: delivery to supported DSPs, quality control, catalog and metadata tools, artist/client
                        portal, periodic statements, standard royalty accounting, and collaborator split support.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3>Tier 2 – Revenue share</h3>
                    <ul className="terms-list">
                      <li>Distribution fee: 15% of Streaming Receipts (streaming only).</li>
                      <li>Downloads &amp; other non-streaming receipts: 0% distribution fee.</li>
                      <li>Minimum: $60 per account per 12-month contract year (applied against earnings; shortfalls may be billed).</li>
                      <li>Payout frequency: Monthly statements on or about the 25th with payouts triggered within 24–48 hours (subject to funds received).</li>
                      <li>Minimum withdrawal: $25.</li>
                      <li>
                        UGC/YouTube add-on: Receipts split 70% Artist / 10% True North / 20% Revelator for enabled releases.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="terms-maintenance">
                  <h3>Post-cancellation (Tier 1)</h3>
                  <p>
                    Releases remain live, but the account shifts to maintenance mode: 15% of Streaming Receipts (downloads
                    remain at 0%), add-ons are disabled, and support is limited to critical compliance matters. Resubscribe to
                    restore Tier 1 benefits.
                  </p>
                </div>
                <p className="terms-signoff">
                  By clicking “I Agree” or using the Services, you acknowledge that you have read, understood, and agree to
                  these Terms &amp; Conditions.
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
              <a href="/#dmca-policy">DMCA</a>
              <a href="/#cookie-policy">Cookie Policy</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

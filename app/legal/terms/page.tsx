import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EFFECTIVE_DATE = 'November 6, 2025';

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-3xl border border-[#FF1493]/25 bg-white/5 p-8 shadow-[0_20px_60px_rgba(255,20,147,0.08)] backdrop-blur-sm">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-gray-300">{children}</div>
    </article>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050005] text-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,20,147,0.15),_transparent_60%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-[#FF1493]/15 blur-[200px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[45vw] h-[45vw] bg-[#FF69B4]/20 blur-[200px]" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,105,180,0.2) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,20,147,0.2) 1px, transparent 1px)'
        }} />
      </div>

      <header className="relative z-20 border-b border-[#FF1493]/20 bg-[rgba(5,0,8,0.8)] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3 font-semibold text-white">
            <Image src="/logo.svg" alt="True North" width={140} height={36} priority className="w-32 h-auto" />
            <span className="text-sm tracking-[0.2em] text-pink-200/80 uppercase">Legal</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <a href="/#distribution" className="hover:text-[#FF69B4] transition-colors">
              Distribution
            </a>
            <a href="/#features" className="hover:text-[#FF69B4] transition-colors">
              Features
            </a>
            <Link href="/about" className="hover:text-[#FF69B4] transition-colors">
              About
            </Link>
            <a href="/#pricing" className="hover:text-[#FF69B4] transition-colors">
              Pricing
            </a>
          </nav>
          <a
            href="/#start"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF1493] to-[#FF69B4] px-6 py-2 text-sm font-semibold shadow-[0_15px_45px_rgba(255,20,147,0.3)] hover:-translate-y-0.5 transition-transform"
          >
            Get Started
          </a>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-24">
        <section className="max-w-4xl mx-auto px-6 text-center">
          <p className="uppercase tracking-[0.4em] text-xs text-[#FF69B4]">True North Distribution</p>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFE0F4] to-[#FF69B4]">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm font-semibold tracking-[0.3em] text-pink-200/80">
            Effective date: {EFFECTIVE_DATE}
          </p>
          <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
            These Terms &amp; Conditions form a binding agreement between you and True North Distribution, LLC. By creating an
            account or using our distribution and related services, you accept every provision below. Review them carefully and
            reach out to legal counsel if you need guidance on how they apply to your catalog.
          </p>
        </section>

        <section className="mt-16 space-y-8 max-w-5xl mx-auto px-6">
          <SectionCard title="1. Who we are &amp; how these terms work">
            <p>
              These Terms &amp; Conditions (the “Terms”) govern your access to and use of True North Distribution’s music distribution,
              monetization, and related services (the “Services”). The agreement is between True North Distribution, LLC (or the
              relevant affiliate, “True North,” “we,” “us,” or “our”) and the artist, label, or other rightsholder (“you”). Using the
              Services constitutes acceptance of these Terms.
            </p>
            <p>
              We may offer different service plans (for example, subscription or revenue-share models). Any order form, checkout
              page, dashboard selection, or signed addendum that you accept (“Plan Terms”) becomes part of these Terms. If Plan
              Terms conflict with this document, the Plan Terms govern for that plan.
            </p>
          </SectionCard>

          <SectionCard title="2. Key definitions">
            <ul className="list-disc pl-5 space-y-3 text-gray-300">
              <li>
                <span className="text-white font-semibold">Content.</span> The sound recordings (masters), musical compositions embodied in those recordings,
                artwork, metadata, images, clips, lyrics, and any other materials you submit to the Services.
              </li>
              <li>
                <span className="text-white font-semibold">DSPs.</span> Digital service providers such as Spotify, Apple Music, YouTube Music, Amazon Music,
                TikTok, Instagram, and similar platforms.
              </li>
              <li>
                <span className="text-white font-semibold">Gross Receipts.</span> Amounts actually received by True North from DSPs or other partners that are
                directly attributable to the exploitation of your Content via the Services, excluding sums that are never received by us.
              </li>
              <li>
                <span className="text-white font-semibold">Net Receipts.</span> Gross Receipts minus: (i) our Distribution Fee (if applicable); (ii) payment processing,
                transfer, or currency conversion fees; (iii) refunds and chargebacks; (iv) taxes, tariffs, or mandatory withholdings; and (v)
                any amounts attributable to fraud or prohibited activity.
              </li>
              <li>
                <span className="text-white font-semibold">Streaming Receipts.</span> Gross Receipts derived from on-demand streaming and UGC/audio platforms (for
                example, Spotify, Apple Music, YouTube Music/Content ID/Shorts, TikTok, Instagram, or Facebook).
              </li>
              <li>
                <span className="text-white font-semibold">Other Receipts.</span> Gross Receipts from non-streaming uses (for example, downloads, ad-supported sales
                outside streaming, or physical sales reported via DSP partners).
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="3. Account, eligibility &amp; security">
            <p>
              You must be at least the age of majority in your jurisdiction (and at least 18 years old) and have the authority to bind
              the rightsholder to these Terms. You are responsible for the security of your account credentials and for keeping all
              account, payout, and tax information accurate and up to date.
            </p>
          </SectionCard>

          <SectionCard title="4. Non-exclusive grant of rights (you retain ownership)">
            <p>
              You retain all ownership rights in the Content. You grant True North a non-exclusive, worldwide, transferable,
              sublicensable license during the Term to: (a) reproduce, adapt, distribute, publicly perform, communicate to the public,
              display, and otherwise make the Content available on or through DSPs and partner platforms; (b) create or authorize the
              technical adaptations needed to operate the Services (for example, transcodes, clips, fingerprints, and ID files); (c) use
              your approved name, likeness, trademarks, and biographies to identify and promote the availability of the Content; and
              (d) collect, receive, and administer royalties and other income from DSPs in connection with the Content.
            </p>
            <p>
              Except for the license above, no ownership interest transfers to True North. You may work with other distributors unless
              you sign a separate exclusive agreement. Withdrawal rights are described in Section 12.
            </p>
          </SectionCard>

          <SectionCard title="5. Your responsibilities &amp; clearances">
            <p>
              You represent and warrant that you own or control all rights necessary for the distribution described in these Terms,
              including all master, composition, and artwork rights. You must secure and timely pay for all required licenses and
              permissions (for example, writer and publisher mechanical licenses, sample clearances, producer and mixer agreements,
              artwork and photo rights, and any required union or guild payments). The Content and your use of the Services must not
              infringe, misappropriate, or violate any third-party rights or laws.
            </p>
            <p>
              <span className="text-white font-semibold">Covers &amp; samples.</span> If you distribute a cover or a recording containing samples, you are solely responsible
              for obtaining and maintaining all required licenses. We may reject or remove Content that lacks proper clearances.
            </p>
            <p>
              <span className="text-white font-semibold">Prohibited conduct.</span> You will not use the Services for illegal, deceptive, defamatory, pornographic, or harmful
              purposes; introduce malware; or engage in activity that creates a security, legal, reputational, or platform-policy risk. You
              will not participate in artificial streaming, bots, click-farms, or other fraud. We may suspend payouts and/or remove
              Content that we reasonably believe is fraudulent or non-compliant.
            </p>
          </SectionCard>

          <SectionCard title="6. Pricing &amp; plans">
            <p>
              We currently offer two plans. The selection you make in the dashboard or checkout experience (the Plan Terms) governs
              plan-specific details.
            </p>
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Tier 1 – Flat fee distribution</h3>
              <ul className="list-disc pl-5 space-y-3 text-gray-300">
                <li>Price: $39 per year (per artist profile or account).</li>
                <li>Distribution fee: 0% on Streaming Receipts and downloads reported through DSPs.</li>
                <li>Add-ons: Optional services (for example, UGC/YouTube monetization) may carry additional splits or fees.</li>
                <li>
                  Included features: delivery to supported DSPs (no territory exclusions), routine quality control, catalog and metadata
                  tools, artist/client portal access, periodic statements, standard royalty accounting, and basic collaborator split support.
                </li>
              </ul>
            </div>
            <p>
              If you enable the UGC/YouTube monetization add-on for a release, royalties reported by YouTube or UGC platforms are
              allocated 70% to you, 10% to True North (administration fee), and 20% to our infrastructure partner. The split applies
              only to UGC receipts for the enabled release and is deducted before payout. You can enable or disable the add-on per
              release; DSP processing timelines apply.
            </p>
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Tier 2 – Revenue share</h3>
              <ul className="list-disc pl-5 space-y-3 text-gray-300">
                <li>Distribution fee: 15% of Streaming Receipts (streaming only).</li>
                <li>Downloads and other non-streaming receipts: 0% distribution fee.</li>
                <li>Minimum: $60 per account per 12-month contract year, applied against earnings (shortfalls may be invoiced).</li>
                <li>Payout frequency: Monthly statements on or about the 25th; payouts triggered within 24–48 hours after statements (subject to receipt of funds).</li>
                <li>Minimum withdrawal: $25.</li>
                <li>UGC/YouTube add-on: Same 70/10/20 split described above, applied to the enabled release(s).</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold">6B. Fees &amp; refunds</h3>
              <p>
                All fees—including subscriptions, minimums, and add-ons—are non-refundable once any release has been delivered to a
                DSP, unless required otherwise by law.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="7. Statements, payouts &amp; taxes">
            <ul className="list-disc pl-5 space-y-3 text-gray-300">
              <li>
                <span className="text-white font-semibold">Statements &amp; timing.</span> We provide monthly statements on the 25th of each month and trigger payouts within
                24–48 hours after statements are generated, subject to our actual receipt of DSP funds (industry reporting lags are typically 60–90 days).
              </li>
              <li>
                <span className="text-white font-semibold">Payout method.</span> Payouts are executed through Stripe Connect (Express). You must complete Stripe onboarding
                and know-your-customer requirements.
              </li>
              <li>
                <span className="text-white font-semibold">Thresholds &amp; fees.</span> Minimum withdrawal threshold is $25. You are responsible for third-party transfer, payout,
                and currency conversion fees deducted by payment providers or intermediaries.
              </li>
              <li>
                <span className="text-white font-semibold">Compliance holds.</span> We may withhold or delay payments (and request additional KYC documentation) if we suspect
                fraud, infringement, account compromise, sanctions issues, or inaccurate tax information.
              </li>
              <li>
                <span className="text-white font-semibold">Tax forms.</span> Provide valid W-9/W-8 (or local equivalent) forms. We may withhold amounts as required by law. You are solely responsible for your taxes.
              </li>
              <li>
                <span className="text-white font-semibold">Recoupment &amp; offset.</span> We may offset overpayments, chargebacks, clawbacks, or DSP adjustments against current or
                future sums owed to you.
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="8. Delivery standards &amp; technical processing">
            <p>
              You must follow our published delivery specifications (including audio formats, metadata accuracy, ISRC/UPC/EAN codes,
              territories, release dates, marketing rights, lyrics, and clean or explicit flags). We may edit or re-format metadata and
              transcode audio to meet DSP requirements. We may refuse or request takedown of Content that fails quality control or
              platform policies.
            </p>
          </SectionCard>

          <SectionCard title="9. Platform rules &amp; takedowns">
            <p>
              DSPs maintain their own policies and may refuse, remove, geo-block, or reclassify Content at any time. True North is not
              responsible for third-party decisions or timing. If we receive a copyright complaint (DMCA or equivalent), we may remove
              or disable access to the Content and notify you. If you submit a valid counter-notice, we will process it consistent with
              applicable law. Repeated or egregious violations may result in account termination.
            </p>
          </SectionCard>

          <SectionCard title="10. Marketing, name/likeness &amp; promotion">
            <p>
              You grant us a non-exclusive, royalty-free license to use your approved names, trademarks, logos, and likenesses to
              identify you and to promote the availability of your Content through the Services and DSPs. We will not falsely imply your
              endorsement of third-party products without your consent.
            </p>
          </SectionCard>

          <SectionCard title="11. Third-party services">
            <p>
              We rely on trusted third-party providers to operate portions of the Services. Without limitation, we currently use: (a)
              a white-label distribution infrastructure partner for catalog management, deliveries to DSPs, client and artist portal access,
              and royalty and statement administration; and (b) Stripe Connect (Express) for onboarding, identity verification, and payouts.
            </p>
            <p>
              Your agreement for the Services is with True North. Using third-party providers does not create a customer relationship
              between you and those providers, though their terms and privacy practices may apply to the components they power. We
              may change providers at any time without materially reducing the Services.
            </p>
          </SectionCard>

          <SectionCard title="12. Term, termination &amp; keeping releases live">
            <p>
              These Terms begin when you create an account or first use the Services and continue until terminated. You may remove
              specific releases or close your account by giving 30 days’ notice through the dashboard or support channels, after which
              we will request takedowns from DSPs. Timing of removals depends on DSP processing.
            </p>
            <p>
              We may suspend or terminate the Services or your account for breach, legal or compliance reasons, platform policies,
              business changes, inactivity, or for any reason with reasonable notice when practicable.
            </p>
            <p>
              <span className="text-white font-semibold">Post-cancellation policy (Tier 1).</span> If you cancel Tier 1 ($39/year), releases remain live on DSPs; however, your account
              enters maintenance mode: we retain 15% of Streaming Receipts (downloads remain at 0%), UGC/YouTube monetization and
              other optional features are disabled, and support is limited to critical compliance matters. You may resubscribe to restore
              Tier 1 benefits at any time.
            </p>
            <p>
              Upon termination or takedown, we will account for and pay Net Receipts actually received up to the effective date.
              Sections that by nature should survive (for example, payments due, warranties, indemnities, limitations of liability, and
              dispute resolution provisions) remain in effect.
            </p>
          </SectionCard>

          <SectionCard title="13. Warranties &amp; compliance">
            <p>
              <span className="text-white font-semibold">By you.</span> You warrant that: (i) all metadata you provide is accurate and not misleading; (ii) no Content contains
              undisclosed samples; (iii) you have paid and will pay all contributors and rightsholders; and (iv) your activities comply with
              sanctions, export, and anti-bribery laws.
            </p>
            <p>
              <span className="text-white font-semibold">By us.</span> The Services are provided “as is” and “as available.” We disclaim all warranties not expressly stated in these
              Terms, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We do
              not warrant uninterrupted or error-free operation or specific results on any DSP.
            </p>
          </SectionCard>

          <SectionCard title="14. Indemnity">
            <p>
              You will defend, indemnify, and hold harmless True North, its affiliates, and their directors, officers, employees, and
              agents from any third-party claims, damages, costs, and expenses (including reasonable attorneys’ fees) arising out of: (a)
              the Content; (b) any breach of these Terms or your warranties; (c) failure to secure or maintain required licenses or to pay
              contributors; (d) fraud or prohibited conduct; or (e) your use of the Services.
            </p>
          </SectionCard>

          <SectionCard title="15. Limitation of liability">
            <p>
              To the fullest extent permitted by law: (a) neither party is liable for indirect, special, incidental, consequential,
              exemplary, or punitive damages; and (b) each party’s total liability for all claims in the aggregate is capped at the greater
              of (i) the amounts paid or payable by you to True North in the 12 months preceding the claim or (ii) USD $100. Nothing in
              these Terms limits liability for fraud, willful misconduct, or amounts that cannot be limited by law.
            </p>
          </SectionCard>

          <SectionCard title="16. Dispute resolution &amp; class-action waiver">
            <p>
              <span className="text-white font-semibold">Governing law &amp; venue.</span> These Terms are governed by the laws of the State of Florida, without regard to its conflicts
              of law principles. The exclusive venue for any action not subject to arbitration is the state or federal courts located in
              Palm Beach County, Florida, and each party consents to personal jurisdiction there.
            </p>
            <p>
              <span className="text-white font-semibold">Arbitration.</span> Except for claims seeking injunctive relief or matters that qualify for small-claims court, any dispute will be
              resolved by binding individual arbitration administered by JAMS under its applicable rules. Class actions are waived.
              Judgment on the arbitration award may be entered in any court of competent jurisdiction. You may opt out of arbitration by
              providing written notice within 30 days of account creation. Details are available upon request.
            </p>
          </SectionCard>

          <SectionCard title="17. Changes to the Services or these Terms">
            <p>
              We may modify the Services or these Terms prospectively. If we make material changes, we will notify you by email or
              through the dashboard. Continued use after the effective date of the updated Terms constitutes acceptance. If you do not
              agree, you must stop using the Services and request removal of your Content.
            </p>
          </SectionCard>

          <SectionCard title="18. Privacy">
            <p>
              Our Privacy Policy explains how we collect, use, and share information. By using the Services, you consent to our data
              practices as described in that policy.
            </p>
          </SectionCard>

          <SectionCard title="19. Notices">
            <p>
              You may contact us for legal or account notices through the dashboard support channel or via{' '}
              <a href="mailto:legal@truenorthdistro.com" className="text-[#FFB6DA] underline decoration-dotted">
                legal@truenorthdistro.com
              </a>
              . Stripe Connect (Express) is our payment processing and payout provider.
            </p>
          </SectionCard>

          <SectionCard title="20. Miscellaneous">
            <ul className="list-disc pl-5 space-y-3 text-gray-300">
              <li>
                <span className="text-white font-semibold">Independent parties.</span> Nothing in these Terms creates a partnership, employment, or fiduciary relationship.
              </li>
              <li>
                <span className="text-white font-semibold">Assignment.</span> You may not assign these Terms without our prior written consent; we may assign them to an affiliate
                or in connection with a merger, sale, or reorganization.
              </li>
              <li>
                <span className="text-white font-semibold">Entire agreement.</span> These Terms and any applicable Plan Terms constitute the entire agreement and supersede prior
                understandings related to the Services.
              </li>
              <li>
                <span className="text-white font-semibold">Severability &amp; waiver.</span> If a provision is unenforceable, it will be modified to achieve the parties’ intent, and the
                remainder remains in effect. Our failure to enforce a provision is not a waiver.
              </li>
              <li>
                <span className="text-white font-semibold">Force majeure.</span> Neither party is liable for delays or failures caused by events beyond reasonable control (for example,
                platform outages, network failures, strikes, government action, war, terrorism, or natural disasters).
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="21. Plan schedule">
            <div className="grid gap-6 md:grid-cols-2 text-gray-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-white font-semibold mb-4">Tier 1 – Flat fee distribution</h3>
                <ul className="list-disc pl-5 space-y-3">
                  <li>Price: $39 per year (per artist profile or account).</li>
                  <li>Distribution fee: 0% of Streaming Receipts and downloads.</li>
                  <li>UGC/YouTube add-on: Receipts split 70% Artist / 10% True North / 20% infrastructure partner for enabled releases.</li>
                  <li>
                    Included benefits: delivery to supported DSPs, quality control, catalog and metadata tools, artist/client portal,
                    periodic statements, standard royalty accounting, and collaborator split support.
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-white font-semibold mb-4">Tier 2 – Revenue share</h3>
                <ul className="list-disc pl-5 space-y-3">
                  <li>Distribution fee: 15% of Streaming Receipts (streaming only).</li>
                  <li>Downloads &amp; other non-streaming receipts: 0% distribution fee.</li>
                  <li>Minimum: $60 per account per 12-month contract year (applied against earnings; shortfalls may be billed).</li>
                  <li>Payout frequency: Monthly statements on or about the 25th with payouts triggered within 24–48 hours (subject to funds received).</li>
                  <li>Minimum withdrawal: $25.</li>
                  <li>UGC/YouTube add-on: Receipts split 70% Artist / 10% True North / 20% infrastructure partner for enabled releases.</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-[#FF1493]/30 bg-[#FF1493]/5 p-6">
              <h3 className="text-white font-semibold mb-3">Post-cancellation (Tier 1)</h3>
              <p>
                Releases remain live, but the account shifts to maintenance mode: 15% of Streaming Receipts (downloads remain at 0%),
                add-ons are disabled, and support is limited to critical compliance matters. Resubscribe to restore Tier 1 benefits.
              </p>
            </div>
            <p className="mt-6 font-semibold text-[#FFB6DA]">
              By clicking “I Agree” or using the Services, you acknowledge that you have read, understood, and agree to these Terms &amp;
              Conditions.
            </p>
          </SectionCard>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#FF1493]/15 bg-[#040004]/95">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#FF1493]/40 text-[#FF69B4] flex items-center justify-center">↑</div>
            <div>
              <p className="font-semibold text-white">True North</p>
              <p className="text-xs text-gray-500">Distribution built by the ArtistHub team.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/">Home</Link>
            <a href="/#pricing" className="hover:text-white">Pricing</a>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/legal/terms" className="hover:text-white">
              Terms
            </Link>
            <a href="mailto:privacy@truenorth.com" className="hover:text-white">
              Privacy
            </a>
            <a href="mailto:dmca@truenorth.com" className="hover:text-white">
              DMCA
            </a>
          </div>
          <p className="text-xs text-gray-500">© 2025 True North Music. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

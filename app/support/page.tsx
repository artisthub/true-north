'use client';

import { useState } from 'react';
import Link from 'next/link';

type FormCategory = 'all' | 'audio' | 'video';

interface ServiceIcon {
  name: string;
  logo: string;
}

interface SupportForm {
  id: number;
  name: string;
  services: ServiceIcon[];
  purpose: string;
  whenNeeded: string;
  link: string;
  category: 'audio' | 'video';
}

const FORMS: SupportForm[] = [
  {
    id: 1,
    name: 'YouTube Manual Claim Request',
    services: [{ name: 'YouTube', logo: '/youtube.svg' }],
    purpose: 'Manually claim a YouTube video if Content ID did not automatically detect your music.',
    whenNeeded:
      "When a match is not automatically detected by YouTube's CID system, but rights owners have grounds to claim monetization or ownership.",
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSeCuYYMQJNFL4KPaUiXp62l9LSE1-XSQC_dkOCFsOqRKNJENw/viewform?usp=publish-editor',
    category: 'video',
  },
  {
    id: 2,
    name: 'YouTube Official Artist Channel (OAC) Request',
    services: [{ name: 'YouTube', logo: '/youtube.svg' }],
    purpose:
      'Upgrade your YouTube channel to an Official Artist Channel (OAC) to unify your content, improve discoverability, and access advanced analytics.',
    whenNeeded:
      "When you want to consolidate an artist's YouTube presence and unlock features like unified branding, enhanced analytics, and full control over your channel.",
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSc1TJ9wxMPkPOao6G79TyDXaSuJJGI007MsiKd_k7gX2Cjkmw/viewform?usp=header',
    category: 'video',
  },
  {
    id: 3,
    name: 'YouTube Topic Channel Requests',
    services: [{ name: 'YouTube', logo: '/youtube.svg' }],
    purpose:
      'Request corrections for your YouTube Topic Channel, including artist name errors, incorrect mapping, or metadata issues.',
    whenNeeded:
      'When your music appears under the wrong Topic Channel, displays incorrect metadata, or is improperly merged with another artist.',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSfXJuv4VcSza5wUi9tVfnQvWyzB0mv2VLHpe7WYmaFi1TFS8w/viewform?usp=publish-editor',
    category: 'video',
  },
  {
    id: 4,
    name: 'Channel Safelisting & Video Claim Release',
    services: [
      { name: 'YouTube', logo: '/youtube.svg' },
      { name: 'Meta', logo: '/meta.svg' },
      { name: 'TikTok', logo: '/tiktok.svg' },
    ],
    purpose:
      "Safelist a channel so DSPs (YouTube, Meta, TikTok, WhatsApp) don't flag it, or request the release of an incorrect claim.",
    whenNeeded:
      'When you need to whitelist trusted channels to avoid claims or release a mistaken claim on your content.',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSe1ON5feg0cR3tAHV_HzORfuNec-RPirbEUYj8gSF29TPYkDQ/viewform?usp=publish-editor',
    category: 'video',
  },
  {
    id: 5,
    name: 'META Request Form',
    services: [{ name: 'Meta', logo: '/meta.svg' }],
    purpose:
      'Link your releases to Instagram or request manual claims for videos on Facebook and Instagram.',
    whenNeeded:
      'When you want to connect your releases to Instagram profiles or claim ownership of videos on Facebook and Instagram.',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSf-D3DxL8u76PKW-hY3xOiktKicqq20T1qzw65a7qI5M9d-uA/viewform?usp=publish-editor',
    category: 'video',
  },
  {
    id: 6,
    name: 'Database Submissions',
    services: [{ name: 'Database', logo: '/database.svg' }],
    purpose:
      'Submit or manage your music catalog entries in our database for accurate metadata and rights tracking.',
    whenNeeded:
      'When you need to add, update, or correct catalog data, artist information, or rights ownership in the distribution database.',
    link: 'https://docs.google.com/spreadsheets/d/1h5mizZaK7f7Hu37xcEa32rCZYNKT4x6SfnlDD2myoH8/edit?usp=sharing',
    category: 'audio',
  },
  {
    id: 7,
    name: 'VEVO Form',
    services: [{ name: 'VEVO', logo: '/vevo.svg' }],
    purpose:
      'Request a VEVO channel or submit a music video for increased visibility and official VEVO branding.',
    whenNeeded:
      "When you want your music video distributed on VEVO's official network for enhanced reach and branding.",
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSdfOcXaajwCXEtxH4LLEHh-Kg_V0pGwTODuWoGIHuZU-dO_mA/viewform?usp=publish-editor',
    category: 'video',
  },
  {
    id: 8,
    name: 'Apple Motion Artwork',
    services: [{ name: 'Apple', logo: '/apple-music.svg' }],
    purpose:
      'Submit animated cover art to enhance how your release appears on Apple Music with dynamic motion graphics.',
    whenNeeded:
      'When you want your release to stand out on Apple Music with eye-catching animated artwork.',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSeUy0Oy41nPsjLGS3hPHfANRCDDzu4YQLycQqv5jW39i_Vdzw/viewform?usp=publish-editor',
    category: 'audio',
  },
];

function ServiceBadge({ service }: { service: ServiceIcon }) {
  return (
    <img
      src={service.logo}
      alt={service.name}
      title={service.name}
      width={28}
      height={28}
      style={{
        display: 'block',
        flexShrink: 0,
        borderRadius: '50%',
        outline: '2px solid #0a0a0a',
        outlineOffset: '0px',
      }}
    />
  );
}

export default function SupportFormsPage() {
  const [activeTab, setActiveTab] = useState<FormCategory>('all');

  const visibleForms =
    activeTab === 'all' ? FORMS : FORMS.filter((f) => f.category === activeTab);

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
                    <img
                      src="/logo.svg"
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
                <a href="/#pricing">Pricing</a>
                <a className="btn-primary" href="/get-started">
                  Get Started
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section style={{ padding: '60px 0 80px' }}>
            <div className="container">
              <div className="fade-in" style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: 'clamp(24px, 4vw, 36px)',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  Support Forms
                </h2>
              </div>

              <div
                className="fade-in"
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  marginBottom: '36px',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1.5px solid rgba(59, 130, 246, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1px',
                  }}
                >
                  <span style={{ color: '#60A5FA', fontSize: '13px', fontWeight: 700, lineHeight: 1 }}>
                    i
                  </span>
                </div>
                <p style={{ color: '#93C5FD', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  Forms to help manage content and rights for your music across various platforms.{' '}
                </p>
              </div>

              <div
                className="fade-in"
                style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '28px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '4px',
                  width: 'fit-content',
                }}
              >
                {(['all', 'audio', 'video'] as FormCategory[]).map((tab) => {
                  const labels: Record<FormCategory, string> = {
                    all: 'All Forms',
                    audio: 'Audio',
                    video: 'Video',
                  };
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 400,
                        transition: 'all 0.2s ease',
                        background: isActive
                          ? 'linear-gradient(135deg, #FF1493, #FF69B4)'
                          : 'transparent',
                        color: isActive ? '#ffffff' : '#888',
                        boxShadow: isActive ? '0 2px 12px rgba(255,20,147,0.35)' : 'none',
                      }}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>

              <div
                className="fade-in"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      minWidth: '640px',
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.03)',
                        }}
                      >
                        {['Form Type', 'Purpose', 'When It\'s Needed', 'Form Link'].map((h, i) => (
                          <th
                            key={h}
                            style={{
                              padding: '14px 20px',
                              textAlign: 'left',
                              fontSize: '12px',
                              fontWeight: 600,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: i === 3 ? '#FF69B4' : '#666',
                              whiteSpace: 'nowrap',
                              width: i === 0 ? '22%' : i === 3 ? '100px' : 'auto',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleForms.map((form, idx) => (
                        <tr
                          key={form.id}
                          style={{
                            borderBottom:
                              idx < visibleForms.length - 1
                                ? '1px solid rgba(255,255,255,0.05)'
                                : 'none',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background =
                              'rgba(255,20,147,0.04)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                          }}
                        >
                          <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', paddingLeft: '6px' }}>
                                {form.services.map((s, i) => (
                                  <div
                                    key={s.name}
                                    style={{
                                      marginLeft: i === 0 ? '0' : '-8px',
                                      zIndex: form.services.length - i,
                                      position: 'relative',
                                    }}
                                  >
                                    <ServiceBadge service={s} />
                                  </div>
                                ))}
                              </div>
                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  color: '#ffffff',
                                  lineHeight: '1.4',
                                }}
                              >
                                {form.name}
                              </span>
                            </div>
                          </td>

                          <td
                            style={{
                              padding: '16px 20px',
                              verticalAlign: 'middle',
                              color: '#aaa',
                              fontSize: '13px',
                              lineHeight: '1.5',
                            }}
                          >
                            {form.purpose}
                          </td>

                          <td
                            style={{
                              padding: '16px 20px',
                              verticalAlign: 'middle',
                              color: '#aaa',
                              fontSize: '13px',
                              lineHeight: '1.5',
                            }}
                          >
                            {form.whenNeeded}
                          </td>

                          <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                            <a
                              href={form.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '7px 14px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, rgba(255,20,147,0.15), rgba(255,105,180,0.15))',
                                border: '1px solid rgba(255,20,147,0.3)',
                                color: '#FF69B4',
                                fontSize: '13px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = 'linear-gradient(135deg, rgba(255,20,147,0.25), rgba(255,105,180,0.25))';
                                el.style.borderColor = 'rgba(255,20,147,0.6)';
                                el.style.color = '#fff';
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = 'linear-gradient(135deg, rgba(255,20,147,0.15), rgba(255,105,180,0.15))';
                                el.style.borderColor = 'rgba(255,20,147,0.3)';
                                el.style.color = '#FF69B4';
                              }}
                            >
                              Open
                              <svg
                                width="12"
                                height="12"
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {visibleForms.length === 0 && (
                  <div
                    style={{
                      padding: '48px 20px',
                      textAlign: 'center',
                      color: '#555',
                      fontSize: '14px',
                    }}
                  >
                    No forms in this category.
                  </div>
                )}
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
                <a href="/get-started">Get Started</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="/support">Support Forms</a>
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

      <style>{`
        @media (max-width: 768px) {
          .support-tabs button {
            padding: 8px 14px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </>
  );
}

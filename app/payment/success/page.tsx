'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type SetupStatus = 'loading' | 'pending' | 'ready' | 'redirecting' | 'error';

const REVELATOR_FALLBACK_URL = process.env.NEXT_PUBLIC_REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com';
const VEVO_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdfOcXaajwCXEtxH4LLEHh-Kg_V0pGwTODuWoGIHuZU-dO_mA/viewform?usp=publish-editor';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<SetupStatus>('loading');
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);
  const MAX_ATTEMPTS = 20;
  const POLL_INTERVAL = 3000;

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const poll = async () => {
      attemptsRef.current += 1;

      if (attemptsRef.current > MAX_ATTEMPTS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus('redirecting');
        setRedirectUrl(REVELATOR_FALLBACK_URL);
        window.location.href = REVELATOR_FALLBACK_URL;
        return;
      }

      try {
        const res = await fetch(`/api/revelator/session-status?session_id=${sessionId}`);
        const data = await res.json();

        if (data.status === 'ready' && data.redirectUrl) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRedirectUrl(data.redirectUrl);
          setStatus('redirecting');
          window.location.href = data.redirectUrl;
        } else {
          setStatus('pending');
        }
      } catch {
        setStatus('pending');
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId]);

  return (
    <div className="success-container">
      <div className="success-card">
        {(status === 'loading' || status === 'pending' || status === 'redirecting') && (
          <>
            <div className="check-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            <h1>Payment Confirmed!</h1>
            <p className="subtitle">
              Welcome to True North. Your account is being set up and you&apos;ll receive an email once it&apos;s ready.
            </p>

            <div className="vevo-box">
              <div className="vevo-header">
                <span className="vevo-badge">Action Required</span>
                <h2>Submit Your VEVO Form</h2>
                <p>
                  To complete your onboarding, please fill out the VEVO submission form. This allows us to set up your official VEVO channel and video distribution.
                </p>
              </div>
              <a
                href={VEVO_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="vevo-btn"
              >
                Open VEVO Submission Form
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
              <p className="vevo-note">
                You can also find this and other support forms at{' '}
                <a href="/support" target="_blank" rel="noopener noreferrer">truenorthdistro.com/support</a>.
              </p>
            </div>

            <div className="setup-status">
              <div className="spinner" />
              <p className="hint">
                {status === 'redirecting'
                  ? 'Redirecting you to your dashboard…'
                  : 'Setting up your distribution dashboard…'}
                {status === 'redirecting' && redirectUrl && (
                  <>{' '}<a href={redirectUrl} className="manual-link">Click here if not redirected</a>.</>
                )}
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <h1>Payment Error</h1>
            <p>Something went wrong with your payment. Please try again.</p>
            <div className="actions">
              <Link href="/" className="btn-primary">
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .success-container {
          min-height: 100vh;
          background: #000000;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-card {
          max-width: 560px;
          width: 100%;
          text-align: center;
        }

        .check-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #fff;
          box-shadow: 0 4px 24px rgba(255, 20, 147, 0.4);
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .subtitle {
          color: #888;
          font-size: 1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vevo-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 20, 147, 0.25);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 2rem;
          text-align: left;
        }

        .vevo-header {
          margin-bottom: 20px;
        }

        .vevo-badge {
          display: inline-block;
          padding: 3px 10px;
          background: rgba(255, 20, 147, 0.15);
          border: 1px solid rgba(255, 20, 147, 0.4);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #FF69B4;
          margin-bottom: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vevo-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 10px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vevo-header p {
          font-size: 14px;
          color: #999;
          line-height: 1.6;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vevo-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          color: #ffffff;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(255, 20, 147, 0.3);
          transition: all 0.2s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vevo-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(255, 20, 147, 0.5);
        }

        .vevo-note {
          margin: 14px 0 0 0;
          font-size: 12px;
          color: #555;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vevo-note a {
          color: #FF69B4;
          text-decoration: none;
        }

        .setup-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          border: 2px solid rgba(255, 20, 147, 0.2);
          border-top-color: #FF1493;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hint {
          color: #666;
          font-size: 13px;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .manual-link {
          color: #FF69B4;
          text-decoration: underline;
        }

        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        p {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        :global(.btn-primary) {
          padding: 0.75rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s ease;
          display: inline-block;
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          color: white;
        }

        :global(.btn-primary:hover) {
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .vevo-box {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

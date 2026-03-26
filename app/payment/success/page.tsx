'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type SetupStatus = 'loading' | 'pending' | 'ready' | 'redirecting' | 'error';

const REVELATOR_FALLBACK_URL = process.env.NEXT_PUBLIC_REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com';

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
        {(status === 'loading' || status === 'pending') && (
          <>
            <div className="spinner-container">
              <div className="spinner" />
            </div>
            <h1>Setting Up Your Account</h1>
            <p className="subtitle">
              Payment confirmed! We&apos;re creating your distribution dashboard now...
            </p>
            <div className="progress-bar-container">
              <div className="progress-bar" />
            </div>
            <p className="hint">
              You&apos;ll be redirected automatically. Please don&apos;t close this page.
            </p>
          </>
        )}

        {status === 'redirecting' && redirectUrl && (
          <>
            <div className="spinner-container">
              <div className="spinner" />
            </div>
            <h1>Redirecting...</h1>
            <p className="subtitle">
              Taking you to your distribution dashboard.
            </p>
            <p className="hint">
              If you&apos;re not redirected,{' '}
              <a href={redirectUrl} className="manual-link">
                click here
              </a>.
            </p>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-card {
          max-width: 500px;
          width: 100%;
          background: white;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .spinner-container {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
        }

        .spinner {
          width: 64px;
          height: 64px;
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .progress-bar-container {
          width: 100%;
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          margin: 1.5rem 0;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          animation: indeterminate 1.5s ease-in-out infinite;
        }

        @keyframes indeterminate {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #666;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        p {
          color: #666;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .hint {
          color: #999;
          font-size: 0.875rem;
        }

        .manual-link {
          color: #667eea;
          text-decoration: underline;
        }

        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        :global(.btn-primary) {
          padding: 0.75rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s ease;
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        :global(.btn-primary:hover) {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .success-card {
            padding: 2rem;
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

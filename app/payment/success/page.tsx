'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // In a production app, you'd verify the session with your backend
      // For now, we'll just show success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="success-container">
      <div className="success-card">
        {loading ? (
          <div className="loading">Processing payment...</div>
        ) : success ? (
          <>
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1>Payment Successful!</h1>
            <p>Welcome to True North! Your account has been created successfully.</p>
            
            <div className="next-steps">
              <h2>Next Steps</h2>
              <ul>
                <li>Check your email for login instructions</li>
                <li>Complete your profile setup</li>
                <li>Start submitting your pitches</li>
              </ul>
            </div>

            <div className="actions">
              <Link href="/login" className="btn-primary">
                Go to Login
              </Link>
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Payment Error</h1>
            <p>Something went wrong with your payment. Please try again.</p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
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

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
          color: #4CAF50;
        }

        .success-icon svg {
          width: 100%;
          height: 100%;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .next-steps {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .next-steps h2 {
          color: #333;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .next-steps li {
          padding: 0.5rem 0;
          color: #555;
        }

        .next-steps li:before {
          content: "→ ";
          color: #667eea;
          font-weight: bold;
          margin-right: 0.5rem;
        }

        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .loading {
          padding: 3rem;
          color: #666;
          font-size: 1.2rem;
        }

        :global(.btn-primary),
        :global(.btn-secondary) {
          padding: 0.75rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s ease;
          display: inline-block;
        }

        :global(.btn-primary) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        :global(.btn-secondary) {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        :global(.btn-primary:hover),
        :global(.btn-secondary:hover) {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .actions {
            flex-direction: column;
          }

          .success-card {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
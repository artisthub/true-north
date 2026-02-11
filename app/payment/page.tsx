'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface ApplicationData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  account_type: 'artist' | 'label';
  artist_name?: string;
  label_name?: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setError('Invalid payment link');
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateToken = async () => {
    try {
      const response = await fetch('/api/payment/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Invalid or expired payment link');
      }

      const data = await response.json();
      setApplication(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!stripePromise || !application) {
      setError('Payment system not configured');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          applicationId: application.id,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="loading">Validating payment link...</div>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h1>Complete Your Registration</h1>
          <p>Welcome to True North! Your application has been approved.</p>
        </div>

        {application && (
          <div className="application-info">
            <h3>Application Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Name:</strong> {application.first_name} {application.last_name}
              </div>
              <div className="info-item">
                <strong>Email:</strong> {application.email}
              </div>
              <div className="info-item">
                <strong>Account Type:</strong> {application.account_type}
              </div>
              <div className="info-item">
                <strong>{application.account_type === 'artist' ? 'Artist Name' : 'Label Name'}:</strong>
                {application.account_type === 'artist' ? application.artist_name : application.label_name}
              </div>
            </div>
          </div>
        )}

        <div className="pricing-section">
          <h3>Annual Membership</h3>
          <div className="price">
            <span className="amount">$59</span>
            <span className="period">/year</span>
          </div>
          <ul className="benefits">
            <li>Unlimited pitch submissions</li>
            <li>Direct DSP playlist pitching</li>
            <li>Analytics and reporting</li>
            <li>Priority support</li>
            <li>Marketing resources</li>
          </ul>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <h3>Set Your Password</h3>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <button 
            type="submit" 
            className="payment-button"
            disabled={processing || !stripePromise}
          >
            {processing ? 'Processing...' : 'Proceed to Payment'}
          </button>

          <p className="security-note">
            🔒 Secure payment processed by Stripe. Your payment information is never stored on our servers.
          </p>
        </form>
      </div>

      <style jsx>{`
        .payment-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .payment-card {
          max-width: 600px;
          width: 100%;
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .payment-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .payment-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .payment-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .application-info {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .application-info h3 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .info-item {
          color: #555;
        }

        .info-item strong {
          color: #333;
          margin-right: 0.5rem;
        }

        .pricing-section {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-radius: 12px;
        }

        .pricing-section h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .price {
          margin-bottom: 1.5rem;
        }

        .amount {
          font-size: 3rem;
          font-weight: 700;
          color: #667eea;
        }

        .period {
          font-size: 1.2rem;
          color: #666;
        }

        .benefits {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits li {
          padding: 0.5rem 0;
          color: #555;
        }

        .benefits li:before {
          content: "✓ ";
          color: #667eea;
          font-weight: bold;
          margin-right: 0.5rem;
        }

        .payment-form {
          margin-top: 2rem;
        }

        .payment-form h3 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #555;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border: 1px solid #f5c6cb;
        }

        .payment-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .payment-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .payment-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .security-note {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .loading, .error {
          text-align: center;
          padding: 3rem;
        }

        .error h2 {
          color: #721c24;
          margin-bottom: 1rem;
        }

        .error p {
          color: #666;
        }

        @media (max-width: 768px) {
          .payment-card {
            padding: 2rem;
          }

          .amount {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
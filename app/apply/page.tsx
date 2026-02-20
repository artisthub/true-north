'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplyPage() {
  const [accountType, setAccountType] = useState<'artist' | 'label' | ''>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    firstName: '',
    lastName: '',
    
    // Artist fields
    artistName: '',
    artistCountry: '',
    artistGenre: '',
    
    // Label fields
    labelName: '',
    labelCountry: '',
    labelWebsite: '',
    
    // Common fields
    currentDistributor: '',
    whyTrueNorth: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, accountType })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Application submitted successfully! We will review your application and get back to you within 48 hours.'
      });
      
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const genres = [
    'Pop', 'Hip-Hop/Rap', 'R&B', 'Rock', 'Electronic', 'Latin',
    'Country', 'Jazz', 'Classical', 'Indie', 'Alternative', 'Other'
  ];

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
              <Link href="/" className="logo">
                <div className="logo-icon">
                  <img src="/logo.svg" alt="True North Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
              </Link>
              <nav>
                <Link href="/">Home</Link>
                <Link href="/login">Sign In</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="apply-container">
          <div className="container">
            {showSuccess ? (
              <div className="success-screen" style={{ 
                maxWidth: '600px', 
                margin: '100px auto',
                textAlign: 'center',
                padding: '60px 40px',
                background: 'rgba(255, 20, 147, 0.05)',
                border: '1px solid rgba(255, 20, 147, 0.2)',
                borderRadius: '30px'
              }}>
                <div className="success-icon" style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 30px',
                  background: 'linear-gradient(135deg, #FF1493, #FF69B4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#fff' }}>Application Submitted!</h1>
                <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '40px', lineHeight: '1.6' }}>
                  Thank you for applying to True North. We'll review your application and contact you within 24-48 hours.
                </p>
                <Link href="/" className="btn-primary">Back to Home</Link>
              </div>
            ) : !accountType ? (
              <div className="account-type-selector" style={{ 
                maxWidth: '800px', 
                margin: '100px auto',
                textAlign: 'center'
              }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: '700' }}>
                  Join True North
                </h1>
                <p style={{ fontSize: '20px', color: '#ccc', marginBottom: '60px' }}>
                  Choose your account type to get started
                </p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '30px',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  <button
                    onClick={() => setAccountType('artist')}
                    className="account-type-card"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 20, 147, 0.2)',
                      borderRadius: '24px',
                      padding: '40px 30px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#FF1493';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 20, 147, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ 
                      width: '60px', 
                      height: '60px',
                      margin: '0 auto 20px',
                      background: 'rgba(255, 20, 147, 0.1)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>I'm an Artist</h3>
                    <p style={{ fontSize: '14px', color: '#999' }}>Solo artist or band</p>
                  </button>

                  <button
                    onClick={() => setAccountType('label')}
                    className="account-type-card"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 20, 147, 0.2)',
                      borderRadius: '24px',
                      padding: '40px 30px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#FF1493';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 20, 147, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ 
                      width: '60px', 
                      height: '60px',
                      margin: '0 auto 20px',
                      background: 'rgba(255, 20, 147, 0.1)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/>
                        <path d="M9 7h1m-1 4h1m4-4h1m-1 4h1"/>
                        <path d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2"/>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>I'm a Label</h3>
                    <p style={{ fontSize: '14px', color: '#999' }}>Manage multiple artists</p>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ 
                maxWidth: '600px', 
                margin: '80px auto',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 20, 147, 0.2)',
                borderRadius: '30px',
                padding: '50px 40px'
              }}>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '40px',
                  paddingBottom: '30px',
                  borderBottom: '1px solid rgba(255, 20, 147, 0.1)'
                }}>
                  <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>
                    {accountType === 'artist' ? 'Artist Application' : 'Label Application'}
                  </h2>
                  <p style={{ color: '#999' }}>
                    {accountType === 'artist' 
                      ? 'Join our exclusive artist roster' 
                      : 'Partner with us to distribute your artists'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setAccountType('')}
                    style={{
                      marginTop: '16px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 20, 147, 0.3)',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      color: '#FF69B4',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Change Account Type
                  </button>
                </div>

                {/* Basic Information */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#FF69B4' }}>Contact Information</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="firstName">First Name *</label>
                      <input
                        className="form-input"
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="lastName">Last Name *</label>
                      <input
                        className="form-input"
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address *</label>
                    <input
                      className="form-input"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Account-specific fields */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#FF69B4' }}>
                    {accountType === 'artist' ? 'Artist Details' : 'Label Details'}
                  </h3>
                  
                  {accountType === 'artist' ? (
                    <>
                      <div className="form-group">
                        <label className="form-label" htmlFor="artistName">Artist/Band Name *</label>
                        <input
                          className="form-input"
                          type="text"
                          id="artistName"
                          name="artistName"
                          value={formData.artistName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="artistCountry">Country *</label>
                          <input
                            className="form-input"
                            type="text"
                            id="artistCountry"
                            name="artistCountry"
                            value={formData.artistCountry}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="artistGenre">Primary Genre *</label>
                          <select
                            className="form-select"
                            id="artistGenre"
                            name="artistGenre"
                            value={formData.artistGenre}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select genre</option>
                            {genres.map(genre => (
                              <option key={genre} value={genre}>{genre}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="form-label" htmlFor="labelName">Label Name *</label>
                        <input
                          className="form-input"
                          type="text"
                          id="labelName"
                          name="labelName"
                          value={formData.labelName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="labelCountry">Country *</label>
                        <input
                          className="form-input"
                          type="text"
                          id="labelCountry"
                          name="labelCountry"
                          value={formData.labelCountry}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="labelWebsite">Website (optional)</label>
                        <input
                          className="form-input"
                          type="url"
                          id="labelWebsite"
                          name="labelWebsite"
                          value={formData.labelWebsite}
                          onChange={handleInputChange}
                          placeholder="https://yourlabel.com"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Distribution Experience */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#FF69B4' }}>Distribution Experience</h3>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="currentDistributor">Current Distributor (if any)</label>
                    <input
                      className="form-input"
                      type="text"
                      id="currentDistributor"
                      name="currentDistributor"
                      value={formData.currentDistributor}
                      onChange={handleInputChange}
                      placeholder="e.g., Independent, CD Baby, DistroKid..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="whyTrueNorth">Why do you want to join True North? *</label>
                    <textarea
                      className="form-textarea"
                      id="whyTrueNorth"
                      name="whyTrueNorth"
                      value={formData.whyTrueNorth}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      placeholder="Tell us about your goals and what you're looking for in a distribution partner..."
                    />
                  </div>
                </div>

                {submitStatus.type === 'error' && (
                  <div style={{
                    background: 'rgba(255, 20, 147, 0.1)',
                    border: '1px solid #FF1493',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    color: '#FF69B4'
                  }}>
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>

                <p style={{ 
                  marginTop: '20px', 
                  textAlign: 'center', 
                  color: '#999', 
                  fontSize: '14px' 
                }}>
                  By submitting, you agree to our{' '}
                  <Link href="/terms" style={{ color: '#FF69B4', textDecoration: 'underline' }}>
                    Terms of Service
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import { useState } from 'react';

export default function ApplyPage() {
  const [accountType, setAccountType] = useState<'artist' | 'label' | ''>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Artist fields
    artistName: '',
    artistCountry: '',
    artistSpotifyUrl: '',
    artistInstagramHandle: '',
    artistGenre: '',
    artistSubGenre: '',
    artistYearsActive: '',
    artistReleasesCount: '',
    artistMonthlyListeners: '',
    
    // Label fields
    labelName: '',
    labelCountry: '',
    labelWebsite: '',
    labelRosterSize: '',
    labelGenres: '',
    labelFoundedYear: '',
    
    // Common fields
    catalogSize: '',
    currentDistributor: '',
    distributionGoals: '',
    marketingBudget: '',
    teamSize: '',
    revenueSources: [] as string[],
    whyTrueNorth: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRevenueSourceChange = (source: string) => {
    setFormData(prev => ({
      ...prev,
      revenueSources: prev.revenueSources.includes(source)
        ? prev.revenueSources.filter(s => s !== source)
        : [...prev.revenueSources, source]
    }));
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
      
      // Show success screen
      setShowSuccess(true);
      
      // Scroll to top to show success message
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
        <div className="apply-container">
          <div className="container">
            {showSuccess ? (
              <div className="success-screen">
                <div className="success-content">
                  <div className="success-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                          <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                        </linearGradient>
                      </defs>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h1 className="success-title">Application Submitted!</h1>
                  <p className="success-description">
                    Thank you for applying to True North. We've received your application and will review it carefully.
                  </p>
                  <div className="success-timeline">
                    <div className="timeline-item">
                      <div className="timeline-icon">📧</div>
                      <div className="timeline-content">
                        <strong>Confirmation Email</strong>
                        <span>Check your inbox for details</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon">⏱️</div>
                      <div className="timeline-content">
                        <strong>Review Period</strong>
                        <span>24-48 hours</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon">🎵</div>
                      <div className="timeline-content">
                        <strong>Next Steps</strong>
                        <span>We'll contact you with our decision</span>
                      </div>
                    </div>
                  </div>
                  <div className="success-actions">
                    <a href="/" className="btn-primary">Return to Home</a>
                    <button onClick={() => { setShowSuccess(false); setAccountType(''); setFormData({ email: '', firstName: '', lastName: '', phone: '', artistName: '', artistCountry: '', artistSpotifyUrl: '', artistInstagramHandle: '', artistGenre: '', artistSubGenre: '', artistYearsActive: '', artistReleasesCount: '', artistMonthlyListeners: '', labelName: '', labelCountry: '', labelWebsite: '', labelRosterSize: '', labelGenres: '', labelFoundedYear: '', catalogSize: '', currentDistributor: '', distributionGoals: '', marketingBudget: '', teamSize: '', revenueSources: [], whyTrueNorth: '', additionalInfo: '' }); setSubmitStatus({ type: null, message: '' }); }} className="btn-secondary">
                      Submit Another Application
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="apply-hero">
                  <div className="apply-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    EXCLUSIVE ROSTER
                  </div>
                  <h1 className="apply-title">Join <span className="text-gradient-direction">True North</span></h1>
                  <p className="apply-desc">We carefully select partners who share our vision for quality music distribution</p>
                </div>

                {!accountType ? (
              <div className="account-type-selection">
                <h2>Are you an Artist or a Label?</h2>
                <div className="type-buttons">
                  <button onClick={() => setAccountType('artist')} className="type-button">
                    <div className="type-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient-artist)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id="gradient-artist" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                            <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                          </linearGradient>
                        </defs>
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>I&apos;m an Artist</span>
                    <small>Individual creator or band</small>
                  </button>
                  <button onClick={() => setAccountType('label')} className="type-button">
                    <div className="type-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="url(#gradient-label)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id="gradient-label" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#FF1493', stopOpacity: '1' }} />
                            <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: '1' }} />
                          </linearGradient>
                        </defs>
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span>I&apos;m a Label</span>
                    <small>Record label or music company</small>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="application-form">
                <div className="form-header">
                  <div className="account-type-indicator">
                    <div className={`type-badge ${accountType}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {accountType === 'artist' ? (
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        ) : (
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        )}
                      </svg>
                      <span>{accountType === 'artist' ? 'Artist' : 'Label'} Application</span>
                    </div>
                    <button type="button" onClick={() => setAccountType('')} className="change-type-btn">
                      Change
                    </button>
                  </div>
                  <h2>{accountType === 'artist' ? 'Join as an Artist' : 'Join as a Label'}</h2>
                  <p className="form-subtitle">Complete your application to join True North's exclusive roster</p>
                </div>

                {/* Basic Information */}
                <section className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-grid">
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
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <input
                        className="form-input"
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </section>

                {/* Artist-specific fields */}
                {accountType === 'artist' && (
                  <section className="form-section">
                    <h3>Artist Information</h3>
                    <div className="form-grid">
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
                        <label className="form-label" htmlFor="artistSpotifyUrl">Spotify Artist URL</label>
                        <input
                          className="form-input"
                          type="url"
                          id="artistSpotifyUrl"
                          name="artistSpotifyUrl"
                          value={formData.artistSpotifyUrl}
                          onChange={handleInputChange}
                          placeholder="https://open.spotify.com/artist/..."
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="artistInstagramHandle">Instagram Handle</label>
                        <input
                          className="form-input"
                          type="text"
                          id="artistInstagramHandle"
                          name="artistInstagramHandle"
                          value={formData.artistInstagramHandle}
                          onChange={handleInputChange}
                          placeholder="@yourusername"
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
                          <option value="">Select Genre</option>
                          <option value="Pop">Pop</option>
                          <option value="Rock">Rock</option>
                          <option value="Hip-Hop">Hip-Hop</option>
                          <option value="R&B">R&B</option>
                          <option value="Electronic">Electronic</option>
                          <option value="Country">Country</option>
                          <option value="Jazz">Jazz</option>
                          <option value="Classical">Classical</option>
                          <option value="Latin">Latin</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="artistSubGenre">Sub-Genre</label>
                        <input
                          className="form-input"
                          type="text"
                          id="artistSubGenre"
                          name="artistSubGenre"
                          value={formData.artistSubGenre}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="artistYearsActive">Years Active</label>
                        <input
                          className="form-input"
                          type="number"
                          id="artistYearsActive"
                          name="artistYearsActive"
                          value={formData.artistYearsActive}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="artistReleasesCount">Number of Releases</label>
                        <input
                          className="form-input"
                          type="number"
                          id="artistReleasesCount"
                          name="artistReleasesCount"
                          value={formData.artistReleasesCount}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="artistMonthlyListeners">Monthly Spotify Listeners</label>
                        <input
                          className="form-input"
                          type="number"
                          id="artistMonthlyListeners"
                          name="artistMonthlyListeners"
                          value={formData.artistMonthlyListeners}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Label-specific fields */}
                {accountType === 'label' && (
                  <section className="form-section">
                    <h3>Label Information</h3>
                    <div className="form-grid">
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
                        <label className="form-label" htmlFor="labelWebsite">Website</label>
                        <input
                          className="form-input"
                          type="url"
                          id="labelWebsite"
                          name="labelWebsite"
                          value={formData.labelWebsite}
                          onChange={handleInputChange}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="labelRosterSize">Roster Size</label>
                        <input
                          className="form-input"
                          type="number"
                          id="labelRosterSize"
                          name="labelRosterSize"
                          value={formData.labelRosterSize}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label className="form-label" htmlFor="labelGenres">Genres (comma-separated)</label>
                        <input
                          className="form-input"
                          type="text"
                          id="labelGenres"
                          name="labelGenres"
                          value={formData.labelGenres}
                          onChange={handleInputChange}
                          placeholder="Pop, Rock, Electronic..."
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="labelFoundedYear">Founded Year</label>
                        <input
                          className="form-input"
                          type="number"
                          id="labelFoundedYear"
                          name="labelFoundedYear"
                          value={formData.labelFoundedYear}
                          onChange={handleInputChange}
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Common Business Information */}
                <section className="form-section">
                  <h3>Business Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="catalogSize">Catalog Size</label>
                      <select
                        className="form-select"
                        id="catalogSize"
                        name="catalogSize"
                        value={formData.catalogSize}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="1-10">1-10 releases</option>
                        <option value="11-50">11-50 releases</option>
                        <option value="51-100">51-100 releases</option>
                        <option value="100+">100+ releases</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="currentDistributor">Current Distributor</label>
                      <input
                        className="form-input"
                        type="text"
                        id="currentDistributor"
                        name="currentDistributor"
                        value={formData.currentDistributor}
                        onChange={handleInputChange}
                        placeholder="e.g., DistroKid, CD Baby, None"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="marketingBudget">Annual Marketing Budget</label>
                      <select
                        className="form-select"
                        id="marketingBudget"
                        name="marketingBudget"
                        value={formData.marketingBudget}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="0-1k">$0 - $1,000</option>
                        <option value="1k-5k">$1,000 - $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k+">$25,000+</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="teamSize">Team Size</label>
                      <select
                        className="form-select"
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="solo">Just me</option>
                        <option value="2-5">2-5 people</option>
                        <option value="6-10">6-10 people</option>
                        <option value="10+">10+ people</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Revenue Sources</label>
                      <div className="checkbox-group">
                        {['Streaming', 'Physical Sales', 'Merchandise', 'Live Shows', 'Sync/Licensing', 'Other'].map(source => (
                          <label key={source} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.revenueSources.includes(source)}
                              onChange={() => handleRevenueSourceChange(source)}
                            />
                            <span className="checkbox-custom"></span>
                            <span>{source}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Goals and Expectations */}
                <section className="form-section">
                  <h3>Goals & Expectations</h3>
                  <div className="form-group">
                    <label className="form-label" htmlFor="distributionGoals">What are your distribution goals?</label>
                    <textarea
                      className="form-textarea"
                      id="distributionGoals"
                      name="distributionGoals"
                      value={formData.distributionGoals}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about your goals for music distribution..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="whyTrueNorth">Why True North? *</label>
                    <textarea
                      className="form-textarea"
                      id="whyTrueNorth"
                      name="whyTrueNorth"
                      value={formData.whyTrueNorth}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      placeholder="What makes True North the right partner for you?"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="additionalInfo">Additional Information</label>
                    <textarea
                      className="form-textarea"
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Anything else you'd like us to know?"
                    />
                  </div>
                </section>

                {submitStatus.type && (
                  <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.type === 'success' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    )}
                    <span>{submitStatus.message}</span>
                  </div>
                )}

                <button type="submit" className="btn-primary submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
            </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .apply-container {
          min-height: 100vh;
          padding: 140px 0 80px;
          position: relative;
        }

        .success-screen {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 0;
        }

        .success-content {
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.05) 0%, rgba(0, 0, 0, 0.5) 100%);
          border: 1px solid rgba(255, 20, 147, 0.2);
          border-radius: 30px;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }

        .success-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, transparent 100%);
          opacity: 0.3;
        }

        .success-icon-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto 30px;
          background: rgba(255, 20, 147, 0.1);
          border: 2px solid rgba(255, 20, 147, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          animation: successPulse 2s ease-in-out infinite;
        }

        @keyframes successPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 20, 147, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(255, 20, 147, 0);
          }
        }

        .success-icon-wrapper svg {
          width: 50px;
          height: 50px;
        }

        .success-title {
          font-size: 48px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .success-description {
          font-size: 18px;
          color: #ccc;
          margin-bottom: 40px;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .success-timeline {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 40px 0;
          padding: 30px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          position: relative;
          z-index: 1;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 20px;
          text-align: left;
        }

        .timeline-icon {
          font-size: 24px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 20, 147, 0.1);
          border-radius: 12px;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-content strong {
          display: block;
          color: #fff;
          margin-bottom: 4px;
        }

        .timeline-content span {
          color: #999;
          font-size: 14px;
        }

        .success-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 40px;
          position: relative;
          z-index: 1;
        }

        .success-actions .btn-secondary {
          background: rgba(255, 20, 147, 0.1);
          border: 1px solid rgba(255, 20, 147, 0.3);
          color: #FF69B4;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .success-actions .btn-secondary:hover {
          background: rgba(255, 20, 147, 0.2);
          border-color: #FF1493;
        }

        .apply-hero {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
        }

        .apply-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 20, 147, 0.1);
          border: 1px solid rgba(255, 20, 147, 0.3);
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #FF1493;
          margin-bottom: 30px;
          letter-spacing: 0.5px;
        }

        .apply-title {
          font-size: 64px;
          margin-bottom: 20px;
          font-weight: 700;
          letter-spacing: -2px;
        }

        .apply-desc {
          font-size: 20px;
          color: #999;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .account-type-selection {
          text-align: center;
          padding: 60px 0;
          max-width: 800px;
          margin: 0 auto;
        }

        .account-type-selection h2 {
          margin-bottom: 40px;
          font-size: 36px;
          color: #fff;
        }

        .type-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 650px;
          margin: 0 auto;
        }

        .type-button {
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%);
          border: 1px solid rgba(255, 20, 147, 0.2);
          border-radius: 24px;
          padding: 50px 30px;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
        }

        .type-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .type-button:hover {
          border-color: #FF1493;
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(255, 20, 147, 0.2);
        }

        .type-button:hover::before {
          opacity: 1;
        }

        .type-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 20, 147, 0.1);
          border: 2px solid rgba(255, 20, 147, 0.3);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .type-icon svg {
          width: 40px;
          height: 40px;
        }

        .type-button span {
          font-size: 1.5rem;
          font-weight: 600;
          color: #fff;
          position: relative;
          z-index: 1;
        }

        .type-button small {
          color: #999;
          font-size: 0.95rem;
          position: relative;
          z-index: 1;
        }

        .application-form {
          max-width: 900px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .account-type-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%);
          border: 1px solid rgba(255, 20, 147, 0.3);
          border-radius: 50px;
          position: relative;
          overflow: hidden;
        }

        .type-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, transparent 100%);
          opacity: 0.5;
        }

        .type-badge svg {
          width: 20px;
          height: 20px;
          stroke: #FF69B4;
          position: relative;
          z-index: 1;
        }

        .type-badge span {
          font-size: 14px;
          font-weight: 600;
          color: #FF69B4;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        .change-type-btn {
          padding: 8px 20px;
          background: rgba(255, 20, 147, 0.1);
          border: 1px solid rgba(255, 20, 147, 0.2);
          border-radius: 50px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .change-type-btn:hover {
          background: rgba(255, 20, 147, 0.2);
          border-color: #FF1493;
          transform: translateY(-2px);
        }

        .form-header h2 {
          font-size: 42px;
          color: #fff;
          font-weight: 700;
          letter-spacing: -1px;
          margin-bottom: 10px;
        }

        .form-subtitle {
          font-size: 18px;
          color: #999;
          margin-bottom: 0;
        }

        .form-section {
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%);
          border: 1px solid rgba(255, 20, 147, 0.15);
          border-radius: 30px;
          padding: 50px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
        }

        .form-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 20, 147, 0.05) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .form-section:hover::before {
          opacity: 1;
        }

        .form-section h3 {
          color: #FF69B4;
          margin-bottom: 30px;
          font-size: 1.8rem;
          border-bottom: 1px solid rgba(255, 20, 147, 0.15);
          padding-bottom: 15px;
          position: relative;
          z-index: 1;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          position: relative;
          z-index: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #ccc;
          transition: color 0.3s ease;
          position: relative;
        }

        .checkbox-label:hover {
          color: #FF69B4;
        }

        .checkbox-label input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 20, 147, 0.3);
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
          position: relative;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
          background: linear-gradient(135deg, #FF1493, #FF69B4);
          border-color: #FF1493;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        .status-message {
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 15px;
          position: relative;
          z-index: 1;
        }

        .status-message svg {
          width: 24px;
          height: 24px;
        }

        .status-message.success {
          background: rgba(255, 20, 147, 0.1);
          border: 1px solid #FF1493;
          color: #FF69B4;
        }

        .status-message.error {
          background: rgba(255, 20, 147, 0.05);
          border: 1px solid rgba(255, 20, 147, 0.3);
          color: #FF69B4;
        }

        .submit-button {
          width: 100%;
          padding: 18px 40px;
          font-size: 18px;
          margin-top: 30px;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .apply-title {
            font-size: 42px;
          }

          .type-buttons {
            grid-template-columns: 1fr;
          }

          .form-section {
            padding: 30px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
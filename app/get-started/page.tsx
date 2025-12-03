'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function GetStartedPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    artistName: '',
    catalogSize: '1-5',
    currentDistributor: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      <div className="content-wrapper about-wrapper">
        <header>
          <div className="container">
            <div className="header-content">
              <Link href="/" className="logo">
                <div className="logo-icon">↑</div>
                True North
              </Link>
              <nav>
                <Link href="/">Home</Link>
                <Link href="/#distribution">Distribution</Link>
                <Link href="/#features">Features</Link>
                <Link href="/#pricing">Pricing</Link>
                <Link className="btn-primary" href="/get-started">
                  Get Started
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section className="about-hero" style={{ paddingBottom: '60px' }}>
            <div className="container">
              <div className="about-hero-content fade-in visible">
                <span className="about-badge">Start Your Journey</span>
                <h1>Join True North</h1>
                <p>
                  Ready to take control of your catalog? Fill out the form below to request access. 
                  We review every application to ensure we&apos;re the right partner for your growth.
                </p>
              </div>
            </div>
          </section>

          <section className="section" style={{ paddingTop: '0' }}>
            <div className="container">
              <div className="about-cta-card fade-in visible" style={{ maxWidth: '800px', padding: '60px 50px', margin: '0 auto' }}>
                
                {isSubmitted ? (
                  <div className="success-message fade-in visible">
                    <div className="success-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h2 className="success-title">Application Received</h2>
                    <p className="success-desc">
                      Thanks for reaching out, {formData.name.split(' ')[0]}! We&apos;ve received your details and will be in touch shortly to get you set up.
                    </p>
                    <div style={{ marginTop: '40px' }}>
                      <Link href="/" className="btn-primary">
                        Back to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="form-input"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="form-input"
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="form-group">
                        <label htmlFor="artistName" className="form-label">Artist / Label Name</label>
                        <input
                          type="text"
                          id="artistName"
                          name="artistName"
                          required
                          className="form-input"
                          placeholder="The North Stars"
                          value={formData.artistName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="catalogSize" className="form-label">Estimated Catalog Size</label>
                        <select
                          id="catalogSize"
                          name="catalogSize"
                          className="form-select"
                          value={formData.catalogSize}
                          onChange={handleChange}
                        >
                          <option value="1-5">1-5 Releases</option>
                          <option value="6-20">6-20 Releases</option>
                          <option value="21-100">21-100 Releases</option>
                          <option value="100+">100+ Releases</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="currentDistributor" className="form-label">Current Distributor</label>
                      <select
                        id="currentDistributor"
                        name="currentDistributor"
                        className="form-select"
                        value={formData.currentDistributor}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select your current distributor</option>
                        <option value="DistroKid">DistroKid</option>
                        <option value="CD Baby">CD Baby</option>
                        <option value="Tunecore">Tunecore</option>
                        <option value="UnitedMasters">UnitedMasters</option>
                        <option value="Amuse">Amuse</option>
                        <option value="Ditto">Ditto</option>
                        <option value="Symphonic">Symphonic</option>
                        <option value="ONErpm">ONErpm</option>
                        <option value="AWAL">AWAL</option>
                        <option value="Stem">Stem</option>
                        <option value="None">None / First Release</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">How can we help?</label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-textarea"
                        placeholder="Tell us a bit about your goals or any specific questions you have..."
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                      <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={isLoading}
                        style={{ 
                          padding: '16px 60px', 
                          fontSize: '18px',
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? 'wait' : 'pointer'
                        }}
                      >
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>

        <footer className="about-footer">
          <div className="container">
            <p>© 2025 True North. Built by the team behind ArtistHub.</p>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/legal/terms">Terms &amp; Conditions</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/#dmca-policy">DMCA</Link>
              <Link href="/#cookie-policy">Cookie Policy</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

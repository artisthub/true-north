'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const genreOptions = [
  'Pop', 'Hip-Hop/Rap', 'R&B/Soul', 'Rock', 'Electronic/Dance', 'Latin',
  'Country', 'Jazz', 'Classical', 'Reggae', 'Metal', 'Folk', 'Indie',
  'Alternative', 'Blues', 'Punk', 'Afrobeats', 'K-Pop', 'World', 'Other'
];

const languageOptions = [
  'English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian',
  'Japanese', 'Korean', 'Chinese', 'Arabic', 'Hindi', 'Instrumental', 'Other'
];

const moodKeywords = [
  'Party', 'Chill', 'Romantic', 'Sad', 'Energetic', 'Motivational',
  'Dark', 'Happy', 'Melancholic', 'Aggressive', 'Peaceful', 'Nostalgic',
  'Indigenous', 'LGBTQ', 'Summer', 'Winter', 'Workout', 'Focus', 'Sleep'
];

const territoryOptions = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Spain',
  'Brazil', 'Mexico', 'Japan', 'South Korea', 'Australia', 'India',
  'Netherlands', 'Italy', 'Sweden', 'Global'
];

const ageOptions = [
  '13-17', '18-24', '25-34', '35-44', '45-54', '55+'
];

const dspOptions = [
  'Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Deezer',
  'TikTok', 'Pandora', 'Tidal', 'SoundCloud'
];

const socialPlatforms = [
  'Instagram', 'TikTok', 'Twitter/X', 'Facebook', 'YouTube', 'Snapchat'
];

const initialFormData = {
  // Your Details (auto-filled from user profile)
  email: '',
  name: '',
  artistName: '',
  labelName: ''

  // Release Details
  releaseTitle: '',
  releaseArtists: '',
  releaseType: '',
  releaseStage: '',
  releaseDate: '',
  revelatorReleaseId: '',
  upcCode: '',
  territoryRestrictions: '',

  // Track Details
  trackName: '',
  isrcCode: '',
  instrumental: '',
  primaryGenre: '',
  secondaryGenres: [] as string[],
  lyricsLanguage: '',
  trackInstruments: '',
  moodKeywords: [] as string[],

  // Artist Profiles
  spotifyProfile: '',
  spotifyListeners: '',
  instagramProfile: '',
  instagramFollowers: '',
  youtubeChannel: '',
  youtubeSubscribers: '',
  tiktokProfile: '',
  tiktokFollowers: '',
  deezerProfile: '',
  deezerFans: '',
  otherProfiles: '',
  socialActivity: [] as string[],
  metaReelsParticipation: [] as string[],
  topSocialContent: '',
  collaboratingArtist: '',

  // Marketing Details
  mainPitch: '',
  playlistFit: '',
  behindTheMusic: '',
  marketingPlan: '',
  primaryTerritories: [] as string[],
  ageDemographics: '',
  officialVideo: '',
  priorityDsps: [] as string[],
  directPitching: '',

  // Acknowledgment
  consent: false
};

export default function PitchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const { user } = await response.json();
        
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          name: user.artistName || user.labelName || '',
          artistName: user.artistName || '',
          labelName: user.labelName || ''
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/login');
      } finally {
        setUserLoading(false);
      }
    }
    
    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: null }));
        throw new Error(error ?? 'We couldn\'t submit your pitch. Please try again.');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit pitch', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'We couldn\'t submit your pitch. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => {
      const current = prev[name as keyof typeof prev] as string[];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter(v => v !== value) };
      }
      return { ...prev, [name]: [...current, value] };
    });
  };

  const handleClearForm = () => {
    setFormData(initialFormData);
    setErrorMessage(null);
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
              <Link href="/dashboard" className="logo">
                <div className="logo-icon">
                  <img src="/logo.svg" alt="True North Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
              </Link>
              <nav>
                <Link href="/dashboard">← Back to Dashboard</Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section className="about-hero" style={{ paddingBottom: '40px' }}>
            <div className="container">
              <div className="about-hero-content fade-in visible" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>True North Priority Release Submission Form</h1>
                <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
                  Submit your top priority releases for promotional and editorial opportunities across multiple DSPs.
                  Our curation team reviews each submission and matches it to DSP opportunities based on factors like
                  genre, language, artist status, and editorial strategies. We&apos;re excited to help your music reach new heights!
                </p>
              </div>
            </div>
          </section>

          {/* Pre-submission Checklist */}
          <section className="section" style={{ paddingTop: '0', paddingBottom: '40px' }}>
            <div className="container">
              <div className="pitch-checklist fade-in visible" style={{
                maxWidth: '900px',
                margin: '0 auto',
                background: 'rgba(255, 20, 147, 0.05)',
                border: '1px solid rgba(255, 20, 147, 0.2)',
                borderRadius: '24px',
                padding: '40px'
              }}>
                <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#FF69B4' }}>Pre-submission Check-List:</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'The form is exclusively for True North direct client teams and must not be shared externally.',
                    'Only submit releases distributed under True North deals, with a limit of up to 3 submissions per week.',
                    'Please curate your releases to focus on priority content that has the strongest potential for editorial consideration.',
                    'We recommend submitting the form at least 4 weeks before the release or desired promotion date.',
                    'You should still pitch your releases on Spotify for Artists and other DSP tools. This form is for additional opportunities.'
                  ].map((item, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '16px',
                      color: '#ccc',
                      lineHeight: '1.6'
                    }}>
                      <span style={{ color: '#FF1493', flexShrink: 0 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="section" style={{ paddingTop: '0' }}>
            <div className="container">
              <div className="pitch-form-wrapper fade-in visible" style={{
                maxWidth: '900px',
                margin: '0 auto',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 20, 147, 0.2)',
                borderRadius: '30px',
                padding: '60px 50px'
              }}>

                {userLoading ? (
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ color: '#FF69B4', fontSize: '18px' }}>Loading your information...</div>
                  </div>
                ) : isSubmitted ? (
                  <div className="success-message fade-in visible">
                    <div className="success-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h2 className="success-title">Pitch Submitted Successfully</h2>
                    <p className="success-desc">
                      Thank you for your submission! Our curation team will review your release and reach out if there are any opportunities.
                    </p>
                    <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                      <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
                      <button 
                        type="button" 
                        onClick={() => { setIsSubmitted(false); handleClearForm(); }}
                        className="btn-secondary"
                        style={{
                          border: '1px solid rgba(255, 20, 147, 0.4)',
                          borderRadius: '30px',
                          padding: '12px 30px',
                          background: 'transparent',
                          color: '#FF69B4',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Submit Another Pitch
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>

                    {/* YOUR DETAILS */}
                    <div className="pitch-section">
                      <h2 className="pitch-section-title">YOUR DETAILS</h2>

                      <div style={{ 
                        background: 'rgba(255, 20, 147, 0.05)', 
                        border: '1px solid rgba(255, 20, 147, 0.2)',
                        borderRadius: '16px',
                        padding: '20px',
                        marginBottom: '24px'
                      }}>
                        <p style={{ margin: 0, color: '#ccc' }}>
                          <strong style={{ color: '#FF69B4' }}>Submitting as:</strong> {formData.artistName || formData.labelName || formData.name}
                        </p>
                        <p style={{ margin: '8px 0 0', color: '#999', fontSize: '14px' }}>
                          {formData.email}
                        </p>
                      </div>
                      
                      {/* Hidden fields for pre-filled data */}
                      <input type="hidden" name="email" value={formData.email} />
                      <input type="hidden" name="name" value={formData.name} />
                      <input type="hidden" name="artistName" value={formData.artistName} />
                      <input type="hidden" name="labelName" value={formData.labelName} />
                    </div>

                    {/* RELEASE DETAILS */}
                    <div className="pitch-section">
                      <h2 className="pitch-section-title">RELEASE DETAILS</h2>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="releaseTitle" className="form-label">Release Title <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="text" id="releaseTitle" name="releaseTitle" required className="form-input" placeholder="Album or Single Title" value={formData.releaseTitle} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="releaseArtists" className="form-label">Release Artist(s) <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="text" id="releaseArtists" name="releaseArtists" required className="form-input" placeholder="Artist Name(s)" value={formData.releaseArtists} onChange={handleChange} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="releaseType" className="form-label">Release Type <span style={{ color: '#FF1493' }}>*</span></label>
                          <select id="releaseType" name="releaseType" required className="form-select" value={formData.releaseType} onChange={handleChange}>
                            <option value="" disabled>Select release type</option>
                            <option value="Album">Album</option>
                            <option value="Compilation">Compilation</option>
                            <option value="EP">EP</option>
                            <option value="Single">Single</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="releaseStage" className="form-label">Release Stage <span style={{ color: '#FF1493' }}>*</span></label>
                          <select id="releaseStage" name="releaseStage" required className="form-select" value={formData.releaseStage} onChange={handleChange}>
                            <option value="" disabled>Select release stage</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Newly Released">Newly Released (up to 3 months)</option>
                            <option value="Catalog">Catalog</option>
                          </select>
                          <span className="form-hint">We recommend a 4-week lead time for all release stages.</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="releaseDate" className="form-label">Release Date <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="date" id="releaseDate" name="releaseDate" required className="form-input" value={formData.releaseDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="revelatorReleaseId" className="form-label">True North Release ID <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="number" id="revelatorReleaseId" name="revelatorReleaseId" required className="form-input" placeholder="789012" value={formData.revelatorReleaseId} onChange={handleChange} />
                          <span className="form-hint">Release must exist in the True North system. Format: Integer</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="upcCode" className="form-label">UPC Code <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="text" id="upcCode" name="upcCode" required className="form-input" placeholder="012345678901" value={formData.upcCode} onChange={handleChange} />
                          <span className="form-hint">Format: Integer</span>
                        </div>
                        <div className="form-group">
                          <label htmlFor="labelName" className="form-label">Label Name <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="text" id="labelName" name="labelName" required className="form-input" placeholder="As it appears on True North" value={formData.labelName} onChange={handleChange} />
                          <span className="form-hint">Provide the label name as it appears on your True North release page.</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="territoryRestrictions" className="form-label">Do you Have Territory Restrictions on this Release? <span style={{ color: '#FF1493' }}>*</span></label>
                        <select id="territoryRestrictions" name="territoryRestrictions" required className="form-select" value={formData.territoryRestrictions} onChange={handleChange}>
                          <option value="" disabled>Select an option</option>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </div>

                    {/* TRACK DETAILS */}
                    <div className="pitch-section">
                      <h2 className="pitch-section-title">TRACK DETAILS</h2>
                      <p style={{ color: '#999', marginBottom: '24px', fontSize: '14px' }}>
                        For albums or EPs, share track details you&apos;d like us to focus on for promotion.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="trackName" className="form-label">Track Name <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="text" id="trackName" name="trackName" required className="form-input" placeholder="Song Title" value={formData.trackName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="isrcCode" className="form-label">ISRC Code <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="text" id="isrcCode" name="isrcCode" required className="form-input" placeholder="USRC12345678" value={formData.isrcCode} onChange={handleChange} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="instrumental" className="form-label">Instrumental <span style={{ color: '#FF1493' }}>*</span></label>
                          <select id="instrumental" name="instrumental" required className="form-select" value={formData.instrumental} onChange={handleChange}>
                            <option value="" disabled>Select an option</option>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="primaryGenre" className="form-label">Track Primary Genre <span style={{ color: '#FF1493' }}>*</span></label>
                          <select id="primaryGenre" name="primaryGenre" required className="form-select" value={formData.primaryGenre} onChange={handleChange}>
                            <option value="" disabled>Select primary genre</option>
                            {genreOptions.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Track Secondary Genres <span style={{ color: '#FF1493' }}>*</span></label>
                        <div className="checkbox-grid">
                          {genreOptions.map(g => (
                            <label key={g} className="checkbox-label">
                              <input type="checkbox" checked={formData.secondaryGenres.includes(g)} onChange={() => handleMultiSelect('secondaryGenres', g)} />
                              <span>{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="lyricsLanguage" className="form-label">Track Lyrics Language <span style={{ color: '#FF1493' }}>*</span></label>
                          <select id="lyricsLanguage" name="lyricsLanguage" required className="form-select" value={formData.lyricsLanguage} onChange={handleChange}>
                            <option value="" disabled>Select language</option>
                            {languageOptions.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="trackInstruments" className="form-label">Track Instruments <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="text" id="trackInstruments" name="trackInstruments" required className="form-input" placeholder="Guitar, Piano, Drums..." value={formData.trackInstruments} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Track Mood & Narrative Keywords</label>
                        <p style={{ color: '#999', marginBottom: '12px', fontSize: '14px' }}>
                          Select keywords that describe the track&apos;s mood (e.g., Party, Chill) and any narrative themes, if relevant (e.g., Indigenous, LGBTQ).
                        </p>
                        <div className="checkbox-grid">
                          {moodKeywords.map(m => (
                            <label key={m} className="checkbox-label">
                              <input type="checkbox" checked={formData.moodKeywords.includes(m)} onChange={() => handleMultiSelect('moodKeywords', m)} />
                              <span>{m}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ARTIST PROFILES */}
                    <div className="pitch-section">
                      <h2 className="pitch-section-title">MAIN ARTIST - PROFILES AND SOCIAL MEDIA ACTIVITY</h2>
                      <p style={{ color: '#999', marginBottom: '24px', fontSize: '14px' }}>
                        We recommend focusing on platforms where your artist is active, has a following, and demonstrates engagement or plans to promote the current release.
                        For collaborative tracks, prioritize the more prominent artist. You can still fill out collaborator info in the relevant field.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="spotifyProfile" className="form-label">Spotify Artist Profile <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="url" id="spotifyProfile" name="spotifyProfile" required className="form-input" placeholder="https://open.spotify.com/artist/..." value={formData.spotifyProfile} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="spotifyListeners" className="form-label">Spotify Monthly Listeners <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="number" id="spotifyListeners" name="spotifyListeners" required className="form-input" placeholder="50000" value={formData.spotifyListeners} onChange={handleChange} />
                          <span className="form-hint">Format: Integer</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="instagramProfile" className="form-label">Instagram Artist Profile <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="url" id="instagramProfile" name="instagramProfile" required className="form-input" placeholder="https://instagram.com/..." value={formData.instagramProfile} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="instagramFollowers" className="form-label">Instagram Followers <span style={{ color: '#FF1493' }}>*</span></label>
                          <input type="number" id="instagramFollowers" name="instagramFollowers" required className="form-input" placeholder="25000" value={formData.instagramFollowers} onChange={handleChange} />
                          <span className="form-hint">Format: Integer</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="youtubeChannel" className="form-label">YouTube Artist Channel</label>
                          <input type="url" id="youtubeChannel" name="youtubeChannel" className="form-input" placeholder="https://youtube.com/..." value={formData.youtubeChannel} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="youtubeSubscribers" className="form-label">YouTube Subscribers</label>
                          <input type="number" id="youtubeSubscribers" name="youtubeSubscribers" className="form-input" placeholder="10000" value={formData.youtubeSubscribers} onChange={handleChange} />
                          <span className="form-hint">Format: Integer</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="tiktokProfile" className="form-label">TikTok Artist Profile</label>
                          <input type="url" id="tiktokProfile" name="tiktokProfile" className="form-input" placeholder="https://tiktok.com/@..." value={formData.tiktokProfile} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tiktokFollowers" className="form-label">TikTok Followers</label>
                          <input type="number" id="tiktokFollowers" name="tiktokFollowers" className="form-input" placeholder="15000" value={formData.tiktokFollowers} onChange={handleChange} />
                          <span className="form-hint">Format: Integer</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label htmlFor="deezerProfile" className="form-label">Deezer Artist Profile</label>
                          <input type="url" id="deezerProfile" name="deezerProfile" className="form-input" placeholder="https://deezer.com/artist/..." value={formData.deezerProfile} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="deezerFans" className="form-label">Deezer Artist Fans</label>
                          <input type="number" id="deezerFans" name="deezerFans" className="form-input" placeholder="5000" value={formData.deezerFans} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="otherProfiles" className="form-label">Other Artist Key Profiles? (Optional)</label>
                        <textarea id="otherProfiles" name="otherProfiles" className="form-textarea" style={{ minHeight: '80px' }} placeholder="Add any other relevant profiles with URLs and follower counts..." value={formData.otherProfiles} onChange={handleChange}></textarea>
                        <span className="form-hint">Selecting a platform will prompt fields for URL & follower count, increasing relevancy for pitching.</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Artist Social Activity <span style={{ color: '#FF1493' }}>*</span></label>
                        <p style={{ color: '#999', marginBottom: '12px', fontSize: '14px' }}>
                          Please select the platforms on which the Artist has been actively posting/engaging within the last 30 days.
                        </p>
                        <div className="checkbox-grid">
                          {socialPlatforms.map(p => (
                            <label key={p} className="checkbox-label">
                              <input type="checkbox" checked={formData.socialActivity.includes(p)} onChange={() => handleMultiSelect('socialActivity', p)} />
                              <span>{p}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Artist Participation in Meta Reels Activity</label>
                        <p style={{ color: '#999', marginBottom: '12px', fontSize: '14px' }}>Is the artist willing to:</p>
                        <div className="checkbox-grid" style={{ gridTemplateColumns: '1fr' }}>
                          {[
                            'Provide 1 exclusive reel for this release',
                            'Pin 3 fan reels to the top of the audio library page for the track',
                            'Share 1 fan reel using the sound to their stories'
                          ].map(opt => (
                            <label key={opt} className="checkbox-label">
                              <input type="checkbox" checked={formData.metaReelsParticipation.includes(opt)} onChange={() => handleMultiSelect('metaReelsParticipation', opt)} />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="topSocialContent" className="form-label">Top Social Content</label>
                        <textarea id="topSocialContent" name="topSocialContent" className="form-textarea" style={{ minHeight: '80px' }} placeholder="Provide links to the artist's most engaging social content..." value={formData.topSocialContent} onChange={handleChange}></textarea>
                        <span className="form-hint">Including platform-specific links for each DSP you&apos;re interested in can strengthen your pitch.</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="collaboratingArtist" className="form-label">Collaborating Artist (Main/ Featured/ Remixer)</label>
                        <textarea id="collaboratingArtist" name="collaboratingArtist" className="form-textarea" style={{ minHeight: '80px' }} placeholder="Enter artist name and any relevant info..." value={formData.collaboratingArtist} onChange={handleChange}></textarea>
                      </div>
                    </div>

                    {/* MARKETING DETAILS */}
                    <div className="pitch-section">
                      <h2 className="pitch-section-title">MARKETING DETAILS</h2>
                      <div style={{ background: 'rgba(255, 20, 147, 0.05)', border: '1px solid rgba(255, 20, 147, 0.15)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
                          <strong style={{ color: '#FF69B4' }}>Key points for writing your main pitch:</strong>
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#bbb', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                          <li>First, highlight the mood your song sets, the emotions it creates, and the scenarios it complements.</li>
                          <li>Then, include one standout achievement about the artist for added context, even for emerging artists.</li>
                          <li>Fill out the DSP playlists your song fits best in the designated field, if applicable.</li>
                        </ul>
                        <p style={{ color: '#999', fontSize: '13px', marginTop: '16px', fontStyle: 'italic' }}>
                          Example: &quot;&apos;Call My Name&apos; is a gentle, comforting acoustic folk tune that captures the charm of England&apos;s countryside - perfect for cozy winter nights or escaping into nature. Following the RIAA Platinum certification of her debut album Black Flower, UK artist Katy Longmore unveils a new single from her highly anticipated second album.&quot;
                        </p>
                      </div>

                      <div className="form-group">
                        <label htmlFor="mainPitch" className="form-label">Your Main Pitch <span style={{ color: '#FF1493' }}>*</span></label>
                        <textarea id="mainPitch" name="mainPitch" required className="form-textarea" maxLength={400} placeholder="Write your compelling pitch here..." value={formData.mainPitch} onChange={handleChange}></textarea>
                        <span className="form-hint">Max. 400 characters. ({formData.mainPitch.length}/400)</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="playlistFit" className="form-label">Which playlist(s) do you think your song fits best?</label>
                        <textarea id="playlistFit" name="playlistFit" className="form-textarea" style={{ minHeight: '80px' }} placeholder="Focus on genre-specific playlists rather than the largest ones..." value={formData.playlistFit} onChange={handleChange}></textarea>
                        <span className="form-hint">Genre-specific playlists are often prioritized for testing by the DSPs.</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="behindTheMusic" className="form-label">Behind the Music</label>
                        <textarea id="behindTheMusic" name="behindTheMusic" className="form-textarea" maxLength={350} placeholder="Share details like the creative process, tour stories, or any unique angle..." value={formData.behindTheMusic} onChange={handleChange}></textarea>
                        <span className="form-hint">Max. 350 characters. ({formData.behindTheMusic.length}/350)</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="marketingPlan" className="form-label">Marketing Plan for this Release <span style={{ color: '#FF1493' }}>*</span></label>
                        <textarea id="marketingPlan" name="marketingPlan" required className="form-textarea" maxLength={350} placeholder="Provide a concise marketing plan overview in bullet points..." value={formData.marketingPlan} onChange={handleChange}></textarea>
                        <span className="form-hint">Include traditional marketing efforts and budget for specific DSP campaigns. Max. 350 characters. ({formData.marketingPlan.length}/350)</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Artist Image & Release Artwork</label>
                        <div style={{ border: '2px dashed rgba(255, 20, 147, 0.3)', borderRadius: '16px', padding: '40px', textAlign: 'center', background: 'rgba(0, 0, 0, 0.3)' }}>
                          <p style={{ color: '#999', marginBottom: '8px' }}>Upload high-quality JPEG/PNG images of the primary artist and the release artwork.</p>
                          <p style={{ color: '#666', fontSize: '13px' }}>You can upload up to 3 files, each up to 3 MB.</p>
                          <input type="file" accept="image/jpeg,image/png" multiple style={{ marginTop: '16px' }} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Artist&apos;s Primary Audience - Territories <span style={{ color: '#FF1493' }}>*</span></label>
                        <p style={{ color: '#999', marginBottom: '12px', fontSize: '14px' }}>
                          Consider factors like streaming, social media following, and touring.
                        </p>
                        <div className="checkbox-grid">
                          {territoryOptions.map(t => (
                            <label key={t} className="checkbox-label">
                              <input type="checkbox" checked={formData.primaryTerritories.includes(t)} onChange={() => handleMultiSelect('primaryTerritories', t)} />
                              <span>{t}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="ageDemographics" className="form-label">Artist&apos;s Primary Audience - Age Demographics</label>
                        <select id="ageDemographics" name="ageDemographics" className="form-select" value={formData.ageDemographics} onChange={handleChange}>
                          <option value="" disabled>Select the option that best represents the artist&apos;s core audience</option>
                          {ageOptions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="officialVideo" className="form-label">Official Video for this Song?</label>
                        <select id="officialVideo" name="officialVideo" className="form-select" value={formData.officialVideo} onChange={handleChange}>
                          <option value="" disabled>Will you be posting an official long-form video on YouTube?</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Maybe">Maybe / Not Sure</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Choose up to 3 Priority DSPs to Pitch</label>
                        <p style={{ color: '#999', marginBottom: '12px', fontSize: '14px' }}>
                          These are your top priorities - we&apos;ll still pitch to others if relevant.
                        </p>
                        <div className="checkbox-grid">
                          {dspOptions.map(d => (
                            <label key={d} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.priorityDsps.includes(d)}
                                onChange={() => {
                                  if (formData.priorityDsps.includes(d)) {
                                    handleMultiSelect('priorityDsps', d);
                                  } else if (formData.priorityDsps.length < 3) {
                                    handleMultiSelect('priorityDsps', d);
                                  }
                                }}
                              />
                              <span>{d}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="directPitching" className="form-label">Are you planning to pitch this release to DSP editors directly? <span style={{ color: '#FF1493' }}>*</span></label>
                        <select id="directPitching" name="directPitching" required className="form-select" value={formData.directPitching} onChange={handleChange}>
                          <option value="" disabled>Select an option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <span className="form-hint">This refers to direct DSP contacts and not tools like S4A or AM4A.</span>
                      </div>
                    </div>

                    {/* SUBMISSION ACKNOWLEDGMENT */}
                    <div className="pitch-section">
                      <h2 className="pitch-section-title">SUBMISSION ACKNOWLEDGMENT AND PROMOTION CONSENT</h2>
                      <p style={{ color: '#ccc', marginBottom: '16px', fontSize: '14px', lineHeight: '1.7' }}>
                        Kindly read the terms below:
                      </p>

                      <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 20, 147, 0.15)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                        <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#bbb', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                          <li style={{ marginBottom: '12px' }}>
                            While we make our best effort to promote your content, we retain full discretion to curate and prioritize submissions based on factors like genre, language, artist status, and editorial strategies. Please note that we cannot guarantee pitches to any DSP or ensure that DSPs will provide support, even if pitched.
                          </li>
                          <li>
                            You consent to the inclusion of this release and artist in True North&apos;s official social media and promotional channels, such as label/artist spotlights, success stories, catalog highlights, and playlist features. Your label or brand will be prominently featured alongside the relevant releases and artists showcased.
                          </li>
                        </ul>
                      </div>

                      <div className="form-group">
                        <label className="checkbox-label" style={{ fontSize: '16px' }}>
                          <input
                            type="checkbox"
                            name="consent"
                            required
                            checked={formData.consent}
                            onChange={handleChange}
                          />
                          <span>I acknowledge and consent to the terms outlined above regarding content curation and promotional inclusion <span style={{ color: '#FF1493' }}>*</span></span>
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleClearForm}
                        style={{
                          padding: '16px 40px',
                          fontSize: '16px',
                          background: 'transparent',
                          border: '1px solid rgba(255, 20, 147, 0.3)',
                          borderRadius: '30px',
                          color: '#999',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Clear form
                      </button>
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
                        {isLoading ? 'Submitting...' : 'Submit Pitch'}
                      </button>
                    </div>

                    {errorMessage && (
                      <p style={{ marginTop: '16px', color: '#f472b6', textAlign: 'center' }}>
                        {errorMessage}
                      </p>
                    )}

                    <p style={{ textAlign: 'center', marginTop: '24px', color: '#666', fontSize: '13px' }}>
                      Do not submit passwords through this form. Report malicious form.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>

        <footer className="about-footer">
          <div className="container">
            <p>&copy; 2025 True North. Built by the team behind ArtistHub.</p>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/legal/terms">Terms &amp; Conditions</Link>
              <Link href="/legal/privacy">Privacy Policy</Link>
            </nav>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .pitch-section {
          margin-bottom: 50px;
          padding-bottom: 50px;
          border-bottom: 1px solid rgba(255, 20, 147, 0.1);
        }
        .pitch-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .pitch-section-title {
          font-size: 20px;
          font-weight: 700;
          color: #FF69B4;
          margin-bottom: 24px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .form-hint {
          display: block;
          margin-top: 6px;
          font-size: 12px;
          color: #666;
        }
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #ccc;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid transparent;
        }
        .checkbox-label:hover {
          background: rgba(255, 20, 147, 0.05);
          border-color: rgba(255, 20, 147, 0.2);
        }
        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #FF1493;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

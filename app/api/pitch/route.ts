import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type PitchPayload = {
  // Your Details
  email?: string;
  name?: string;
  enterpriseName?: string;
  revelatorAccountId?: string;

  // Release Details
  releaseTitle?: string;
  releaseArtists?: string;
  releaseType?: string;
  releaseStage?: string;
  releaseDate?: string;
  revelatorReleaseId?: string;
  upcCode?: string;
  labelName?: string;
  territoryRestrictions?: string;

  // Track Details
  trackName?: string;
  isrcCode?: string;
  instrumental?: string;
  primaryGenre?: string;
  secondaryGenres?: string[];
  lyricsLanguage?: string;
  trackInstruments?: string;
  moodKeywords?: string[];

  // Artist Profiles
  spotifyProfile?: string;
  spotifyListeners?: string;
  instagramProfile?: string;
  instagramFollowers?: string;
  youtubeChannel?: string;
  youtubeSubscribers?: string;
  tiktokProfile?: string;
  tiktokFollowers?: string;
  deezerProfile?: string;
  deezerFans?: string;
  otherProfiles?: string;
  socialActivity?: string[];
  metaReelsParticipation?: string[];
  topSocialContent?: string;
  collaboratingArtist?: string;

  // Marketing Details
  mainPitch?: string;
  playlistFit?: string;
  behindTheMusic?: string;
  marketingPlan?: string;
  primaryTerritories?: string[];
  ageDemographics?: string;
  officialVideo?: string;
  priorityDsps?: string[];
  directPitching?: string;

  // Acknowledgment
  consent?: boolean;
};

const requiredFields: Array<keyof PitchPayload> = [
  'email',
  'name',
  'enterpriseName',
  'revelatorAccountId',
  'releaseTitle',
  'releaseArtists',
  'releaseType',
  'releaseStage',
  'releaseDate',
  'revelatorReleaseId',
  'upcCode',
  'labelName',
  'territoryRestrictions',
  'trackName',
  'isrcCode',
  'instrumental',
  'primaryGenre',
  'lyricsLanguage',
  'trackInstruments',
  'spotifyProfile',
  'spotifyListeners',
  'instagramProfile',
  'instagramFollowers',
  'mainPitch',
  'marketingPlan',
  'directPitching',
  'consent'
];

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

export async function POST(request: Request) {
  let payload: PitchPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const missingField = requiredFields.find((field) => {
    const value = payload[field];
    if (field === 'consent') return value !== true;
    return !value;
  });

  if (missingField) {
    return NextResponse.json(
      { error: `Missing required field: ${missingField}` },
      { status: 400 }
    );
  }

  // Save to Supabase
  const { error: dbError } = await supabase.from('pitch_submissions').insert({
    email: payload.email,
    name: payload.name,
    enterprise_name: payload.enterpriseName,
    true_north_account_id: payload.revelatorAccountId,
    release_title: payload.releaseTitle,
    release_artists: payload.releaseArtists,
    release_type: payload.releaseType,
    release_stage: payload.releaseStage,
    release_date: payload.releaseDate,
    true_north_release_id: payload.revelatorReleaseId,
    upc_code: payload.upcCode,
    label_name: payload.labelName,
    territory_restrictions: payload.territoryRestrictions,
    track_name: payload.trackName,
    isrc_code: payload.isrcCode,
    instrumental: payload.instrumental,
    primary_genre: payload.primaryGenre,
    secondary_genres: payload.secondaryGenres || [],
    lyrics_language: payload.lyricsLanguage,
    track_instruments: payload.trackInstruments,
    mood_keywords: payload.moodKeywords || [],
    spotify_profile: payload.spotifyProfile,
    spotify_listeners: payload.spotifyListeners,
    instagram_profile: payload.instagramProfile,
    instagram_followers: payload.instagramFollowers,
    youtube_channel: payload.youtubeChannel,
    youtube_subscribers: payload.youtubeSubscribers,
    tiktok_profile: payload.tiktokProfile,
    tiktok_followers: payload.tiktokFollowers,
    deezer_profile: payload.deezerProfile,
    deezer_fans: payload.deezerFans,
    other_profiles: payload.otherProfiles,
    social_activity: payload.socialActivity || [],
    meta_reels_participation: payload.metaReelsParticipation || [],
    top_social_content: payload.topSocialContent,
    collaborating_artist: payload.collaboratingArtist,
    main_pitch: payload.mainPitch,
    playlist_fit: payload.playlistFit,
    behind_the_music: payload.behindTheMusic,
    marketing_plan: payload.marketingPlan,
    primary_territories: payload.primaryTerritories || [],
    age_demographics: payload.ageDemographics,
    official_video: payload.officialVideo,
    priority_dsps: payload.priorityDsps || [],
    direct_pitching: payload.directPitching,
    consent: payload.consent
  });

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return NextResponse.json(
      { error: 'Failed to save submission.' },
      { status: 500 }
    );
  }

  // Also notify Slack if webhook is configured
  if (slackWebhookUrl) {
    try {
      const body = buildSlackMessage(payload);
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (error) {
      // Log but don't fail the request if Slack notification fails
      console.error('Slack webhook error:', error);
    }
  }

  return NextResponse.json({ success: true });
}

function buildSlackMessage(payload: PitchPayload) {
  const formatArray = (arr?: string[]) => arr?.length ? arr.join(', ') : '(none)';

  const sections = [
    '*🎵 New Priority Release Pitch Submission*',
    '',
    '*━━━ SUBMITTER DETAILS ━━━*',
    `*Name:* ${payload.name}`,
    `*Email:* ${payload.email}`,
    `*Enterprise:* ${payload.enterpriseName}`,
    `*True North Account ID:* ${payload.revelatorAccountId}`,
    '',
    '*━━━ RELEASE DETAILS ━━━*',
    `*Release Title:* ${payload.releaseTitle}`,
    `*Artist(s):* ${payload.releaseArtists}`,
    `*Type:* ${payload.releaseType}`,
    `*Stage:* ${payload.releaseStage}`,
    `*Release Date:* ${payload.releaseDate}`,
    `*True North Release ID:* ${payload.revelatorReleaseId}`,
    `*UPC:* ${payload.upcCode}`,
    `*Label:* ${payload.labelName}`,
    `*Territory Restrictions:* ${payload.territoryRestrictions}`,
    '',
    '*━━━ TRACK DETAILS ━━━*',
    `*Track Name:* ${payload.trackName}`,
    `*ISRC:* ${payload.isrcCode}`,
    `*Instrumental:* ${payload.instrumental}`,
    `*Primary Genre:* ${payload.primaryGenre}`,
    `*Secondary Genres:* ${formatArray(payload.secondaryGenres)}`,
    `*Lyrics Language:* ${payload.lyricsLanguage}`,
    `*Instruments:* ${payload.trackInstruments}`,
    `*Mood Keywords:* ${formatArray(payload.moodKeywords)}`,
    '',
    '*━━━ ARTIST PROFILES ━━━*',
    `*Spotify:* ${payload.spotifyProfile} (${payload.spotifyListeners} monthly listeners)`,
    `*Instagram:* ${payload.instagramProfile} (${payload.instagramFollowers} followers)`,
    payload.youtubeChannel ? `*YouTube:* ${payload.youtubeChannel} (${payload.youtubeSubscribers || 'N/A'} subscribers)` : null,
    payload.tiktokProfile ? `*TikTok:* ${payload.tiktokProfile} (${payload.tiktokFollowers || 'N/A'} followers)` : null,
    payload.deezerProfile ? `*Deezer:* ${payload.deezerProfile} (${payload.deezerFans || 'N/A'} fans)` : null,
    payload.otherProfiles ? `*Other Profiles:* ${payload.otherProfiles}` : null,
    `*Social Activity (last 30 days):* ${formatArray(payload.socialActivity)}`,
    `*Meta Reels Participation:* ${formatArray(payload.metaReelsParticipation)}`,
    payload.topSocialContent ? `*Top Social Content:* ${payload.topSocialContent}` : null,
    payload.collaboratingArtist ? `*Collaborating Artist:* ${payload.collaboratingArtist}` : null,
    '',
    '*━━━ MARKETING DETAILS ━━━*',
    `*Main Pitch:*\n${payload.mainPitch}`,
    '',
    payload.playlistFit ? `*Playlist Fit:* ${payload.playlistFit}` : null,
    payload.behindTheMusic ? `*Behind the Music:* ${payload.behindTheMusic}` : null,
    `*Marketing Plan:*\n${payload.marketingPlan}`,
    '',
    `*Primary Territories:* ${formatArray(payload.primaryTerritories)}`,
    payload.ageDemographics ? `*Age Demographics:* ${payload.ageDemographics}` : null,
    payload.officialVideo ? `*Official Video:* ${payload.officialVideo}` : null,
    `*Priority DSPs:* ${formatArray(payload.priorityDsps)}`,
    `*Direct DSP Pitching:* ${payload.directPitching}`,
    '',
    '*━━━━━━━━━━━━━━━━━━━━━━━*',
    '✅ Consent acknowledged'
  ].filter(Boolean);

  return {
    text: sections.join('\n')
  };
}

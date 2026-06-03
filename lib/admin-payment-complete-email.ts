type ApplicationRecord = Record<string, unknown>;

type SubmissionSection = {
  title: string;
  rows: Array<{
    label: string;
    value: string;
  }>;
};

type FormattedApplicationSubmission = {
  html: string;
  text: string;
};

const FIELD_GROUPS: Array<{ title: string; fields: Array<{ key: string; label: string }> }> = [
  {
    title: 'Contact Information',
    fields: [
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
    ],
  },
  {
    title: 'Artist Details',
    fields: [
      { key: 'artist_name', label: 'Artist Name' },
      { key: 'artist_country', label: 'Artist Country' },
      { key: 'artist_spotify_url', label: 'Artist Spotify URL' },
      { key: 'artist_instagram_handle', label: 'Artist Instagram Handle' },
      { key: 'artist_genre', label: 'Artist Genre' },
      { key: 'artist_sub_genre', label: 'Artist Sub-Genre' },
      { key: 'artist_years_active', label: 'Artist Years Active' },
      { key: 'artist_releases_count', label: 'Artist Releases Count' },
      { key: 'artist_monthly_listeners', label: 'Artist Monthly Listeners' },
    ],
  },
  {
    title: 'Label Details',
    fields: [
      { key: 'label_name', label: 'Label Name' },
      { key: 'label_country', label: 'Label Country' },
      { key: 'label_website', label: 'Label Website' },
      { key: 'label_roster_size', label: 'Label Roster Size' },
      { key: 'label_genres', label: 'Label Genres' },
      { key: 'label_founded_year', label: 'Label Founded Year' },
    ],
  },
  {
    title: 'Business & Distribution Details',
    fields: [
      { key: 'catalog_size', label: 'Catalog Size' },
      { key: 'current_distributor', label: 'Current Distributor' },
      { key: 'distribution_goals', label: 'Distribution Goals' },
      { key: 'marketing_budget', label: 'Marketing Budget' },
      { key: 'team_size', label: 'Team Size' },
      { key: 'revenue_sources', label: 'Revenue Sources' },
    ],
  },
  {
    title: 'Application Answers',
    fields: [
      { key: 'why_true_north', label: 'Why True North' },
      { key: 'additional_info', label: 'Additional Info' },
    ],
  },
  {
    title: 'Application Record',
    fields: [
      { key: 'id', label: 'Application ID' },
      { key: 'created_at', label: 'Submitted At' },
      { key: 'account_type', label: 'Account Type' },
      { key: 'status', label: 'Application Status' },
    ],
  },
];

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    const items = value
      .map((entry) => formatValue(entry))
      .filter((entry): entry is string => Boolean(entry));

    return items.length > 0 ? items.join(', ') : null;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return String(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildSections(application: ApplicationRecord): SubmissionSection[] {
  return FIELD_GROUPS.map((group) => ({
    title: group.title,
    rows: group.fields.flatMap((field) => {
      const formattedValue = formatValue(application[field.key]);

      if (!formattedValue) {
        return [];
      }

      return [{
        label: field.label,
        value: formattedValue,
      }];
    }),
  })).filter((group) => group.rows.length > 0);
}

export function formatApplicationSubmission(application: ApplicationRecord): FormattedApplicationSubmission {
  const sections = buildSections(application);

  const html = sections.map((section) => {
    const rows = section.rows.map((row) => `
      <tr>
        <td style="padding: 8px 0; color: #999999; font-size: 14px; width: 38%; vertical-align: top;">${escapeHtml(row.label)}:</td>
        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(row.value)}</td>
      </tr>
    `).join('');

    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: rgba(0, 0, 0, 0.35); border-radius: 12px; border: 1px solid rgba(255, 20, 147, 0.08); margin: 0 0 18px 0;">
        <tr>
          <td style="padding: 22px 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 17px; font-weight: 600; color: #FF69B4;">${escapeHtml(section.title)}</h3>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              ${rows}
            </table>
          </td>
        </tr>
      </table>
    `;
  }).join('');

  const text = sections.map((section) => {
    const rows = section.rows.map((row) => `${row.label}: ${row.value}`).join('\n');
    return `${section.title}\n${rows}`;
  }).join('\n\n');

  return { html, text };
}

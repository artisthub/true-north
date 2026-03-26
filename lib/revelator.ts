const REVELATOR_API_BASE = 'https://api.revelator.com';

function getApiKey(): string | null {
  return process.env.REVELATOR_API_KEY || null;
}

function getWebUrl(): string {
  return process.env.REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com';
}

interface SignupParams {
  email: string;
  password: string;
  enterpriseName: string;
  firstname?: string;
  lastname?: string;
  type: 'Launch' | 'Growth';
  partnerUserId: string;
}

interface SignupResponse {
  userId: string;
  enterpriseId: number;
}

interface LoginResponse {
  accessToken: string;
  permissions: Array<{
    enterpriseId: number;
    enterpriseName: string;
    isOwner: boolean;
    isDefault: boolean;
    email: string;
  }>;
  isAuthorized: boolean;
}

interface UpgradeParams {
  newType?: 'Launch' | 'Growth';
  newMaxArtists?: number;
  newStoreAccess?: {
    type: 'all' | 'some' | 'none';
    storeIds?: number[];
  };
}

export async function createAccount(params: SignupParams): Promise<SignupResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Revelator API key not configured');
  }

  const response = await fetch(`${REVELATOR_API_BASE}/partner/account/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      password: params.password,
      enterpriseName: params.enterpriseName,
      firstname: params.firstname || '',
      lastname: params.lastname || '',
      type: params.type,
      partnerUserId: params.partnerUserId,
      partnerAPIKey: apiKey,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Revelator signup failed:', response.status, errorBody);
    throw new Error(`Revelator signup failed: ${response.status} - ${errorBody}`);
  }

  return response.json() as Promise<SignupResponse>;
}

export async function loginUnprompted(partnerUserId: string): Promise<LoginResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Revelator API key not configured');
  }

  const response = await fetch(`${REVELATOR_API_BASE}/partner/account/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      partnerUserId,
      partnerApiKey: apiKey,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Revelator login failed:', response.status, errorBody);
    throw new Error(`Revelator login failed: ${response.status} - ${errorBody}`);
  }

  return response.json() as Promise<LoginResponse>;
}

export async function upgradeAccount(enterpriseId: number, params: UpgradeParams): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Revelator API key not configured');
  }

  const response = await fetch(`${REVELATOR_API_BASE}/partner/account/upgrade`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      partnerAPIKey: apiKey,
      enterpriseId,
      ...params,
    }),
  });

  if (!response.ok && response.status !== 204) {
    const errorBody = await response.text();
    console.error('Revelator upgrade failed:', response.status, errorBody);
    throw new Error(`Revelator upgrade failed: ${response.status} - ${errorBody}`);
  }
}

export function buildRedirectUrl(accessToken: string): string {
  const webUrl = getWebUrl();
  const separator = webUrl.includes('?') ? '&' : '?';
  return `${webUrl}${separator}token=${accessToken}`;
}

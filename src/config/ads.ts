export const AD_CONFIG = {
  // Ad display settings
  adsPerPage: parseInt(process.env.ADS_PER_PAGE || '3', 10),
  refreshInterval: parseInt(process.env.AD_REFRESH_INTERVAL || '30000', 10),
  minDisplayTime: parseInt(process.env.MIN_AD_DISPLAY_TIME || '5000', 10),

  // Ad formats
  formats: {
    banner: {
      desktop: { width: 728, height: 90 },
      mobile: { width: 320, height: 50 },
      tablet: { width: 468, height: 60 },
    },
    rectangle: {
      desktop: { width: 300, height: 250 },
      mobile: { width: 300, height: 250 },
      tablet: { width: 300, height: 250 },
    },
    leaderboard: {
      desktop: { width: 970, height: 90 },
      mobile: { width: 320, height: 100 },
      tablet: { width: 728, height: 90 },
    },
    skyscraper: {
      desktop: { width: 160, height: 600 },
      mobile: { width: 120, height: 240 },
      tablet: { width: 160, height: 600 },
    },
  },

  // Rate limiting
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIMEWINDOW || '60000', 10),
  },

  // Mock settings
  mock: {
    enabled: process.env.MOCK_ADS_MODE === 'true',
    scenario: process.env.MOCK_ADS_SCENARIO || 'success',
  },
} as const;

export const GOOGLE_ADS_CONFIG = {
  enabled: process.env.GOOGLE_ADS_ENABLED === 'true',
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  adsense: {
    clientId: process.env.ADSENSE_CLIENT_ID || '',
    slotId: process.env.ADSENSE_SLOT_ID || '',
  },
  admob: {
    appId: process.env.ADMOB_APP_ID || '',
    bannerUnitId: process.env.ADMOB_BANNER_UNIT_ID || '',
  },
} as const;

export const apiConfig = {
  baseUrl: 'https://localhost:7056',
  authCookies: {
    accessToken: 'dev_accessToken',
    refreshToken: 'dev_refreshToken',
    legacyRefreshToken: 'dev_binsera_refresh_token',
  },
} as const;
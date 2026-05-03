export const apiConfig = {
  baseUrl: 'https://qa-api.yourdomain.com',
  authCookies: {
    accessToken: 'qa_accessToken',
    refreshToken: 'qa_refreshToken',
    legacyRefreshToken: 'qa_binsera_refresh_token',
  },
} as const;

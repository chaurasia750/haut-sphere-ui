export const apiConfig = {
  baseUrl: 'https://qa-api.yourdomain.com',
  authCookies: {
    accessToken: 'ANON_qa_accessToken',
    refreshToken: 'ANON_qa_refreshToken',
    legacyRefreshToken: 'ANON_qa_binsera_refresh_token',
  },
} as const;

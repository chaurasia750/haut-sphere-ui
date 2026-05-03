export const apiConfig = {
  baseUrl: 'https://api.yourdomain.com',
  authCookies: {
    accessToken: 'prod_accessToken',
    refreshToken: 'prod_refreshToken',
    legacyRefreshToken: 'prod_binsera_refresh_token',
  },
} as const;

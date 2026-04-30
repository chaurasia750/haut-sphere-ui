# Contract: Authentication Response

**Endpoint**: `POST /auth/login` (success response)  
**HTTP Status**: `200 OK`  
**Content-Type**: `application/json`  
**Set-Cookie Headers**: Included (see below)

## Response Format

```typescript
interface AuthLoginResponse {
  roleId: number;       // 1, 2, 3, or 4
  userId: string;       // UUID assigned by backend
  expiresIn: number;    // Seconds until access token expires (1800 typical)
}
```

## HTTP Response Structure

```
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: accessToken=<value>; HttpOnly; Secure; SameSite=Strict; Max-Age=1800; Path=/
Set-Cookie: refreshToken=<value>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/

{
  "roleId": 2,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": 1800
}
```

## Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| roleId | number | Yes | Valid: 1 (System Admin), 2 (Admin), 3 (Member), 4 (Manager). Invalid values must be rejected with error. |
| userId | string | Yes | UUID assigned by backend; used in logs and subsequent API calls. Must be non-empty. |
| expiresIn | number | Yes | Seconds until accessToken expires. Typical: 1800 (30 min). Must be positive. |

## Cookie Details

### Access Token Cookie

```
Set-Cookie: accessToken=<JWT_OR_OPAQUE_TOKEN>;
  HttpOnly=true;
  Secure=true;
  SameSite=Strict;
  Max-Age=1800;
  Path=/;
  Domain=<your-domain>;
```

- **HttpOnly**: Prevents JavaScript access (protects against XSS)
- **Secure**: Only sent over HTTPS
- **SameSite=Strict**: Prevents CSRF attacks (not sent on cross-site requests)
- **Max-Age=1800**: 30 minutes (matches expiresIn)
- **Path=/**: Available on all routes

### Refresh Token Cookie

```
Set-Cookie: refreshToken=<JWT_OR_OPAQUE_TOKEN>;
  HttpOnly=true;
  Secure=true;
  SameSite=Strict;
  Max-Age=604800;
  Path=/;
  Domain=<your-domain>;
```

- **Max-Age=604800**: 7 days (enables session extension beyond access token)
- Other flags same as access token

## Frontend Usage Example

```typescript
// Login response received
this.http.post<AuthLoginResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password'
}).subscribe(
  (response) => {
    console.log('User role:', response.roleId);
    console.log('Session expires in:', response.expiresIn, 'seconds');
    
    // Frontend CANNOT access tokens (httpOnly cookies)
    // Cookies automatically sent by browser on next requests
    
    // Router guard will use roleId to route user
    this.router.navigate([this.getRoleRoute(response.roleId)]);
  }
);

// Helper: Map role to route
getRoleRoute(roleId: number): string {
  switch(roleId) {
    case 1:
    case 2:
      return '/admin';
    case 3:
      return '/member';
    case 4:
      return '/management';
    default:
      throw new Error('Invalid role: ' + roleId);
  }
}
```

## Validation Rules (Frontend)

1. **roleId must be one of** (1, 2, 3, 4)
   - If invalid, log error and display generic message
2. **userId must be non-empty string**
3. **expiresIn must be positive number**

## Cookie Verification Test (No-op for Frontend)

Frontend CANNOT verify cookies are httpOnly (browser prevents access). Testing must occur via:

1. **Network Inspector**: Check Set-Cookie headers contain `HttpOnly` flag
2. **Selenium/Cypress**: Attempt `document.cookie` → should NOT contain `accessToken` or `refreshToken`
3. **Backend Test**: Verify token revocation invalidates session

## Error Responses

**Invalid Role ID** (returned in successful 200 response, but role invalid):
```json
{
  "roleId": 99,
  "userId": "...",
  "expiresIn": 1800
}
```
Frontend should detect roleId not in [1,2,3,4] and treat as error.

## Security Considerations

- **Tokens Must Be Secure**: Use cryptographic signing (JWT with RS256 recommended)
- **Tokens Must Be Unique**: Never reuse tokens; generate new on each login
- **Refresh Token Invalidation**: Store refresh tokens server-side; revoke on logout or new login
- **Concurrent Login Handling**: Invalidate previous session tokens when new login detected
- **Token Format Irrelevant to Frontend**: Frontend treats as opaque strings; backend handles validation
- **HTTPS Mandatory**: All login endpoints must use HTTPS (Secure flag requires it)

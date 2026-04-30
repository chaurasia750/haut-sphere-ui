# Contract: Authentication Request

**Endpoint**: `POST /auth/login`  
**Protocol**: HTTPS (required)  
**Authentication**: None (this IS authentication)  
**Content-Type**: `application/json`

## Request Format

```typescript
interface AuthLoginRequest {
  email: string;        // Required, valid email format
  password: string;     // Required, min 1 character
}
```

## Example Request

```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secretpassword"
  }'
```

## Validation Rules

| Field | Type | Required | Format | Constraint |
|-------|------|----------|--------|-----------|
| email | string | Yes | Email regex | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` |
| password | string | Yes | Any (HTTPS) | Min 1 char (frontend); backend enforces stricter |

## Error Responses

**400 Bad Request** - Missing or invalid fields:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid email or missing password",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized** - Invalid credentials:
```json
{
  "code": "AUTH_FAILED",
  "message": "Invalid email or password"
}
```

**500 Internal Server Error**:
```json
{
  "code": "SERVER_ERROR",
  "message": "An error occurred during authentication"
}
```

## Frontend Implementation Example

```typescript
// Angular HttpClient
this.http.post<AuthResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password'
}).subscribe(
  (response) => {
    // Response includes roleId; cookies set by backend
    console.log('Logged in as role:', response.roleId);
  },
  (error) => {
    // Handle error
  }
);
```

## Security Considerations

- **HTTPS Only**: No plain HTTP
- **Password Never Logged**: Backend must not log plaintext passwords
- **Rate Limiting**: Backend should limit login attempts per IP/email
- **No Token in Request**: Frontend doesn't send tokens (this IS the login request)
- **CSRF Protection**: POST endpoint uses SameSite cookies (backend responsibility)

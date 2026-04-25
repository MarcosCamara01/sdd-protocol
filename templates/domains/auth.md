# Domain: Auth

## Responsibility

Authentication and session management.

## Boundaries

- Owns: login, logout, session tokens, password reset flows
- Does NOT own: user profile data, role-based permissions (see roles domain)

## Key Concepts

- **Session**: short-lived token, validated server-side on every request
- **Refresh token**: long-lived, rotated on use
- **Auth state**: derived on the server per request — never trusted from client payload

## Critical Rules

- Never log tokens, passwords, or raw session data
- Validate session on the server before acting on user identity — never trust client-supplied user IDs
- Auth failures return generic errors to the client (no user enumeration)
- Password reset tokens are single-use and expire

## Files

<!-- List key files once the domain is built:
- lib/auth/session.ts
- app/_actions/auth.ts
- middleware.ts
-->

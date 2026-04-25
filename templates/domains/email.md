# Domain: Email / Notifications

## Responsibility

Transactional emails and in-app notifications.

## Boundaries

- Owns: email templates, notification dispatch, delivery status
- Does NOT own: user preferences for notification opt-in/out (see user-preferences domain)

## Key Concepts

- **Transactional email**: triggered by a user action (welcome, reset, receipt)
- **Delivery status**: sent → delivered → opened, tracked via provider webhooks

## Critical Rules

- Send emails via a queue — never block a request on email delivery
- Marketing emails must include an unsubscribe link (CAN-SPAM / GDPR)
- Never include sensitive data (tokens, PII) in email subject lines
- Delivery failures are non-fatal — log and alert, don't crash the originating flow

## Files

<!-- List key files once the domain is built:
- lib/email/client.ts
- lib/email/templates/
- app/_actions/notifications.ts
-->

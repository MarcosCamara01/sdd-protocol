# Domain: Payments

## Responsibility

Payment processing, subscriptions, and billing.

## Boundaries

- Owns: payment intents, subscriptions, invoices, provider webhooks
- Does NOT own: user accounts, product catalog

## Key Concepts

- **Payment Intent**: server-side object representing a charge attempt
- **Webhook**: provider event — must be verified with signature before processing
- **Idempotency key**: required on every payment mutation to prevent double-charges

## Critical Rules

- Never log card data, raw tokens, or payment provider secrets
- Always verify webhook signatures before processing events
- Include an idempotency key on every payment mutation
- Use server-side API keys only — never expose secret keys to the client
- Failed payments are events to handle, not errors to throw

## Files

<!-- List key files once the domain is built:
- lib/payments/stripe.ts
- app/api/webhooks/stripe/route.ts
- app/_actions/payments.ts
-->

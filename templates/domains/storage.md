# Domain: Storage

## Responsibility

File upload, storage, and retrieval.

## Boundaries

- Owns: upload flows, signed URLs, file metadata
- Does NOT own: access permissions (enforced via storage policies), rendering/display

## Key Concepts

- **Signed URL**: temporary, scoped URL for accessing or uploading a file
- **Bucket**: top-level container — one per access pattern (public vs. private)
- **Storage policy**: access rules applied at the storage layer — always configured

## Critical Rules

- Private files are always served via signed URLs, never direct bucket access
- Validate file type and size on the server, not just the client
- Storage policies must match the application-level permission model
- Scan or validate uploads before making them accessible to other users

## Files

<!-- List key files once the domain is built:
- lib/storage/client.ts
- app/_actions/upload.ts
-->

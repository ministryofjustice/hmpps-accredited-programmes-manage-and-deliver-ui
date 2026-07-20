import { createHash } from 'crypto'

// Usernames are staff identifiers and treated as PII - hash them before sending to Sentry
// so events can still be correlated per-user without exposing the real username.
export default function hashUsername(username: string): string {
  return createHash('sha256').update(username).digest('hex')
}

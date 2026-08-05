// Lightweight, dependency-free hashing for the admin password.
//
// NOTE: This is a fully static, client-side application. Any credential check
// that runs in the browser is inherently visible to a determined user, so this
// hash only protects against casual/shoulder-surfing access — it is NOT a
// substitute for real server-side authentication. The README documents how to
// upgrade to Firebase Authentication + Firestore rules for production use.

export function hashPassword(password: string): string {
  // FNV-1a 32-bit — small, fast, good enough for an obfuscated local check.
  let hash = 0x811c9dc5;
  for (let i = 0; i < password.length; i++) {
    hash ^= password.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Mix in a fixed salt so the stored value is not a raw string hash.
  return `sd1$${(hash >>> 0).toString(16)}$${password.length}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Token utility functions for handling JWT tokens
 */

/**
 * Decode the JWT token to extract expiry information
 * This is a simplified decoder that doesn't validate signatures
 */
export function decodeJwtToken(token: string): { exp?: number } | null {
  try {
    // JWT tokens are base64 encoded in three parts: header.payload.signature
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    // Decode the base64 payload
    const payloadString = Buffer.from(payloadBase64, "base64").toString(
      "utf-8"
    );
    const payload = JSON.parse(payloadString);
    return payload;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwtToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTimestamp;
}

import { customAlphabet } from 'nanoid';

/**
 * Generates a unique referral code
 * Format: VOICE + 7 random alphanumeric characters (uppercase)
 * Example: VOICEA1B2C3
 */
export function generateReferralCode(): string {
  // Custom alphabet excluding ambiguous characters (0, O, I, l)
  const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 7);
  return `DBV${nanoid()}`;
}

/**
 * Validates a referral code format
 */
export function isValidReferralCode(code: string): boolean {
  // Check if code starts with VOICE and has 7 alphanumeric characters after
  const pattern = /^DBV[123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/;
  return pattern.test(code);
}

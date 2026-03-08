import axios from 'axios';

// API base URL - defaults to same host in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface WaitlistUser {
  email: string;
  referralCode: string;
  queuePosition: number;
  referralCount: number;
}

export interface JoinWaitlistResponse {
  success: boolean;
  user: WaitlistUser;
}

export interface WaitlistStats {
  totalSignups: number;
  totalReferrals: number;
}

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  queuePosition: number;
  positionImprovement: number;
}

// API Methods

/**
 * Join the waitlist
 */
export async function joinWaitlist(
  email: string,
  referredBy?: string
): Promise<JoinWaitlistResponse> {
  const response = await api.post<JoinWaitlistResponse>('/waitlist', {
    email,
    referredBy,
  });
  return response.data;
}

/**
 * Get user info by referral code
 */
export async function getUserByCode(code: string): Promise<WaitlistUser> {
  const response = await api.get<{ user: WaitlistUser }>(`/waitlist?code=${code}`);
  return response.data.user;
}

/**
 * Get global waitlist statistics
 */
export async function getGlobalStats(): Promise<WaitlistStats> {
  const response = await api.get<{ stats: WaitlistStats }>('/waitlist?stats=global');
  return response.data.stats;
}

/**
 * Get referral statistics for a code
 */
export async function getReferralStats(code: string): Promise<ReferralStats> {
  const response = await api.get<{ stats: ReferralStats }>(`/referral?code=${code}&stats=true`);
  return response.data.stats;
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  const response = await api.get<{ status: string; timestamp: string }>('/health');
  return response.data;
}

export default api;

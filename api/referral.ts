import type { VercelRequest, VercelResponse } from '@vercel/node';
import { count, eq } from 'drizzle-orm';

import { db, referrals, waitlistUsers } from '../server/db/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, stats, list } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Referral code is required' });
    }

    // Get the user with this referral code
    const [user] = await db
      .select()
      .from(waitlistUsers)
      .where(eq(waitlistUsers.referralCode, code))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'Referral code not found' });
    }

    // GET /api/referral?code=XXX&stats=true - Get referral stats
    if (stats === 'true') {
      const userReferrals = await db
        .select({ count: count() })
        .from(referrals)
        .where(eq(referrals.referrerCode, code));

      return res.json({
        stats: {
          referralCode: user.referralCode,
          totalReferrals: userReferrals[0]?.count || 0,
          queuePosition: user.queuePosition,
          positionImprovement: Math.max(0, user.queuePosition - (userReferrals[0]?.count || 0) * 5),
        },
      });
    }

    // GET /api/referral?code=XXX&list=true - Get referral list
    if (list === 'true') {
      const userReferrals = await db
        .select({
          createdAt: referrals.createdAt,
        })
        .from(referrals)
        .where(eq(referrals.referrerCode, code))
        .orderBy(referrals.createdAt);

      return res.json({
        referrals: userReferrals.map((ref) => ({
          createdAt: ref.createdAt,
        })),
      });
    }

    // Default GET response - show available endpoints
    return res.status(200).json({
      message: 'Referral API',
      endpoints: {
        'GET /api/referral?code=XXX&stats=true': 'Get referral statistics for a code',
        'GET /api/referral?code=XXX&list=true': 'Get list of referrals for a code',
      },
      usage: 'Please provide code parameter with either stats=true or list=true',
      example: '/api/referral?code=VOICEABC123&stats=true',
    });
  } catch (error) {
    console.error('Referral API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

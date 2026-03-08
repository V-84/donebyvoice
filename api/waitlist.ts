import type { VercelRequest, VercelResponse } from '@vercel/node';
import { count, eq } from 'drizzle-orm';

import { db, referrals, waitlistUsers } from '../server/db/serverless.js';
import { generateReferralCode } from '../server/utils/codeGenerator.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST /api/waitlist - Join waitlist
    if (req.method === 'POST') {
      const { email, referredBy } = req.body;

      // Validate email
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }

      // Check if email already exists
      const existingUser = await db
        .select()
        .from(waitlistUsers)
        .where(eq(waitlistUsers.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(409).json({
          error: 'Email already registered',
          user: {
            email: existingUser[0].email,
            referralCode: existingUser[0].referralCode,
            queuePosition: existingUser[0].queuePosition,
            referralCount: existingUser[0].referralCount,
          },
        });
      }

      // Generate unique referral code
      let referralCode = generateReferralCode();
      let isUnique = false;

      while (!isUnique) {
        const existing = await db
          .select()
          .from(waitlistUsers)
          .where(eq(waitlistUsers.referralCode, referralCode))
          .limit(1);

        if (existing.length === 0) {
          isUnique = true;
        } else {
          referralCode = generateReferralCode();
        }
      }

      // Get current total count for queue position
      const totalCount = await db.select({ count: count() }).from(waitlistUsers);
      const queuePosition = (totalCount[0]?.count || 0) + 1;

      // Create new waitlist user
      const [newUser] = await db
        .insert(waitlistUsers)
        .values({
          email,
          referralCode,
          referredBy: referredBy || null,
          queuePosition,
        })
        .returning();

      // If user was referred, create referral record and update referrer
      if (referredBy) {
        const [referrer] = await db
          .select()
          .from(waitlistUsers)
          .where(eq(waitlistUsers.referralCode, referredBy))
          .limit(1);

        if (referrer) {
          // Create referral record
          await db.insert(referrals).values({
            referrerCode: referredBy,
            referredEmail: email,
          });

          // Update referrer's referral count and queue position
          const newReferralCount = referrer.referralCount + 1;
          const positionBoost = Math.min(newReferralCount * 5, 50);
          const newPosition = Math.max(1, referrer.queuePosition - positionBoost);

          await db
            .update(waitlistUsers)
            .set({
              referralCount: newReferralCount,
              queuePosition: newPosition,
              updatedAt: new Date(),
            })
            .where(eq(waitlistUsers.id, referrer.id));
        }
      }

      return res.status(201).json({
        success: true,
        user: {
          email: newUser.email,
          referralCode: newUser.referralCode,
          queuePosition: newUser.queuePosition,
          referralCount: newUser.referralCount,
        },
      });
    }

    // GET /api/waitlist?code=XXX - Get user by code
    if (req.method === 'GET' && req.query.code) {
      const code = req.query.code as string;

      const [user] = await db
        .select()
        .from(waitlistUsers)
        .where(eq(waitlistUsers.referralCode, code))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({
        user: {
          email: user.email,
          referralCode: user.referralCode,
          queuePosition: user.queuePosition,
          referralCount: user.referralCount,
          createdAt: user.createdAt,
        },
      });
    }

    // GET /api/waitlist?stats=global - Get global stats
    if (req.method === 'GET' && req.query.stats === 'global') {
      const totalUsers = await db.select({ count: count() }).from(waitlistUsers);
      const totalReferrals = await db.select({ count: count() }).from(referrals);

      return res.json({
        stats: {
          totalSignups: totalUsers[0]?.count || 0,
          totalReferrals: totalReferrals[0]?.count || 0,
        },
      });
    }

    // GET /api/waitlist - List all endpoints
    if (req.method === 'GET') {
      return res.status(200).json({
        message: 'Waitlist API',
        endpoints: {
          'POST /api/waitlist': 'Join waitlist with email (body: {email, referredBy?})',
          'GET /api/waitlist?code=XXX': 'Get user by referral code',
          'GET /api/waitlist?stats=global': 'Get global waitlist statistics',
        },
        usage: 'Please provide query parameters: ?code=XXX or ?stats=global',
      });
    }

    // Handle unsupported methods
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST'],
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

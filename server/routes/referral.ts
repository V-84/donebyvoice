import { count, eq } from 'drizzle-orm';
import { Router } from 'express';

import { db } from '../db';
import { referrals, waitlistUsers } from '../db/schema';

const router = Router();

/**
 * GET /api/referral/:code/stats
 * Get referral statistics for a specific referral code
 */
router.get('/:code/stats', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Get the user with this referral code
    const [user] = await db
      .select()
      .from(waitlistUsers)
      .where(eq(waitlistUsers.referralCode, code))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        error: 'Referral code not found',
      });
    }

    // Get all referrals made with this code
    const userReferrals = await db
      .select({ count: count() })
      .from(referrals)
      .where(eq(referrals.referrerCode, code));

    res.json({
      stats: {
        referralCode: user.referralCode,
        totalReferrals: userReferrals[0]?.count || 0,
        queuePosition: user.queuePosition,
        positionImprovement: Math.max(0, user.queuePosition - (userReferrals[0]?.count || 0) * 5),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/referral/:code/list
 * Get list of all referrals for a specific code (without email details for privacy)
 */
router.get('/:code/list', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Verify the referral code exists
    const [user] = await db
      .select()
      .from(waitlistUsers)
      .where(eq(waitlistUsers.referralCode, code))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        error: 'Referral code not found',
      });
    }

    // Get all referrals with timestamps (email masked for privacy)
    const userReferrals = await db
      .select({
        createdAt: referrals.createdAt,
      })
      .from(referrals)
      .where(eq(referrals.referrerCode, code))
      .orderBy(referrals.createdAt);

    res.json({
      referrals: userReferrals.map((ref) => ({
        createdAt: ref.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;

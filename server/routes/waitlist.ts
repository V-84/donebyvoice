import { count, eq } from 'drizzle-orm';
import { Router } from 'express';

import { db } from '../db';
import { referrals, waitlistUsers } from '../db/schema';
import { emailSchema, validate } from '../middleware/validation';
import { generateReferralCode } from '../utils/codeGenerator';

const router = Router();

/**
 * POST /api/waitlist
 * Join the waitlist with an email
 */
router.post('/', validate(emailSchema), async (req, res, next) => {
  try {
    const { email, referredBy } = req.body;

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
        const positionBoost = Math.min(newReferralCount * 5, 50); // Max 50 spots boost
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

    res.status(201).json({
      success: true,
      user: {
        email: newUser.email,
        referralCode: newUser.referralCode,
        queuePosition: newUser.queuePosition,
        referralCount: newUser.referralCount,
      },
    });
  } catch (error) {
    console.log('🔥', error)
    next(error);
  }
});

/**
 * GET /api/waitlist/:code
 * Get user information by referral code
 */
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    const [user] = await db
      .select()
      .from(waitlistUsers)
      .where(eq(waitlistUsers.referralCode, code))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      user: {
        email: user.email,
        referralCode: user.referralCode,
        queuePosition: user.queuePosition,
        referralCount: user.referralCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/waitlist/stats/global
 * Get global waitlist statistics
 */
router.get('/stats/global', async (_req, res, next) => {
  try {
    const totalUsers = await db
      .select({ count: count() })
      .from(waitlistUsers);

    const totalReferrals = await db
      .select({ count: count() })
      .from(referrals);

    res.json({
      stats: {
        totalSignups: totalUsers[0]?.count || 0,
        totalReferrals: totalReferrals[0]?.count || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

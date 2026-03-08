import { pgTable, serial, varchar, timestamp, integer, index } from 'drizzle-orm/pg-core';

/**
 * Waitlist Users Table
 * Stores all users who have signed up for early access
 */
export const waitlistUsers = pgTable(
  'waitlist_users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    referralCode: varchar('referral_code', { length: 10 }).notNull().unique(),
    referredBy: varchar('referred_by', { length: 10 }),
    referralCount: integer('referral_count').notNull().default(0),
    queuePosition: integer('queue_position').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    referralCodeIdx: index('referral_code_idx').on(table.referralCode),
    queuePositionIdx: index('queue_position_idx').on(table.queuePosition),
  })
);

/**
 * Referrals Table
 * Tracks the relationship between referrers and referred users
 */
export const referrals = pgTable(
  'referrals',
  {
    id: serial('id').primaryKey(),
    referrerCode: varchar('referrer_code', { length: 10 }).notNull(),
    referredEmail: varchar('referred_email', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    referrerCodeIdx: index('referrer_code_idx').on(table.referrerCode),
  })
);

// Type exports for use in application
export type WaitlistUser = typeof waitlistUsers.$inferSelect;
export type NewWaitlistUser = typeof waitlistUsers.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;

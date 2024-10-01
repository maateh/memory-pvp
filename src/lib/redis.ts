import { Redis } from "@upstash/redis"

/**
 * Vercel cron jobs are limited to run once in a day.
 * 
 * In hobby tier, I can have two cron jobs which means
 * in every 12 hour I can trigger the redis store backup
 * API endpoint (/api/cron/save-sessions) so the 43200
 * seconds (12 hour) + 60 seconds (to be sure) should be
 * okay to prevent any session data loss.
 */
export const SESSION_STORE_TTL = 43200 + 60

export const redis = Redis.fromEnv()

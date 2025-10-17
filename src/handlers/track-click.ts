import { randomUUID } from 'crypto';
import { recordClick, getDatabase } from '../lib/database.js';
import { logger } from '../lib/logger.js';

/**
 * Track ad click
 */
export async function handleAdClick(
  impressionId: string,
  clickUrl: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    logger.info('Processing ad click', { impressionId, userId });

    // Verify impression exists
    const db = getDatabase();
    const impression = await db.get(
      'SELECT * FROM ad_impressions WHERE id = ?',
      [impressionId]
    );

    if (!impression) {
      logger.warn('Impression not found', { impressionId });
      return {
        success: false,
        error: 'Impression not found',
      };
    }

    // Record click
    const clickId = randomUUID();
    await recordClick({
      id: clickId,
      impressionId,
      adUnitId: impression.ad_unit_id,
      userId,
      sessionId: impression.session_id,
      clickUrl,
      revenue: 0, // Can be updated later with actual revenue
    });

    logger.info('Ad click recorded', { clickId, impressionId });

    return { success: true };
  } catch (error) {
    logger.error('Failed to handle ad click', { error, impressionId });
    return {
      success: false,
      error: 'Internal server error',
    };
  }
}

import { randomUUID } from 'crypto';
import { recordImpression } from '../lib/database.js';
import { requestAd as requestGoogleAd } from '../lib/google-ads.js';
import { requestMockAd } from '../lib/mock-google-ads.js';
import { AD_CONFIG } from '../config/ads.js';
import { logger } from '../lib/logger.js';
import type { AdRequest, AdResponse } from '../types/index.js';

/**
 * Request an ad from Google Ads (or mock)
 */
export async function handleAdRequest(request: AdRequest, userId?: string): Promise<AdResponse> {
  try {
    logger.info('Processing ad request', { request, userId });

    // Use mock or real Google Ads based on configuration
    const adResponse = AD_CONFIG.mock.enabled
      ? await requestMockAd(request)
      : await requestGoogleAd(request);

    if (!adResponse.success || !adResponse.ad) {
      logger.warn('No ad returned', { request });
      return adResponse;
    }

    // Record impression in database
    try {
      await recordImpression({
        id: adResponse.ad.impressionId,
        adUnitId: adResponse.ad.id,
        userId,
        sessionId: request.sessionId,
        page: request.page,
        deviceType: request.deviceType || 'desktop',
        userAgent: '', // Will be filled from request headers
      });
    } catch (error) {
      logger.error('Failed to record impression', { error });
      // Continue even if recording fails
    }

    return adResponse;
  } catch (error) {
    logger.error('Failed to handle ad request', { error, request });
    return {
      success: false,
      error: 'Internal server error',
    };
  }
}

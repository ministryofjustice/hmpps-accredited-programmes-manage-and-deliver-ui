import { Request, Response } from 'express'

import logger from '../../logger'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'

export default class OnboardingController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  private static readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  private static parseReferralIds(value: unknown): string[] {
    if (typeof value === 'string') {
      return value
        .split(/[\s,]+/)
        .map(id => id.trim())
        .filter(Boolean)
    }

    if (Array.isArray(value)) {
      return value.flatMap(item => OnboardingController.parseReferralIds(item)).filter(Boolean)
    }

    return []
  }

  private static getInvalidReferralIds(referralIds: string[]): string[] {
    return referralIds.filter(id => !OnboardingController.uuidRegex.test(id))
  }

  async fetchPersonalDetailsForReferrals(req: Request, res: Response): Promise<void> {
    const referralIds = OnboardingController.parseReferralIds(req.query.referralId)

    if (!referralIds.length) {
      res.status(400).send('referralId must include at least one UUID')
      return
    }

    const invalidReferralIds = OnboardingController.getInvalidReferralIds(referralIds)
    if (invalidReferralIds.length) {
      logger.warn(
        {
          username: req.user.username,
          requestId: req.id,
          invalidReferralIds,
        },
        '[OnboardingController] Invalid referral IDs provided for onboarding refresh',
      )
      res.status(400).send('referralId must be a UUID. Repeat the query parameter for multiple IDs.')
      return
    }

    logger.info(
      {
        username: req.user.username,
        requestId: req.id,
        referralIdCount: referralIds.length,
      },
      '[OnboardingController] Triggering personal details refresh',
    )

    const response = await this.accreditedProgrammesManageAndDeliverService.fetchPersonalDetailsForReferrals(
      req.user.username,
      referralIds,
    )

    logger.info(
      {
        username: req.user.username,
        requestId: req.id,
        referralIdCount: referralIds.length,
        successCount: response.successIds.length,
        notFoundCount: response.notFoundIds.length,
        failureCount: response.failureIds.length,
      },
      '[OnboardingController] Personal details refresh completed',
    )

    res.status(200).json(response)
  }
}

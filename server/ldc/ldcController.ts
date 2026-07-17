import { ReferralDetails } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import UpdateLdcPresenter from './updateLdcPresenter'
import UpdateLdcView from './updateLdcView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'
import logger from '../../logger'
import sendAuditEvent from '../services/auditService'
import { getReferralOriginPage } from '../utils/referralOriginPage'

export default class LdcController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showChangeLdcPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params as Record<string, string>
    const { username } = req.user
    const originPage = getReferralOriginPage(req, referralId)
    const referralDetails: ReferralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    if (req.method === 'POST') {
      await sendAuditEvent('EDIT_REFERRAL_LDC', username, referralDetails?.crn, 'CRN', {
        referralId,
        hasLdc: req.body.hasLdc,
      })
      await this.accreditedProgrammesManageAndDeliverService.updateLdc(username, referralId, req.body.hasLdc)
      logger.info(
        {
          event: 'OVERRIDE_LDC',
          referralId,
          pdu: referralDetails?.pdu,
          user: username,
          userRegion: req.session.userRegion?.regionDescription ?? '',
        },
        'LDC updated',
      )
      return res.redirect(`${originPage}?isLdcUpdated=true`)
    }

    await sendAuditEvent('VIEW_UPDATE_LDC', username, referralDetails?.crn, 'CRN', {
      referralId,
    })

    const presenter = new UpdateLdcPresenter(referralId, referralDetails, originPage)
    const view = new UpdateLdcView(presenter)

    return this.renderPage(res, view, referralDetails)
  }
}

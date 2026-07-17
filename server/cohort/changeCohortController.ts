import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ChangeCohortForm from './changeCohortForm'
import ChangeCohortPresenter from './changeCohortPresenter'
import ChangeCohortView from './changeCohortView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'
import logger from '../../logger'
import sendAuditEvent from '../services/auditService'
import { getReferralOriginPage } from '../utils/referralOriginPage'

export default class ChangeCohortController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showChangeCohortPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params as Record<string, string>
    const { username } = req.user
    const originPage = getReferralOriginPage(req, referralId)

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    if (req.method === 'POST') {
      const data = await new ChangeCohortForm(req, referralId).data()
      await sendAuditEvent('EDIT_REFERRAL_COHORT', username, referralDetails?.crn, 'CRN', {
        referralId,
        cohort: data.paramsForUpdate.updatedCohort,
      })
      await this.accreditedProgrammesManageAndDeliverService.updateCohort(
        username,
        referralId,
        data.paramsForUpdate.updatedCohort,
      )
      logger.info(
        {
          event: 'OVERRIDE_COHORT',
          referralId,
          pdu: referralDetails?.pdu,
          user: username,
          userRegion: req.session.userRegion?.regionDescription ?? '',
        },
        'Updated cohort for referral',
      )

      return res.redirect(`${originPage}?isCohortUpdated=true`)
    }

    await sendAuditEvent('VIEW_UPDATE_COHORT', username, referralDetails?.crn, 'CRN', {
      referralId,
    })

    const presenter = new ChangeCohortPresenter(referralId, referralDetails, originPage)
    const view = new ChangeCohortView(presenter)

    return this.renderPage(res, view, referralDetails)
  }
}

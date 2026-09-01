import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../../utils/controllerUtils'
import { FormValidationError } from '../../utils/formValidationError'
import logger from '../../../logger'
import sendAuditEvent from '../../services/auditService'
import ForceStatusForm from './forceStatusForm'
import ForceStatusLookupForm from './forceStatusLookupForm'
import ForceStatusLookupPresenter from './forceStatusLookupPresenter'
import ForceStatusLookupView from './forceStatusLookupView'
import ForceStatusPresenter from './forceStatusPresenter'
import ForceStatusView from './forceStatusView'

export default class ForceStatusController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showLookupReferralPage(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    let userInputData: Record<string, unknown> | null = null

    if (req.method === 'POST') {
      const data = await new ForceStatusLookupForm(req).data()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        return res.redirect(`/admin/force-status/${data.paramsForUpdate.referralId}`)
      }
    }

    const presenter = new ForceStatusLookupPresenter(formError, userInputData)
    const view = new ForceStatusLookupView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showForceStatusPage(req: Request, res: Response): Promise<void> {
    res.set('Cache-Control', 'no-store')

    const { referralId } = req.params as Record<string, string>
    const { username } = req.user

    const formData = await this.accreditedProgrammesManageAndDeliverService.getForceStatusFormData(username, referralId)

    let formError: FormValidationError | null = null
    let userInputData: Record<string, unknown> | null = null

    if (req.method === 'POST') {
      const data = await new ForceStatusForm(req).data()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await sendAuditEvent('ADMIN_FORCE_UPDATE_REFERRAL_STATUS', username, formData.crn, 'CRN', {
          referralId,
          updatedStatusId: data.paramsForUpdate.referralStatusDescriptionId,
        })
        const response = await this.accreditedProgrammesManageAndDeliverService.forceUpdateStatus(
          username,
          referralId,
          data.paramsForUpdate,
        )
        logger.info(
          { event: 'ADMIN_FORCE_UPDATE_REFERRAL_STATUS', referralId, user: username },
          'Referral status force-updated',
        )
        return res.redirect(`/admin/force-status/${referralId}?message=${encodeURIComponent(response.message)}`)
      }
    }

    const successMessage = typeof req.query.message === 'string' ? req.query.message : null

    const presenter = new ForceStatusPresenter(formData, formError, userInputData, successMessage)
    const view = new ForceStatusView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

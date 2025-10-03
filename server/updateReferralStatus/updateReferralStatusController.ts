import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import UpdateReferralStatusView from './updateReferralStatusView'
import UpdateReferralStatusForm from './updateReferralStatusForm'
import { FormValidationError } from '../utils/formValidationError'

export default class UpdateReferralStatusController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const statusDetails = await this.accreditedProgrammesManageAndDeliverService.getStatusDetails(referralId, username)

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new UpdateReferralStatusForm(req).data()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await this.accreditedProgrammesManageAndDeliverService.updateStatus(username, referralId, data.paramsForUpdate)
        return res.redirect(`/referral-details/${referralId}/status-history?statusUpdated=true`)
      }
    }

    const presenter = new UpdateReferralStatusPresenter(
      referralDetails,
      statusDetails,
      formError,
      userInputData,
      req.session.originPage,
    )
    const view = new UpdateReferralStatusView(presenter)
    req.session.originPage = req.path
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

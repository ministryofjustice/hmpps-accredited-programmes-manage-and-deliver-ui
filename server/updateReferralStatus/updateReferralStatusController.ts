import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import UpdateReferralStatusView from './updateReferralStatusView'

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

    const presenter = new UpdateReferralStatusPresenter(referralDetails)

    const view = new UpdateReferralStatusView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

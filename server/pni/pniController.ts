import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import PniPresenter from './pniPresenter'
import ControllerUtils from '../utils/controllerUtils'
import PniView from './pniView'

export default class PniController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showProgrammeNeedsIdentifierPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )
    const pniScore = await this.accreditedProgrammesManageAndDeliverService.getPniScore(username, referralDetails.crn)

    const presenter = new PniPresenter(referralId, referralDetails, pniScore)
    const view = new PniView(presenter)

    ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

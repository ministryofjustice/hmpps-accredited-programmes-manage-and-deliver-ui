import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ProgrammeNeedsIdentifierPresenter from './programmeNeedsIdentifierPresenter'
import ControllerUtils from '../utils/controllerUtils'
import ProgrammeNeedsIdentifierView from './programmeNeedsIdentifierView'

export default class ProgrammeNeedsIdentifierController {
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

    const presenter = new ProgrammeNeedsIdentifierPresenter(referralId, referralDetails)
    const view = new ProgrammeNeedsIdentifierView(presenter)

    ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

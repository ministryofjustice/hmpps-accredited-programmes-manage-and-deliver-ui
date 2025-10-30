import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import GroupAllocationNotesPresenter from './groupAllocationNotesPresenter'
import GroupAllocationNotesView from './groupAllocationNotesView'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'

export default class GroupAllocationNotesController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showGroupAllocationNotesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const presenter = new GroupAllocationNotesPresenter(
      referralDetails,
      isCohortUpdated === 'true',
      isLdcUpdated === 'true',
    )
    const view = new GroupAllocationNotesView(presenter)
    ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

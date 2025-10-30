import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import MotivationBackgroundAndNonAssociationsView from './motivationBackgroundAndNonAssociations/motivationBackgroundAndNonAssociationsView'
import MotivationBackgroundAndNonAssociationsPresenter from './motivationBackgroundAndNonAssociations/motivationBackgroundAndNonAssociationsPresenter'

export default class GroupAllocationNotesController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showMotivationBackgroundAndNonAssociationsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const presenter = new MotivationBackgroundAndNonAssociationsPresenter(
      referralDetails,
      'motivationBackgroundAndNonAssociations',
      isCohortUpdated === 'true',
      isLdcUpdated === 'true',
    )
    const view = new MotivationBackgroundAndNonAssociationsView(presenter)
    ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

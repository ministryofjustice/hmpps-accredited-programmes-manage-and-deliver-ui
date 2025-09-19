import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import ChangeCohortPresenter from './changeCohortPresenter'
import ChangeCohortView from './changeCohortView'
import ChangeCohortForm from './changeCohortForm'

export default class ChangeCohortController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showChangeCohortPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    if (req.method === 'POST') {
      const data = await new ChangeCohortForm(req, referralId).data()
      await this.accreditedProgrammesManageAndDeliverService.updateCohort(
        username,
        referralId,
        data.paramsForUpdate.updatedCohort,
      )
      return res.redirect(`/referral-details/${referralId}/personal-details?isCohortUpdated=true`)
    }

    const presenter = new ChangeCohortPresenter(referralId, referralDetails, req.session.originPage)
    const view = new ChangeCohortView(presenter)

    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

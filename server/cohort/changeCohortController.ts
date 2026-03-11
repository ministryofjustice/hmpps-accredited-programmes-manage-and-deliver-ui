import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import ChangeCohortForm from './changeCohortForm'
import ChangeCohortPresenter from './changeCohortPresenter'
import ChangeCohortView from './changeCohortView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'

export default class ChangeCohortController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

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
      return res.redirect(`${req.session.originPage}?isCohortUpdated=true`)
    }

    const presenter = new ChangeCohortPresenter(referralId, referralDetails, req.session.originPage)
    const view = new ChangeCohortView(presenter)

    return this.renderPage(res, view, referralDetails)
  }
}

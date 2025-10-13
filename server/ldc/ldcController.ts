import { ReferralDetails } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import UpdateLdcPresenter from './updateLdcPresenter'
import UpdateLdcView from './updateLdcView'

export default class LdcController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showChangeLdcPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const referralDetails: ReferralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    if (req.method === 'POST') {
      await this.accreditedProgrammesManageAndDeliverService.updateLdc(username, referralId, req.body.hasLdc)
      return res.redirect(`${req.session.originPage}?isLdcUpdated=true`)
    }

    const presenter = new UpdateLdcPresenter(referralId, referralDetails, req.session.originPage)
    const view = new UpdateLdcView(presenter)

    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}

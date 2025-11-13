import { Request, Response } from 'express'
import ControllerUtils from '../../utils/controllerUtils'
import { FormValidationError } from '../../utils/formValidationError'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import RemoveFromGroupForm from './removeFromGroupForm'
import RemoveFromGroupPresenter from './removeFromGroupPresenter'
import RemoveFromGroupView from './removeFromGroupView'
import RemoveFromGroupUpdateStatusPresenter from './removeFromGroupUpdateStatusPresenter'
import RemoveFromGroupUpdateStatusView from './removeFromGroupUpdateStatusView'

export default class RemoveFromGroupController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async removeFromGroup(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    const { groupId, referralId } = req.params
    if (req.method === 'POST') {
      const data = await new RemoveFromGroupForm(req).removeFromGroupData()

      if (data.error) {
        res.status(400)
        formError = data.error
      } else if (data.paramsForUpdate.removeFromGroup.toLowerCase() === 'yes') {
        req.session.groupManagementData.removeFromGroup = true
        return res.redirect(`/removeFromGroup/${groupId}/${referralId}/updateStatus`)
      } else {
        return res.redirect(req.session.originPage)
      }
    }

    const userInputData = req.session.groupManagementData.removeFromGroup ? { 'remove-from-group': 'yes' } : null

    const presenter = new RemoveFromGroupPresenter(
      groupId,
      req.session.groupManagementData,
      req.session.originPage,
      formError,
      userInputData,
    )
    const view = new RemoveFromGroupView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async removeFromGroupUpdateStatus(req: Request, res: Response): Promise<void> {
    const { groupId, referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const statusDetails = await this.accreditedProgrammesManageAndDeliverService.getStatusDetails(referralId, username)

    let formError: FormValidationError | null = null
    let userInputData = null
    if (req.method === 'POST') {
      const data = await new RemoveFromGroupForm(req).removeFromGroupUpdateStatusData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        return res.redirect(req.session.originPage)
      }
    }

    const presenter = new RemoveFromGroupUpdateStatusPresenter(
      referralDetails,
      statusDetails,
      `/removeFromGroup/${groupId}/${referralId}`,
      formError,
      userInputData,
    )

    const view = new RemoveFromGroupUpdateStatusView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

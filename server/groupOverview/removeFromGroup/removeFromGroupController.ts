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
    const { groupId, referralId } = req.params as { groupId: string; referralId: string }
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
    const { groupId, referralId } = req.params as { groupId: string; referralId: string }
    const { username } = req.user

    let formError: FormValidationError | null = null
    let userInputData = null
    if (req.method === 'POST') {
      const data = await new RemoveFromGroupForm(req).removeFromGroupUpdateStatusData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const response = await this.accreditedProgrammesManageAndDeliverService.removeFromGroup(
          username,
          referralId,
          groupId,
          data.paramsForUpdate,
        )
        const { message } = response
        return res.redirect(`/group/${groupId}/allocated?message=${encodeURIComponent(message)}`)
      }
    }

    const statusDetails = await this.accreditedProgrammesManageAndDeliverService.removeFromGroupStatusTransitions(
      referralId,
      username,
    )

    const presenter = new RemoveFromGroupUpdateStatusPresenter(
      groupId,
      statusDetails,
      `/removeFromGroup/${groupId}/${referralId}`,
      req.session.groupManagementData,
      formError,
      userInputData,
    )

    const view = new RemoveFromGroupUpdateStatusView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

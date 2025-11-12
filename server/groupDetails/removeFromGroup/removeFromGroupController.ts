import { Request, Response } from 'express'
import ControllerUtils from '../../utils/controllerUtils'
import { FormValidationError } from '../../utils/formValidationError'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import RemoveFromGroupForm from './removeFromGroupForm'
import RemoveFromGroupPresenter from './removeFromGroupPresenter'
import RemoveFromGroupView from './removeFromGroupView'

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
        return res.redirect(`/`)
      } else {
        return res.redirect(req.session.originPage)
      }
    }

    const presenter = new RemoveFromGroupPresenter(
      groupId,
      req.session.groupManagementData,
      req.session.originPage,
      formError,
    )
    const view = new RemoveFromGroupView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

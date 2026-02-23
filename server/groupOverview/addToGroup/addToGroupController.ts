import { Request, Response } from 'express'
import ControllerUtils from '../../utils/controllerUtils'
import AddToGroupPresenter from './addToGroupPresenter'
import AddToGroupView from './addToGroupView'
import AddToGroupMoreDetailsPresenter from './addToGroupMoreDetailsPresenter'
import AddToGroupMoreDetailsView from './addToGroupMoreDetailsView'
import { FormValidationError } from '../../utils/formValidationError'
import AddToGroupForm from './addToGroupForm'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'

export default class AddToGroupController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async addToGroup(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    const { groupId, referralId } = req.params as { groupId: string; referralId: string }

    if (req.method === 'POST') {
      const data = await new AddToGroupForm(req).addToGroupData()

      if (data.error) {
        res.status(400)
        formError = data.error
      } else if (data.paramsForUpdate.addToGroup.toLowerCase() === 'yes') {
        return res.redirect(`/addToGroup/${groupId}/${referralId}/moreDetails`)
      } else {
        return res.redirect(req.session.originPage)
      }
    }

    const presenter = new AddToGroupPresenter(
      groupId,
      req.session.groupManagementData,
      req.session.originPage,
      formError,
    )
    const view = new AddToGroupView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async addToGroupMoreDetails(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    let userInputData = null
    const { groupId, referralId } = req.params as { groupId: string; referralId: string }
    const { username } = req.user

    if (req.method === 'POST') {
      const data = await new AddToGroupForm(req).addToGroupMoreDetailsData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const response = await this.accreditedProgrammesManageAndDeliverService.addToGroup(
          username,
          referralId,
          groupId,
          data.paramsForUpdate.additionalDetails,
        )
        const { message } = response
        return res.redirect(`/group/${groupId}/allocated?message=${encodeURIComponent(message)}`)
      }
    }

    const presenter = new AddToGroupMoreDetailsPresenter(
      groupId,
      req.session.groupManagementData,
      req.session.originPage,
      formError,
      userInputData,
    )
    const view = new AddToGroupMoreDetailsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

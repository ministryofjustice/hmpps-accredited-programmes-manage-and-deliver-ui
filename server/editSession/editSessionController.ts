import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import EditSessionFacilitatorsPresenter from './editSessionFacilitatorsPresenter'
import EditSessionFacilitatorsView from './editSessionFacilitatorsView'
import EditSessionPresenter from './editSessionPresenter'
import EditSessionView from './editSessionView'

export default class EditSessionController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async editSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionDetails(
      username,
      groupId,
      sessionId,
    )

    req.session.originPage = req.path

    const presenter = new EditSessionPresenter(req.session.originPage, groupId, sessionDetails)
    const view = new EditSessionView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }

  async editSessionFacilitators(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    const formError: FormValidationError | null = null
    const userInputData = null

    const editSessionFacilitators =
      await this.accreditedProgrammesManageAndDeliverService.getEditSessionFacilitatorDetails(username, sessionId)

    const presenter = new EditSessionFacilitatorsPresenter(
      req.session.originPage,
      groupId,
      editSessionFacilitators,
      formError,
      userInputData,
    )
    const view = new EditSessionFacilitatorsView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }
}

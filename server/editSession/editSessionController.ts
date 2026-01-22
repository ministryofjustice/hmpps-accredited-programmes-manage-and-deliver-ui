import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import EditSessionPresenter from './editSessionPresenter'
import EditSessionView from './editSessionView'
import type { ExpressUsername } from '../shared/ExpressUsername'

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

    const presenter = new EditSessionPresenter(groupId, sessionDetails)
    const view = new EditSessionView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }
}

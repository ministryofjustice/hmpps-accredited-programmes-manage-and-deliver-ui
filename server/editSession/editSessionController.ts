import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import EditSessionPresenter from './editSessionPresenter'
import EditSessionView from './editSessionView'

export default class EditSessionController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async editSession(req: Request, res: Response): Promise<void> {
    const { groupId, moduleId } = req.params
    const { username } = req.user

    // const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionDetails(
    //   moduleId,
    //   username,
    // )

    req.session.originPage = req.path

    const presenter = new EditSessionPresenter()
    const view = new EditSessionView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }
}

import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import GroupDetailsPresenter from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'

export default class GroupDetailsController {
  async showGroupDetailsPage(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params

    const presenter = new GroupDetailsPresenter(groupId, 'group code')
    const view = new GroupDetailsView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

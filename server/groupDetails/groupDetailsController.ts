import { Request, Response } from 'express'
import GroupDetailsPresenter from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'

export default class GroupDetailsController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor() {
    super()
  }

  async showGroupDetailsPage(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params

    const presenter = new GroupDetailsPresenter(groupId, 'group code')
    const view = new GroupDetailsView(presenter)

    return this.renderPage(res, view)
  }
}

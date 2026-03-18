import { Request, Response } from 'express'
import GroupDetailsPresenter from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'

export default class GroupDetailsController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showGroupDetailsPage(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)

    const presenter = new GroupDetailsPresenter(groupDetails)
    const view = new GroupDetailsView(presenter)

    return this.renderPage(res, view)
  }
}

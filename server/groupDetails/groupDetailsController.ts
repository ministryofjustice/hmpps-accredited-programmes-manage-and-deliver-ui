// groupDetailsController.ts
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'

export default class GroupDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showGroupDetailsAllocated(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    const pageNumber = req.query.page

    const list = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(username, groupId, {
      page: pageNumber ? Number(pageNumber) - 1 : 0,
      size: 10,
    })

    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Allocated, list.content)
    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    const pageNumber = req.query.page

    const list = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(username, groupId, {
      page: pageNumber ? Number(pageNumber) - 1 : 0,
      size: 10,
    })

    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, list.content)
    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }
}

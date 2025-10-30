import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'

export default class GroupDetailsController {
  constructor() {}

  async showGroupDetailsAllocated(req: Request, res: Response): Promise<void> {
    const { addedToGroup } = req.query
    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Allocated, addedToGroup === 'true')
    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist)
    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }
}
// test

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
    const pageParam = req.query.page
    const page = pageParam ? Number(pageParam) : 1

    const list = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(username, groupId, {
      page,
      size: 10,
    })

    const rows = list?.allocationAndWaitlistData?.paginatedAllocationData ?? []

    console.log('ALLOCATED rows length:', rows.length)

    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Allocated)
    presenter.setRows(rows)

    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    const pageParam = req.query.page
    const page = pageParam ? Number(pageParam) : 1

    const list = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(username, groupId, {
      page,
      size: 10,
    })

    const rows = list?.allocationAndWaitlistData?.paginatedWaitlistData ?? []
    console.log('WAITLIST rows length:', rows.length)

    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist)
    presenter.setRows(rows)

    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }
}

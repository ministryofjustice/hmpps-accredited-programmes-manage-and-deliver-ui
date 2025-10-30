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
    const { addedToGroup } = req.query
    const { username } = req.user
    const { groupId } = req.params
    const pageParam = req.query.page
    const page = pageParam ? Number(pageParam) : 0

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
      username,
      groupId,
      {
        page,
        size: 10,
      },
    )

    const rows = groupDetails?.allocationAndWaitlistData?.paginatedAllocationData ?? []

    const presenter = new GroupDetailsPresenter(
      GroupDetailsPageSection.Allocated,
      groupDetails,
      groupId,
      addedToGroup === 'true',
    )
    presenter.setRows(rows)

    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    const pageParam = req.query.page
    const page = pageParam ? Number(pageParam) : 0

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(
      username,
      groupId,
      {
        page,
        size: 10,
      },
    )

    const rows = groupDetails?.allocationAndWaitlistData?.paginatedWaitlistData ?? []

    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, groupId, null)
    presenter.setRows(rows)

    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }
}

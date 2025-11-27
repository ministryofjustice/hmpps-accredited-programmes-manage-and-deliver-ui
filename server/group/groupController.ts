import { Request, Response } from 'express'
import { Group } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import GroupPresenter, { GroupListPageSection } from './groupPresenter'
import GroupView from './groupView'
import { Page } from '../shared/models/pagination'

export default class GroupController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showNotStartedGroupListPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const pageNumber = req.query.page
    const selectedTab = 'NOT_STARTED'

    const notStartedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      selectedTab,
      // filter.params,
    )

    const presenter = new GroupPresenter(
      notStartedGroupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      notStartedGroupList.otherTabTotal,
      notStartedGroupList.regionName,
    )
    const view = new GroupView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showStartedGroupListPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const pageNumber = req.query.page
    const selectedTab = 'IN_PROGRESS_OR_COMPLETE'

    const startedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      selectedTab,
      // filter.params,
    )

    const presenter = new GroupPresenter(
      startedGroupList.pagedGroupData as Page<Group>,
      GroupListPageSection.IN_PROGRESS_OR_COMPLETE,
      startedGroupList.otherTabTotal,
      startedGroupList.regionName,
    )
    const view = new GroupView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

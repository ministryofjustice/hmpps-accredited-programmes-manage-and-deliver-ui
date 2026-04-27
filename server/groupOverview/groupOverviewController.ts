import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { FormValidationError } from '../utils/formValidationError'
import GroupAllocationsFilter from './allocations/groupAllocationsFilter'
import GroupAllocationsPresenter, { GroupAllocationsPageSection } from './allocations/groupAllocationsPresenter'
import GroupAllocationsView from './allocations/groupAllocationsView'
import GroupForm from './groupForm'
import SchedulePresenter from './schedule/schedulePresenter'
import ScheduleView from './schedule/scheduleView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'

export default class GroupOverviewController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showGroupOverviewAllocated(req: Request, res: Response): Promise<void> {
    const { message } = req.query
    const { username } = req.user
    const { groupId } = req.params
    let formError: FormValidationError | null = null
    req.session.groupManagementData = null
    const pageNumber = req.query.page

    if (pageNumber === undefined) {
      req.session.filterParams = req.originalUrl.includes('?') ? req.originalUrl.split('?').pop() : undefined
    }

    const filter = GroupAllocationsFilter.fromRequest(req)

    const groupOverview = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
      username,
      groupId,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      filter.params,
    )

    if (req.method === 'POST') {
      const data = await new GroupForm(req).removeFromGroupData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.groupManagementData = {
          personName: data.paramsForUpdate.personName,
          groupCode: groupOverview.group.code,
        }
        return res.redirect(`/removeFromGroup/${groupId}/${data.paramsForUpdate.removeFromGroup}`)
      }
    }

    const successMessage = message ? String(message) : null

    const presenter = new GroupAllocationsPresenter(
      GroupAllocationsPageSection.Allocated,
      groupOverview,
      groupId,
      filter,
      req.session.groupManagementData?.personName ?? '',
      formError,
      successMessage,
      req.session.filterParams,
    )
    const view = new GroupAllocationsView(presenter)
    req.session.groupManagementData = null
    req.session.originPage = req.originalUrl
    return this.renderPage(res, view)
  }

  async showGroupOverviewWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    let formError: FormValidationError | null = null
    req.session.groupManagementData = null
    const pageNumber = req.query.page

    if (pageNumber === undefined) {
      req.session.filterParams = req.originalUrl.includes('?') ? req.originalUrl.split('?').pop() : undefined
    }

    const filter = GroupAllocationsFilter.fromRequest(req)

    const groupOverview = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(
      username,
      groupId,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      filter.params,
    )

    if (req.method === 'POST') {
      const data = await new GroupForm(req).addToGroupData()

      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.groupManagementData = {
          personName: data.paramsForUpdate.personName,
          groupCode: groupOverview.group.code,
        }
        return res.redirect(`/addToGroup/${groupId}/${data.paramsForUpdate.addToGroup}`)
      }
    }

    const presenter = new GroupAllocationsPresenter(
      GroupAllocationsPageSection.Waitlist,
      groupOverview,
      groupId,
      filter,
      '',
      formError,
      null,
      req.session.filterParams,
    )
    const view = new GroupAllocationsView(presenter)
    req.session.originPage = req.originalUrl

    return this.renderPage(res, view)
  }

  async showGroupOverviewSchedule(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    const { message } = req.query

    const groupScheduleOverview = await this.accreditedProgrammesManageAndDeliverService.getGroupScheduleOverview(
      username,
      groupId,
    )
    const successMessage = message ? String(message) : null
    const presenter = new SchedulePresenter(groupId, groupScheduleOverview, successMessage)
    const view = new ScheduleView(presenter)
    req.session.originPage = req.originalUrl

    return this.renderPage(res, view)
  }
}

import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import GroupDetailFilter from './groupDetailFilter'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import GroupForm from './groupForm'
import SchedulePresenter from './schedule/schedulePresenter'
import ScheduleView from './schedule/scheduleView'

export default class GroupDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showGroupDetailsAllocated(req: Request, res: Response): Promise<void> {
    const { message } = req.query
    const { username } = req.user
    const { groupId } = req.params
    let formError: FormValidationError | null = null
    req.session.groupManagementData = null
    const pageNumber = req.query.page

    const filter = GroupDetailFilter.fromRequest(req)

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
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
          groupCode: groupDetails.group.code,
        }
        return res.redirect(`/removeFromGroup/${groupId}/${data.paramsForUpdate.removeFromGroup}`)
      }
    }

    const successMessage = message ? String(message) : null

    const presenter = new GroupDetailsPresenter(
      GroupDetailsPageSection.Allocated,
      groupDetails,
      groupId,
      filter,
      req.session.groupManagementData?.personName ?? '',
      formError,
      successMessage,
      req.session.filterParams,
    )
    const view = new GroupDetailsView(presenter)
    req.session.groupManagementData = null
    req.session.originPage = req.originalUrl
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    let formError: FormValidationError | null = null
    req.session.groupManagementData = null
    const pageNumber = req.query.page

    if (pageNumber === undefined) {
      req.session.filterParams = req.originalUrl.includes('?') ? req.originalUrl.split('?').pop() : undefined
    }

    const filter = GroupDetailFilter.fromRequest(req)

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(
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
          groupCode: groupDetails.group.code,
        }
        return res.redirect(`/addToGroup/${groupId}/${data.paramsForUpdate.addToGroup}`)
      }
    }

    const presenter = new GroupDetailsPresenter(
      GroupDetailsPageSection.Waitlist,
      groupDetails,
      groupId,
      filter,
      '',
      formError,
      null,
      req.session.filterParams,
    )
    const view = new GroupDetailsView(presenter)
    req.session.originPage = req.originalUrl

    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showScheduleOverview(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params

    const groupScheduleOverview = await this.accreditedProgrammesManageAndDeliverService.getGroupScheduleOverview(
      username,
      groupId,
    )

    const presenter = new SchedulePresenter(groupId, groupScheduleOverview)
    const view = new ScheduleView(presenter)
    req.session.originPage = req.originalUrl

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

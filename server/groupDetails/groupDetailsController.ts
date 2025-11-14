import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import GroupForm from './groupForm'
import GroupListFilter from './groupListFilter'

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
    const page = pageNumber ? Number(pageNumber) - 1 : 0

    if (pageNumber === undefined) {
      req.session.filterParams = req.originalUrl.includes('?') ? req.originalUrl.split('?').pop() : ''
    }

    const filter = GroupListFilter.fromRequest(req)

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
      username,
      groupId,
      {
        page,
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
          groupRegion: groupDetails.group.regionName,
          personName: data.paramsForUpdate.personName,
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
      req.session.filterParams || '',
      req.session.groupManagementData?.personName ?? '',
      formError,
      successMessage,
    )
    const view = new GroupDetailsView(presenter)
    req.session.groupManagementData = null
    // Set to maintain filters when accessing remove from group journey
    req.session.originPage = req.originalUrl
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    let formError: FormValidationError | null = null
    req.session.groupManagementData = null
    const pageNumber = req.query.page
    const page = pageNumber ? Number(pageNumber) - 1 : 0
    const queryString = req.originalUrl.split('?')[1] || ''
    req.session.filterParams = queryString

    const filter = GroupListFilter.fromRequest(req)

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(
      username,
      groupId,
      {
        page,
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
          groupRegion: groupDetails.group.regionName,
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
      req.session.filterParams || '',
      '',
      formError,
    )
    const view = new GroupDetailsView(presenter)

    req.session.originPage = req.originalUrl

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

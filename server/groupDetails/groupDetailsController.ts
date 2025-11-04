import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import { FormValidationError } from '../utils/formValidationError'
import GroupForm from './groupForm'

export default class GroupDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showGroupDetailsAllocated(req: Request, res: Response): Promise<void> {
    const { addedToGroup } = req.query
    const { username } = req.user
    const { groupId } = req.params

    const formError: FormValidationError | null = null

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

    const presenter = new GroupDetailsPresenter(
      GroupDetailsPageSection.Allocated,
      groupDetails,
      groupId,
      req.session.groupManagementData?.personName ?? '',
      formError,
      addedToGroup === 'true',
    )
    const view = new GroupDetailsView(presenter)
    req.session.groupManagementData = null
    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params

    let formError: FormValidationError | null = null
    req.session.groupManagementData = null

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
    if (req.method === 'POST') {
      const data = await new GroupForm(req).addToGroupData()

      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.groupManagementData = {
          groupRegion: groupDetails.group.regionName,
          personName: data.paramsForUpdate.personName,
        }
        return res.redirect(`/addToGroup/${groupId}/${data.paramsForUpdate.addToGroup}`)
      }
    }

    const presenter = new GroupDetailsPresenter(
      GroupDetailsPageSection.Waitlist,
      groupDetails,
      groupId,
      '',
      formError,
      null,
    )
    const view = new GroupDetailsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

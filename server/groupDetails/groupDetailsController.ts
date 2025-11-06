import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import GroupDetailsPresenter, { GroupDetailsPageSection, AllocatedRow, WaitlistRow } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import { FormValidationError } from '../utils/formValidationError'
import GroupForm from './groupForm'
import { Page } from '../shared/models/pagination'

type ApiBaseRow = {
  crn: string
  personName: string
  sentenceEndDate: string
  status: string
  referral_id: string
  sourced_from: string
}

type ApiAllocatedRow = ApiBaseRow

type ApiWaitlistRow = ApiBaseRow & {
  cohort: 'SEXUAL_OFFENCE' | 'GENERAL_OFFENCE'
  hasLdc: boolean
  age: number
  sex: string
  pdu: string
  reportingTeam: string
}

export default class GroupDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showGroupDetailsAllocated(req: Request, res: Response): Promise<void> {
    const { addedToGroup } = req.query
    const { username } = req.user
    const { groupId } = req.params

    const formError: FormValidationError | null = null

    const size = 10
    const pageParam = req.query.page as string | undefined
    const page = pageParam ? Math.max(0, Number(pageParam) - 1) : 0

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
      username,
      groupId,
      { page, size },
    )

    const rows: AllocatedRow[] = (groupDetails?.allocationAndWaitlistData?.paginatedAllocationData ??
      []) as AllocatedRow[]

    const paged: Page<AllocatedRow> = {
      content: rows,
      totalElements: rows.length,
      totalPages: 1,
      numberOfElements: rows.length,
      number: page,
      size,
    }

    const presenter = new GroupDetailsPresenter(
      GroupDetailsPageSection.Allocated,
      paged,
      groupDetails,
      undefined,
      groupId,
      req.session.groupManagementData?.personName ?? '',
      formError,
      addedToGroup === 'true',
    )
    presenter.setRows(rows)

    const view = new GroupDetailsView(presenter)
    req.session.groupManagementData = null
    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params

    let formError: FormValidationError | null = null
    req.session.groupManagementData = null

    const size = 10
    const pageParam = req.query.page as string | undefined
    const page = pageParam ? Math.max(0, Number(pageParam) - 1) : 0

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(
      username,
      groupId,
      {
        page,
        size,
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

    const rows: WaitlistRow[] = (groupDetails?.allocationAndWaitlistData?.paginatedWaitlistData ?? []) as WaitlistRow[]

    const paged: Page<WaitlistRow> = {
      content: rows,
      totalElements: rows.length,
      totalPages: 1,
      numberOfElements: rows.length,
      number: page,
      size,
    }
    const presenter = new GroupDetailsPresenter(
      GroupDetailsPageSection.Waitlist,
      paged,
      groupDetails,
      undefined,
      groupId,
      '',
      formError,
      null,
    )
    const view = new GroupDetailsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

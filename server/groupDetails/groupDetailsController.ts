import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import GroupDetailsPresenter, { GroupDetailsPageSection, AllocatedRow, WaitlistRow } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import { FormValidationError } from '../utils/formValidationError'
import GroupForm from './groupForm'

type ApiBaseRow = {
  crn: string
  personName: string
  sentenceEndDate: string
  status: string
  referral_id?: string
  referralId?: string
  sourced_from?: string
  sourcedFrom?: string
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

function normaliseReferralId(r: { referral_id?: string; referralId?: string }): string {
  return r.referral_id ?? r.referralId ?? ''
}
function normaliseSourcedFrom(r: { sourced_from?: string; sourcedFrom?: string }): string {
  return r.sourced_from ?? r.sourcedFrom ?? ''
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

    const rawRows = (groupDetails?.allocationAndWaitlistData?.paginatedAllocationData ?? []) as ApiAllocatedRow[]

    const rows: AllocatedRow[] = rawRows.map(r => ({
      crn: r.crn,
      personName: r.personName,
      referral_id: normaliseReferralId(r),
      sentenceEndDate: r.sentenceEndDate,
      sourced_from: normaliseSourcedFrom(r),
      status: r.status,
    }))

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

    const rawRows = (groupDetails?.allocationAndWaitlistData?.paginatedWaitlistData ?? []) as ApiWaitlistRow[]

    const rows: WaitlistRow[] = rawRows.map(r => ({
      crn: r.crn,
      personName: r.personName,
      referral_id: normaliseReferralId(r),
      sentenceEndDate: r.sentenceEndDate,
      sourced_from: normaliseSourcedFrom(r),
      cohort: r.cohort,
      hasLdc: r.hasLdc,
      age: r.age,
      sex: r.sex,
      pdu: r.pdu,
      reportingTeam: r.reportingTeam,
      status: r.status,
    }))

    const presenter = new GroupDetailsPresenter(GroupDetailsPageSection.Waitlist, groupDetails, groupId, null)
    presenter.setRows(rows)
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

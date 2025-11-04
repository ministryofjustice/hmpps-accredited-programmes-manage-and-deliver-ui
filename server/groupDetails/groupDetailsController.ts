import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import GroupDetailsPresenter, { GroupDetailsPageSection, AllocatedRow, WaitlistRow } from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import { Page } from '../shared/models/pagination'

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

    const size = 10
    const pageParam = req.query.page as string | undefined
    const page = pageParam ? Math.max(0, Number(pageParam) - 1) : 0

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
      username,
      groupId,
      { page, size },
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
      addedToGroup === 'true',
    )
    presenter.setRows(rows)

    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showGroupDetailsWaitlist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params

    const size = 10
    const pageParam = req.query.page as string | undefined
    const page = pageParam ? Math.max(0, Number(pageParam) - 1) : 0

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers(
      username,
      groupId,
      { page, size },
    )

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
      null,
    )
    presenter.setRows(rows)

    const view = new GroupDetailsView(presenter)
    ControllerUtils.renderWithLayout(res, view, null)
  }
}

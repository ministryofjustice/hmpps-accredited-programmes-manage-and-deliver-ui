import { CohortEnum, ProgrammeGroupDetails } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import { ButtonArgs, SelectArgsItem, TableArgsHeadElement } from '../utils/govukFrontendTypes'
import { convertToTitleCase } from '../utils/utils'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import Pagination from '../utils/pagination/pagination'

export enum GroupDetailsPageSection {
  Allocated = 1,
  Waitlist = 2,
}

const cohortConfigMap: Record<CohortEnum, string> = {
  SEXUAL_OFFENCE: 'Sexual Offence',
  GENERAL_OFFENCE: 'General Offence',
}

export type AllocatedRow = {
  crn: string
  personName: string
  sentenceEndDate: string
  status: string
  referralId: string
}

export type WaitlistRow = {
  crn: string
  personName: string
  sentenceEndDate: string
  cohort: 'SEXUAL_OFFENCE' | 'GENERAL_OFFENCE'
  hasLdc: boolean
  age: number
  sex: string
  pdu: string
  reportingTeam: string
  status: string
  referralId: string
}

export default class GroupDetailsPresenter {
  public readonly pagination: Pagination

  constructor(
    readonly section: GroupDetailsPageSection,
    readonly page: Page<AllocatedRow> | Page<WaitlistRow>,
    readonly groupDetails: ProgrammeGroupDetails,
    readonly params: string | undefined,
    readonly groupId: string,
    readonly personName: string = '',
    readonly validationError: FormValidationError | null = null,
    readonly isPersonAdded: boolean | null = null,
  ) {
    this.pagination = new Pagination(page, params)
  }

  private groupMemberList: (AllocatedRow | WaitlistRow)[] = []

  setRows(rows: AllocatedRow[] | WaitlistRow[]) {
    this.groupMemberList = rows ?? []
  }

  get text() {
    return {
      pageHeading: this.groupDetails.group.regionName,
      pageSubHeading: this.groupDetails.group.code,
      pageTableHeading: `Allocations and waitlist`,
    }
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: `Allocated (${this.groupDetails.allocationAndWaitlistData.counts.allocated})`,
          href: `/groupDetails/${this.groupId}/allocated`,
          active: this.section === GroupDetailsPageSection.Allocated,
        },
        {
          text: `Waitlist (${this.groupDetails.allocationAndWaitlistData.counts.waitlist})`,
          href: `/groupDetails/${this.groupId}/waitlist`,
          active: this.section === GroupDetailsPageSection.Waitlist,
        },
      ],
    }
  }

  generateTableHeadings(): TableArgsHeadElement[] {
    const baseHeadings: TableArgsHeadElement[] = [
      { text: '' },
      { text: 'Name and CRN', attributes: { 'aria-sort': 'ascending' } },
      { text: 'Sentence end date', attributes: { 'aria-sort': 'none' } },
    ]

    const extra =
      this.section === GroupDetailsPageSection.Allocated
        ? [{ text: 'Referral status', attributes: { 'aria-sort': 'none' } }]
        : [
            { text: 'Cohort', attributes: { 'aria-sort': 'none' } },
            { text: 'Age', attributes: { 'aria-sort': 'none' } },
            { text: 'Sex', attributes: { 'aria-sort': 'none' } },
            { text: 'PDU', attributes: { 'aria-sort': 'none' } },
            { text: 'Reporting team', attributes: { 'aria-sort': 'none' } },
          ]

    return baseHeadings.concat(extra)
  }

  private referralHref = (id: string) => `/referral-details/${encodeURIComponent(id)}/personal-details`

  generateWaitlistTableArgs() {
    const rows = this.groupDetails.allocationAndWaitlistData.paginatedWaitlistData
    const out: ({ html: string } | { text: string })[][] = []

    rows.forEach(member => {
      out.push([
        {
          html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='${member.referralId}' value='${member.personName}*${member.referralId}' type="radio" name="add-to-group" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="${member.referralId}">
                      <span class="govuk-!-display-none">Add ${member.personName} to the group</span>
                    </label>
                  </div>
                 </div>`,
        },

        {
          html: `<a href="${this.referralHref(member.referralId)}">${member.personName}</a><p class="govuk-!-margin-bottom-0"> ${member.crn}</p>`,
        },

        {
          html: `${member.sentenceEndDate && member.sentenceEndDate !== 'null' ? member.sentenceEndDate : 'N/A'}${
            member.sourcedFrom ? `<br> ${member.sourcedFrom}` : ''
          }`,
        },
        {
          html: `${cohortConfigMap[member.cohort as CohortEnum]}${
            member.hasLdc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
          }`,
        },

        { text: String(member.age) },
        { text: convertToTitleCase(member.sex) },
        { text: member.pdu },
        { text: member.reportingTeam },
      ])
    })

    return out
  }

  generateAllocatedTableArgs() {
    const rows = this.groupDetails.allocationAndWaitlistData.paginatedAllocationData
    const out: ({ html: string } | { text: string })[][] = []

    rows.forEach(member => {
      out.push([
        {
          html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='${member.crn}' value='${member.crn}' type="radio" name="removeFromGroup" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="${member.crn}">
                      <span class="govuk-!-display-none">Remove ${member.personName} from the group</span>
                    </label>
                  </div>
                 </div>`,
        },
        {
          html: `<a href="${this.referralHref(member.referralId)}">${member.personName}</a><p class="govuk-!-margin-bottom-0">${member.crn}</p>`,
        },

        {
          html: `${member.sentenceEndDate && member.sentenceEndDate !== 'null' ? member.sentenceEndDate : 'N/A'}${
            member.sourcedFrom ? `<br> ${member.sourcedFrom}` : ''
          }`,
        },
        { html: `<strong class="govuk-tag govuk-tag--blue">${member.status}</strong>` },
      ])
    })

    return out
  }

  generateSelectValues(options: { value: string; text: string }[], caseListFilter: string): SelectArgsItem[] {
    const selectOptions: SelectArgsItem[] = [{ text: 'Select', value: '' }]
    options.forEach(option =>
      selectOptions.push({
        value: option.value,
        text: option.text,
        selected: caseListFilter?.includes(String(option.value)) ?? false,
      }),
    )
    return selectOptions
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get formButtonArgs(): ButtonArgs {
    return {
      text: this.section === GroupDetailsPageSection.Allocated ? 'Remove from group' : 'Add to group',
    }
  }
}

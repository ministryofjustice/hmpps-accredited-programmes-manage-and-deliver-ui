import { CohortEnum, ProgrammeGroupDetails } from '@manage-and-deliver-api'
import { ButtonArgs, SelectArgsItem, TableArgsHeadElement } from '../utils/govukFrontendTypes'
import { convertToTitleCase } from '../utils/utils'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

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
}

export default class GroupDetailsPresenter {
  constructor(
    readonly section: GroupDetailsPageSection,
    readonly group: ProgrammeGroupDetails,
    readonly groupId: string,
    readonly personName: string = '',
    readonly validationError: FormValidationError | null = null,
    readonly isPersonAdded: boolean | null = null,
  ) {}

  get text() {
    return {
      pageHeading: this.group.group.regionName,
      pageSubHeading: this.group.group.code,
      pageTableHeading: `Allocations and waitlist`,
    }
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: `Allocated (${this.group.allocationAndWaitlistData.counts.allocated})`,
          href: `/groupDetails/${this.groupId}/allocated`,
          active: this.section === GroupDetailsPageSection.Allocated,
        },
        {
          text: `Waitlist (${this.group.allocationAndWaitlistData.counts.waitlist})`,
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

  generateWaitlistTableArgs() {
    const rows = this.group.allocationAndWaitlistData.paginatedWaitlistData
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
        { html: `<a href="">${member.personName}</a><p class="govuk-!-margin-bottom-0"> ${member.crn}</p>` },
        { text: member.sentenceEndDate },
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
    const rows = this.group.allocationAndWaitlistData.paginatedAllocationData
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
        { html: `<a href="">${member.personName}</a><p class="govuk-!-margin-bottom-0">${member.crn}</p>` },
        { text: member.sentenceEndDate },
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

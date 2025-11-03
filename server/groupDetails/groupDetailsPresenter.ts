import { CohortEnum, ProgrammeGroupDetails } from '@manage-and-deliver-api'
import { ButtonArgs, SelectArgsItem, TableArgsHeadElement } from '../utils/govukFrontendTypes'
import { convertToTitleCase } from '../utils/utils'

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
  referral_id: string
  sentenceEndDate: string
  sourced_from: string
  status: string
}

export type WaitlistRow = {
  crn: string
  personName: string
  referral_id: string
  sentenceEndDate: string
  sourced_from: string
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
    readonly isPersonAdded: boolean | null = null,
    public readonly addedPersonName?: string,
  ) {}

  private groupMemberList: (AllocatedRow | WaitlistRow)[] = []

  setRows(rows: AllocatedRow[] | WaitlistRow[]) {
    this.groupMemberList = rows ?? []
  }

  get text() {
    return {
      pageHeading: this.group.group.regionName,
      pageSubHeading: this.group.group.code,
      pageTableHeading: 'Allocations and waitlist',
    }
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: `Allocated`,
          href: `/groupDetails/${this.groupId}/allocated`,
          active: this.section === GroupDetailsPageSection.Allocated,
        },
        {
          text: `Waitlist`,
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
    const rows = this.groupMemberList as WaitlistRow[]
    const out: ({ html: string } | { text: string })[][] = []

    rows.forEach(member => {
      out.push([
        {
          html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='${member.crn}' value='${member.crn}' type="radio" name="addToGroup" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="${member.crn}">
                      <span class="govuk-!-display-none">Add ${member.personName} to the group</span>
                    </label>
                  </div>
                 </div>`,
        },
        {
          html: `<a href='/referral-details/${member.referral_id}/personal-details'>${member.personName}</a> ${member.crn}`,
        },
        {
          html: `${member.sentenceEndDate}${member.sourced_from ? `</br> ${member.sourced_from}` : ''}`,
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
    const rows = this.groupMemberList as AllocatedRow[]
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
          html: `<a href="/referral-details/${member.referral_id}/personal-details">${member.personName}</a>${member.crn}`,
        },
        {
          html: `${member.sentenceEndDate}${member.sourced_from ? `</br> ${member.sourced_from}` : ''}`,
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

  get formButtonArgs(): ButtonArgs {
    return {
      text: this.section === GroupDetailsPageSection.Allocated ? 'Remove from group' : 'Add to group',
      href:
        this.section === GroupDetailsPageSection.Allocated
          ? `/remove-from-group/groupId/personId`
          : `/add-to-group/groupId/personId`,
    }
  }
}

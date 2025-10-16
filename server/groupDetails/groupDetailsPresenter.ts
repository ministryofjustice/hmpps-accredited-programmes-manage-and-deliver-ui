import { CohortEnum } from '@manage-and-deliver-api'
import { ButtonArgs, SelectArgsItem, TableArgs, TableArgsHeadElement } from '../utils/govukFrontendTypes'
import Pagination from '../utils/pagination/pagination'
import { convertToTitleCase } from '../utils/utils'

export enum GroupDetailsPageSection {
  Allocated = 1,
  Waitlist = 2,
}

const cohortConfigMap: Record<CohortEnum, string> = {
  SEXUAL_OFFENCE: 'Sexual Offence',
  GENERAL_OFFENCE: 'General Offence',
}

export default class GroupDetailsPresenter {
  public readonly pagination: Pagination

  constructor(readonly section: GroupDetailsPageSection) {}

  readonly text = {
    pageHeading: `North East`,
    pageSubHeading: `BCCDD1`,
    pageTableHeading: `Allocations and waitlist`,
  }

  readonly groupMemberList = [
    {
      id: 'ref-123',
      crn: 'X1234',
      offender_name: 'Andrew Anderson',
      sentence_end_date_text: '1 January 2026 Licence end date',
      cohort: 'GENERAL_OFFENCE',
      has_ldc: true,
      age: 33,
      sex: 'male',
      pdu_name: 'Bristol',
      reporting_team_name: 'Darlington',
      current_status: {
        text: 'Awaiting Allocation',
        colour: 'blue',
      },
    },
    {
      id: 'ref-123',
      crn: 'X1234',
      offender_name: 'Andrew Anderson',
      sentence_end_date_text: '1 January 2026 Licence end date',
      cohort: 'GENERAL_OFFENCE',
      has_ldc: true,
      age: 33,
      sex: 'male',
      pdu_name: 'Bristol',
      reporting_team_name: 'Darlington',
      current_status: {
        text: 'Awaiting Allocation',
        colour: 'blue',
      },
    },
    {
      id: 'ref-123',
      crn: 'X1234',
      offender_name: 'Andrew Anderson',
      sentence_end_date_text: '1 January 2026 Licence end date',
      cohort: 'GENERAL_OFFENCE',
      has_ldc: true,
      age: 33,
      sex: 'male',
      pdu_name: 'Bristol',
      reporting_team_name: 'Darlington',
      current_status: {
        text: 'Awaiting Allocation',
        colour: 'blue',
      },
    },
    {
      id: 'ref-123',
      crn: 'X1234',
      offender_name: 'Andrew Anderson',
      sentence_end_date_text: '1 January 2026 Licence end date',
      cohort: 'GENERAL_OFFENCE',
      has_ldc: true,
      age: 33,
      sex: 'male',
      pdu_name: 'Bristol',
      reporting_team_name: 'Darlington',
      current_status: {
        text: 'Awaiting Allocation',
        colour: 'blue',
      },
    },
  ]

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: `Allocated ()`,
          href: `/groupDetails/1234/allocated`,
          active: this.section === GroupDetailsPageSection.Allocated,
        },
        {
          text: `Waitlist ()`,
          href: `/groupDetails/1234/waitlist`,
          active: this.section === GroupDetailsPageSection.Waitlist,
        },
      ],
    }
  }

  generateTableHeadings(): TableArgsHeadElement[] {
    const baseHeadings: TableArgsHeadElement[] = [
      {
        text: '',
      },
      {
        text: 'Name and CRN',
        attributes: {
          'aria-sort': 'ascending',
        },
      },
      {
        text: 'Sentence end date',
        attributes: {
          'aria-sort': 'none',
        },
      },
    ]
    let additionalHeadings: TableArgsHeadElement[] = []
    if (this.section === GroupDetailsPageSection.Allocated) {
      additionalHeadings = [
        {
          text: 'Referral status',
          attributes: { 'aria-sort': 'none' },
        },
      ]
    }
    if (this.section === GroupDetailsPageSection.Waitlist) {
      additionalHeadings = [
        {
          text: 'Cohort',
          attributes: { 'aria-sort': 'none' },
        },
        {
          text: 'Age',
          attributes: { 'aria-sort': 'none' },
        },
        {
          text: 'Sex',
          attributes: { 'aria-sort': 'none' },
        },
        {
          text: 'PDU',
          attributes: { 'aria-sort': 'none' },
        },
        {
          text: 'Reporting team',
          attributes: { 'aria-sort': 'none' },
        },
      ]
    }
    return baseHeadings.concat(additionalHeadings)
  }

  generateWaitlistTableArgs() {
    const waitlistData: ({ html: string; text?: undefined } | { text: string; html?: undefined })[][] = []
    this.groupMemberList.forEach(member => {
      waitlistData.push([
        {
          html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='${member.crn}' value='${member.crn}' type="radio" name="addToGroup" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="${member.crn}">
                    <span class="govuk-!-display-none">Add ${member.offender_name} to the group</span>
                    </label>
                  </div>
                  </div>`,
        },
        { html: `<a href="">${member.offender_name}</a><br> ${member.crn}` },
        { text: member.sentence_end_date_text },
        {
          html: `${cohortConfigMap[member.cohort as 'SEXUAL_OFFENCE' | 'GENERAL_OFFENCE']} ${member.has_ldc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''}`,
        },
        { text: member.age.toString() },
        { text: convertToTitleCase(member.sex) },
        { text: member.pdu_name },
        { text: member.reporting_team_name },
      ])
    })
    return waitlistData
  }

  generateAllocatedTableArgs() {
    const allocatedData: ({ html: string; text?: undefined } | { text: string; html?: undefined })[][] = []
    this.groupMemberList.forEach(member => {
      allocatedData.push([
        {
          html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='${member.crn}' value='${member.crn}' type="radio" name="addToGroup" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="${member.crn}">
                    <span class="govuk-!-display-none">Add ${member.offender_name} to the group</span>
                    </label>
                  </div>
                  </div>`,
        },
        { html: `<a href="">${member.offender_name}</a><br> ${member.crn}` },
        { text: member.sentence_end_date_text },
        {
          html: `<strong class="govuk-tag govuk-tag--${member.current_status.colour}"> ${member.current_status.text} </strong>`,
        },
      ])
    })
    return allocatedData
  }

  generateSelectValues(options: { value: string; text: string }[], caseListFilter: string): SelectArgsItem[] {
    const selectOptions: SelectArgsItem[] = [
      {
        text: 'Select',
        value: '',
      },
    ]
    options.map(option =>
      selectOptions.push({
        value: option.value,
        text: option.text,
        selected: caseListFilter?.includes(`${option.value}`) ?? false,
      }),
    )
    return selectOptions
  }

  get formButtonArgs(): ButtonArgs {
    return {
      text: this.section === GroupDetailsPageSection.Allocated ? 'Remove from group' : 'Add to group',
    }
  }
}

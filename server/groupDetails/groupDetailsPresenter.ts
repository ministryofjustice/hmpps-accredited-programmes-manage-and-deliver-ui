import { CohortEnum } from '@manage-and-deliver-api'
import { ButtonArgs, SelectArgsItem, TableArgsHeadElement } from '../utils/govukFrontendTypes'
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

  constructor(
    readonly section: GroupDetailsPageSection,
    readonly groupMemberList: Array<{
      id: string
      crn: string
      personName: string
      sentenceEndDate: string
      cohort: 'SEXUAL_OFFENCE' | 'GENERAL_OFFENCE'
      hasLdc: boolean
      age: number
      sex: string
      pdu: string
      reportingTeam: string
      status: { text: string; colour: string }
    }>,
  ) {}

  readonly text = {
    pageHeading: `North East`,
    pageSubHeading: `BCCDD1`,
    pageTableHeading: `Allocations and waitlist`,
  }

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
                    <span class="govuk-!-display-none">Add ${member.personName} to the group</span>
                    </label>
                  </div>
                  </div>`,
        },
        { html: `<a href="">${member.personName}</a><br> ${member.crn}` },
        { text: member.sentenceEndDate },
        {
          html: `${cohortConfigMap[member.cohort as 'SEXUAL_OFFENCE' | 'GENERAL_OFFENCE']} ${member.hasLdc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''}`,
        },
        { text: member.age.toString() },
        { text: convertToTitleCase(member.sex) },
        { text: member.pdu },
        { text: member.reportingTeam },
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
                    <span class="govuk-!-display-none">Add ${member.personName} to the group</span>
                    </label>
                  </div>
                  </div>`,
        },
        { html: `<a href="">${member.personName}</a><br> ${member.crn}` },
        { text: member.sentenceEndDate },
        {
          html: `<strong class="govuk-tag govuk-tag--${member.status.colour}"> ${member.status.text} </strong>`,
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

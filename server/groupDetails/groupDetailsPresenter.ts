import { CohortEnum, GroupItem, ProgrammeGroupDetails } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import { FormValidationError } from '../utils/formValidationError'
import { ButtonArgs, CheckboxesArgsItem, SelectArgsItem, TableArgsHeadElement } from '../utils/govukFrontendTypes'
import Pagination from '../utils/pagination/pagination'
import PresenterUtils from '../utils/presenterUtils'
import { convertToTitleCase } from '../utils/utils'
import GroupDetailFilter from './groupDetailFilter'
import GroupServiceLayoutPresenter, { GroupServiceNavigationValues } from '../shared/groups/groupServiceLayoutPresenter'

export enum GroupDetailsPageSection {
  Allocated = 1,
  Waitlist = 2,
}

const cohortConfigMap: Record<CohortEnum, string> = {
  SEXUAL_OFFENCE: 'Sexual offence',
  GENERAL_OFFENCE: 'General offence',
}

export default class GroupDetailsPresenter extends GroupServiceLayoutPresenter {
  public readonly pagination: Pagination

  readonly groupListItems: Page<GroupItem>

  constructor(
    readonly section: GroupDetailsPageSection,
    readonly group: ProgrammeGroupDetails,
    readonly groupId: string,
    readonly filter: GroupDetailFilter,
    readonly personName: string = '',
    readonly validationError: FormValidationError | null = null,
    readonly successMessage: string | null = null,
    readonly params?: string,
  ) {
    super(GroupServiceNavigationValues.allocationsTab, groupId)
    this.groupListItems = this.group.pagedGroupData as Page<GroupItem>
    this.pagination = new Pagination(this.groupListItems, params)
  }

  get text() {
    return {
      pageSubHeading: this.group.group.code,
      pageHeading: `Allocations and waitlist`,
    }
  }

  get showReportingTeams(): boolean {
    return !!this.filter?.pdu
  }

  get resultsText(): string {
    const { totalElements, number, size, numberOfElements } = this.groupListItems
    if (totalElements === 0) {
      return ''
    }
    const start = number * size + 1
    const end = number * size + numberOfElements
    return `Showing <strong>${start}</strong> to <strong>${end}</strong> of <strong>${totalElements}</strong> results`
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    const nameCrnFilter = this.filter.nameOrCRN === undefined ? `` : `?nameOrCRN=${this.filter.nameOrCRN}`
    return {
      items: [
        {
          text:
            this.section === GroupDetailsPageSection.Allocated
              ? `Allocated (${this.group.pagedGroupData.totalElements})`
              : `Allocated (${this.group.otherTabTotal})`,
          href: `/groupDetails/${this.groupId}/allocated${nameCrnFilter}`,
          active: this.section === GroupDetailsPageSection.Allocated,
        },
        {
          text:
            this.section === GroupDetailsPageSection.Waitlist
              ? `Waitlist (${this.group.pagedGroupData.totalElements})`
              : `Waitlist (${this.group.otherTabTotal})`,
          href: `/groupDetails/${this.groupId}/waitlist${nameCrnFilter}`,
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
    const rows = this.group.pagedGroupData.content
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
          html: `${member.sentenceEndDate ?? 'No information'}${
            member.sourcedFrom && member.sentenceEndDate ? `<br> ${member.sourcedFrom}` : ''
          }`,
        },
        {
          html: `${cohortConfigMap[member.cohort as CohortEnum]}${
            member.hasLdc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
          }`,
        },
        { text: member.age ? String(member.age) : 'No information' },
        { text: member.sex ? convertToTitleCase(member.sex) : 'No information' },
        { text: member.pdu },
        { text: member.reportingTeam },
      ])
    })

    return out
  }

  generateAllocatedTableArgs() {
    const rows = this.group.pagedGroupData.content
    const out: ({ html: string } | { text: string })[][] = []

    rows.forEach(member => {
      out.push([
        {
          html: `<div class="govuk-radios govuk-radios--small group-details-table">
                  <div class="govuk-radios__item">
                    <input id='${member.crn}' value='${member.personName}*${member.referralId}' type="radio" name="remove-from-group" class="govuk-radios__input">
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
          html: `${member.sentenceEndDate ?? 'No information'}${
            member.sourcedFrom && member.sentenceEndDate ? `<br> ${member.sourcedFrom}` : ''
          }`,
        },
        { html: `<strong class="govuk-tag govuk-tag--${member.statusColour}">${member.status}</strong>` },
      ])
    })

    return out
  }

  generateSelectValues(options: string[], groupListFilter: string, defaultValue: string): SelectArgsItem[] {
    const selectOptions: SelectArgsItem[] = [{ text: defaultValue, value: '' }]
    options.forEach(option =>
      selectOptions.push({
        value: option,
        text: option,
        selected: groupListFilter?.includes(String(option)) ?? false,
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

  generatePduSelectArgs(): SelectArgsItem[] {
    const checkboxArgs = [
      {
        text: 'Select PDU',
        value: '',
      },
    ]
    const pduCheckboxArgs = this.group.filters.locationFilters
      .map(pdu => ({
        text: pdu.pduName,
        value: pdu.pduName,
        selected: this.filter.pdu === pdu.pduName,
      }))
      .sort((a, b) => a.text.localeCompare(b.text))
    return checkboxArgs.concat(pduCheckboxArgs)
  }

  generateReportingTeamCheckboxArgs(): CheckboxesArgsItem[] {
    let checkboxItems: CheckboxesArgsItem[] = []

    if (this.showReportingTeams) {
      const pduLocationData = this.group.filters.locationFilters.find(location => location.pduName === this.filter.pdu)
      checkboxItems = pduLocationData.reportingTeams
        .map(location => ({
          text: location,
          value: location,
          checked: this.filter.reportingTeam?.includes(location),
        }))
        .sort((a, b) => a.text.localeCompare(b.text))
    }

    return checkboxItems
  }

  hasResults(): boolean {
    return !this.group.pagedGroupData.empty
  }

  generateNoResultsString(): string {
    const hasFilters = Object.values(this.filter).some(value => value !== undefined)
    if (this.hasResults()) {
      return ''
    }
    if (hasFilters) {
      return 'No results found. Clear or change the filters'
    }

    return this.section === GroupDetailsPageSection.Allocated
      ? 'There are currently no people allocated to this group.'
      : `There are no people awaiting allocation in ${this.group.group.regionName}.`
  }
}

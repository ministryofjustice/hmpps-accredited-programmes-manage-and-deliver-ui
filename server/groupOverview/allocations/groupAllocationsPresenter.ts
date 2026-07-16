import { CohortEnum, GroupItem, ProgrammeGroupAllocations } from '@manage-and-deliver-api'
import GroupServiceLayoutPresenter, {
  GroupServiceNavigationValues,
} from '../../shared/groups/groupServiceLayoutPresenter'
import { Page } from '../../shared/models/pagination'
import { FormValidationError } from '../../utils/formValidationError'
import { ButtonArgs, CheckboxesArgsItem, SelectArgsItem, TableArgsHeadElement } from '../../utils/govukFrontendTypes'
import Pagination from '../../utils/pagination/pagination'
import PresenterUtils from '../../utils/presenterUtils'
import { convertToTitleCase } from '../../utils/utils'
import GroupAllocationsFilter from './groupAllocationsFilter'

export enum GroupAllocationsPageSection {
  Allocated = 1,
  Waitlist = 2,
}

const cohortConfigMap: Record<CohortEnum, string> = {
  SEXUAL_OFFENCE: 'Sexual offence',
  GENERAL_OFFENCE: 'General offence',
}

export default class GroupAllocationsPresenter extends GroupServiceLayoutPresenter {
  public readonly pagination: Pagination

  readonly groupListItems: Page<GroupItem>

  constructor(
    readonly section: GroupAllocationsPageSection,
    readonly group: ProgrammeGroupAllocations,
    readonly groupId: string,
    readonly filter: GroupAllocationsFilter,
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

  get pageTitle(): string {
    return this.section === GroupAllocationsPageSection.Allocated ? 'Group allocations' : 'Building Choices waitlist'
  }

  get selectionLegendText(): string {
    return this.section === GroupAllocationsPageSection.Allocated
      ? 'Select one person to remove from the group'
      : 'Select one person to add to the group'
  }

  get showReportingTeams(): boolean {
    return this.filter.pdus !== undefined && this.filter.pdus.length > 0
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

  get tableCaptionClass(): string {
    if (this.group.pagedGroupData.content.length === 0) {
      return 'govuk-visually-hidden'
    }
    return 'govuk-table__caption--m'
  }

  get tableCaption(): string {
    return this.section === GroupAllocationsPageSection.Waitlist
      ? 'Waitlist for Building Choices'
      : `Allocated to ${this.group.group.code}`
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    const nameCrnFilter = this.filter.nameOrCRN === undefined ? `` : `?nameOrCRN=${this.filter.nameOrCRN}`
    return {
      items: [
        {
          text:
            this.section === GroupAllocationsPageSection.Allocated
              ? `Allocated (${this.group.pagedGroupData.totalElements})`
              : `Allocated (${this.group.otherTabTotal})`,
          href: `/group/${this.groupId}/allocations${nameCrnFilter}`,
          active: this.section === GroupAllocationsPageSection.Allocated,
        },
        {
          text:
            this.section === GroupAllocationsPageSection.Waitlist
              ? `Waitlist (${this.group.pagedGroupData.totalElements})`
              : `Waitlist (${this.group.otherTabTotal})`,
          href: `/group/${this.groupId}/waitlist${nameCrnFilter}`,
          active: this.section === GroupAllocationsPageSection.Waitlist,
        },
      ],
    }
  }

  generateTableHeadings(): TableArgsHeadElement[] {
    const baseHeadings: TableArgsHeadElement[] = [
      { text: this.section === GroupAllocationsPageSection.Allocated ? 'Remove from group' : 'Add to group' },
      { text: 'Name and CRN', attributes: { 'aria-sort': 'ascending' } },
      { text: 'Sentence end date', attributes: { 'aria-sort': 'none' } },
    ]

    const extra =
      this.section === GroupAllocationsPageSection.Allocated
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
                    <input id='${member.referralId}' value='${member.referralId}' type="radio" name="add-to-group" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="${member.referralId}">
                      <span class="govuk-visually-hidden">Add ${member.personName} to the group</span>
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
                    <input id='${member.crn}' value='${member.referralId}' type="radio" name="remove-from-group" class="govuk-radios__input">
                    <label class="govuk-label govuk-radios__label" for="${member.crn}">
                      <span class="govuk-visually-hidden">Remove ${member.personName} from the group</span>
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
      text: this.section === GroupAllocationsPageSection.Allocated ? 'Remove from group' : 'Add to group',
    }
  }

  generatePduCheckboxArgs(): CheckboxesArgsItem[] {
    return this.group.filters.locationFilters
      .map(pdu => ({
        text: pdu.pduName,
        value: pdu.pduName,
        checked: this.filter.pdus?.includes(pdu.pduName),
      }))
      .sort((a, b) => a.text.localeCompare(b.text))
  }

  generateReportingTeamCheckboxArgs(): CheckboxesArgsItem[] {
    let checkboxItems: CheckboxesArgsItem[] = []

    if (this.showReportingTeams) {
      const selectedPdus = this.group.filters.locationFilters.filter(location =>
        this.filter.pdus!.includes(location.pduName),
      )
      const allReportingTeams = Array.from(new Set(selectedPdus?.flatMap(pdu => pdu.reportingTeams) ?? [])).sort()
      checkboxItems = allReportingTeams
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

    return this.section === GroupAllocationsPageSection.Allocated
      ? 'There are currently no people allocated to this group.'
      : `There are no people awaiting allocation in ${this.group.group.regionName}.`
  }
}

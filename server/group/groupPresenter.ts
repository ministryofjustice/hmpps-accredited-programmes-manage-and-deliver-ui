import { Group, ProgrammeGroupCohortEnum } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import Pagination from '../utils/pagination/pagination'
import { CheckboxesArgsItem, SelectArgsItem, TableArgs } from '../utils/govukFrontendTypes'
import GroupListFilter from '../groupDetails/groupListFilter'

const cohortConfigMap: Record<ProgrammeGroupCohortEnum, string> = {
  SEXUAL: 'Sexual offence',
  GENERAL: 'General offence',
  GENERAL_LDC: 'General offence',
  SEXUAL_LDC: 'General offence',
}

export enum GroupListPageSection {
  NOT_STARTED = 1,
  IN_PROGRESS_OR_COMPLETE = 2,
}

export default class GroupPresenter {
  public readonly pagination: Pagination

  public readonly selectedPdu: string | undefined

  public readonly deliveryLocations: string[] = []

  public readonly params?: string

  constructor(
    readonly groupListItems: Page<Group>,
    readonly section: GroupListPageSection,
    readonly otherGroupListCountTotal: number,
    readonly regionName: string,
    readonly filter: GroupListFilter,
    readonly pduNames: string[],
    deliveryLocations?: string[],
  ) {
    this.params = filter.paramsAsQueryParams
    this.groupListItems = groupListItems
    this.pagination = new Pagination(this.groupListItems as Required<typeof this.groupListItems>)
    this.selectedPdu = this.filter.pdu ?? undefined
    this.deliveryLocations = deliveryLocations ?? []
  }

  get text() {
    return {
      pageHeading: `Building Choices groups`,
      regionName: this.regionName,
    }
  }

  get groupTableArgs(): TableArgs {
    return {
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      head: [
        {
          text: 'Group code',
          attributes: {
            'aria-sort': 'ascending',
          },
        },
        {
          text: 'Start date',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'PDU',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Delivery location',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Cohort',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Sex',
          attributes: {
            'aria-sort': 'none',
          },
        },
      ],
      rows: this.generateTableRows(),
    }
  }

  private generateTableRows() {
    const groupData: ({ html: string; text?: undefined } | { text: string; html?: undefined })[][] = []
    this.groupListItems.content.forEach(group => {
      groupData.push([
        { html: `<a href='/groupDetails/${group.id}/waitlist'>${group.code}</a>` },
        { text: group.startDate },
        { text: group.pduName },
        { text: group.deliveryLocation },
        {
          html: `${cohortConfigMap[group.cohort]}${this.hasLdcTagHtml(group)}`,
        },
        { text: group.sex },
      ])
    })
    return groupData
  }

  private hasLdcTagHtml(group: Group): string {
    return group.cohort.toString() === 'GENERAL_LDC' || group.cohort.toString() === 'SEXUAL_LDC'
      ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>'
      : ''
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    const possiblyAppendParams = (url: string, params?: string) => {
      if (!params) return url
      return `${url}?${params}`
    }
    return {
      items: [
        {
          text: `Not started (${this.section === GroupListPageSection.NOT_STARTED ? this.groupListItems.totalElements : this.otherGroupListCountTotal})`,
          href: possiblyAppendParams(`/groups/not-started`, this.params),
          active: this.section === GroupListPageSection.NOT_STARTED,
        },
        {
          text: `In progress or completed (${this.section === GroupListPageSection.IN_PROGRESS_OR_COMPLETE ? this.groupListItems.totalElements : this.otherGroupListCountTotal})`,
          href: possiblyAppendParams(`/groups/started`, this.params),
          active: this.section === GroupListPageSection.IN_PROGRESS_OR_COMPLETE,
        },
      ],
    }
  }

  get showDeliveryLocations(): boolean {
    return !!this.selectedPdu
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

  generatePduSelectArgs(): SelectArgsItem[] {
    const selectOptions: SelectArgsItem[] = [
      {
        text: 'Select PDU',
        value: '',
      },
    ]
    const pduSelectArgs = this.pduNames
      .map(pdu => ({
        text: pdu,
        value: pdu,
        selected: this.filter.pdu === pdu,
      }))
      .sort((a, b) => a.text.localeCompare(b.text))
    return selectOptions.concat(pduSelectArgs)
  }

  generateDeliveryLocationCheckboxArgs(): CheckboxesArgsItem[] {
    return this.deliveryLocations.map(deliveryLocation => ({
      text: deliveryLocation,
      value: deliveryLocation,
      checked: this.filter.deliveryLocations?.includes(deliveryLocation) ?? false,
    }))
  }

  generateCohortSelectArgs(): SelectArgsItem[] {
    const cohortOptions = ['General offence', 'Sexual offence']
    const selectOptions: SelectArgsItem[] = [
      {
        text: 'Select',
        value: '',
      },
    ]
    cohortOptions.forEach(cohort => {
      selectOptions.push({
        value: cohort,
        text: cohort,
        selected: this.filter.cohort === cohort,
      })
    })
    return selectOptions
  }

  generateSexSelectArgs(): SelectArgsItem[] {
    return [
      {
        text: 'Select',
        value: '',
      },
      {
        value: 'MALE',
        text: 'Male',
        selected: this.filter.sex === 'MALE',
      },
      {
        value: 'FEMALE',
        text: 'Female',
        selected: this.filter.sex === 'FEMALE',
      },
    ]
  }
}

import { Group, ProgrammeGroupCohortEnum } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import Pagination from '../utils/pagination/pagination'
import { TableArgs } from '../utils/govukFrontendTypes'

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

  public readonly params?: string

  constructor(
    readonly groupListItems: Page<Group>,
    readonly section: GroupListPageSection,
    readonly otherGroupListCountTotal: number,
    readonly regionName: string,
  ) {
    // this.pagination = new Pagination(groupListItems, null)
    // this.groupListItems = groupListItems

    this.groupListItems = groupListItems
    this.pagination = new Pagination(this.groupListItems as Required<typeof this.groupListItems>)
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
        // {
        //   text: 'Allocated',
        //   attributes: {
        //     'aria-sort': 'none',
        //   },
        // },
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
    return {
      items: [
        {
          text: `Not started (${this.section === GroupListPageSection.NOT_STARTED ? this.groupListItems.totalElements : this.otherGroupListCountTotal})`,
          // Below will be used when we introduce pagination for groups
          // href: this.params !== undefined ? `/groups/not-started?${this.params}` : `/groups/not-started`,
          href: `/groups/not-started`,
          active: this.section === GroupListPageSection.NOT_STARTED,
        },
        {
          text: `In progress or completed (${this.section === GroupListPageSection.IN_PROGRESS_OR_COMPLETE ? this.groupListItems.totalElements : this.otherGroupListCountTotal})`,
          // Below will be used when we introduce pagination for groups
          // href: this.params !== undefined ? `/groups/started?${this.params}` : `/groups/started`,
          href: `/groups/started`,
          active: this.section === GroupListPageSection.IN_PROGRESS_OR_COMPLETE,
        },
      ],
    }
  }
}

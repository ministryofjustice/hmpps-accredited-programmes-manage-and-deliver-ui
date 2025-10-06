import { CaseListFilterValues, CohortEnum, ReferralCaseListItem } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import { SelectArgs, SelectArgsItem, TableArgs } from '../utils/govukFrontendTypes'
import Pagination from '../utils/pagination/pagination'
import CaselistFilter from './caselistFilter'
import CaselistUtils from './caseListUtils'

export enum CaselistPageSection {
  Open = 1,
  Closed = 2,
}

const cohortConfigMap: Record<CohortEnum, string> = {
  SEXUAL_OFFENCE: 'Sexual Offence',
  GENERAL_OFFENCE: 'General Offence',
}

export default class CaselistPresenter {
  public readonly pagination: Pagination

  public readonly openOrClosedUrl: string

  constructor(
    readonly section: CaselistPageSection,
    readonly referralCaseListItems: Page<ReferralCaseListItem>,
    readonly filter: CaselistFilter,
    readonly params: string,
    readonly isOpenReferrals: boolean,
    readonly caseListFilters: CaseListFilterValues,
  ) {
    this.pagination = new Pagination(referralCaseListItems, params)
    this.referralCaseListItems = referralCaseListItems
    this.openOrClosedUrl = isOpenReferrals ? 'open-referrals' : 'closed-referrals'
  }

  readonly text = {
    pageHeading: `Building Choices: moderate intensity`,
  }

  get showReportingLocations(): boolean {
    return this.filter.pdu !== undefined && this.filter.pdu !== ''
  }

  getCaseloadTableArgs(): TableArgs {
    return {
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      head: [
        {
          text: 'Name and CRN',
          attributes: {
            'aria-sort': 'ascending',
          },
        },

        {
          text: 'Referral status',
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
      ],
      rows: this.generateTableRows(),
    }
  }

  get locations() {
    return [
      {
        pdu: 'London',
        locations: ['North', 'South', 'East', 'West'],
      },
      {
        pdu: 'Manchester',
        locations: ['Area 1', 'Area 2', 'Area 3', 'Area 4'],
      },
      {
        pdu: 'Liverpool',
        locations: ['Up', 'Down', 'Left', 'Right'],
      },
    ]
  }

  generateTableRows() {
    const referralData: ({ html: string; text?: undefined } | { text: string; html?: undefined })[][] = []
    this.referralCaseListItems.content.forEach(referral => {
      referralData.push([
        {
          html: `<a href='/referral-details/${referral.referralId}/personal-details'>${referral.personName}</a><br><span>${referral.crn}</span>`,
        },

        { text: referral.referralStatus },

        {
          html: `${cohortConfigMap[referral.cohort]}${CaselistUtils.hasLdcTagHtml(referral)}`,
        },
      ])
    })
    return referralData
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: `Open referrals (${this.section === CaselistPageSection.Open ? this.referralCaseListItems.totalElements : this.caseListFilters.otherReferralsCount})`,
          href: `/pdu/open-referrals`,
          active: this.section === CaselistPageSection.Open,
        },
        {
          text: `Closed referrals (${this.section === CaselistPageSection.Closed ? this.referralCaseListItems.totalElements : this.caseListFilters.otherReferralsCount})`,
          href: `/pdu/closed-referrals`,
          active: this.section === CaselistPageSection.Closed,
        },
      ],
    }
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

  generateFilterPane() {
    const categories = this.generateSelectedFilters()
    if (categories.length !== 0) {
      return {
        heading: {
          text: 'Selected filters',
        },

        clearLink: {
          text: 'Clear filters',
          href: this.section === 1 ? '/pdu/open-referrals' : '/pdu/closed-referrals',
        },
        categories,
      }
    }
    return null
  }

  generateSelectedFilters() {
    const selectedFilters = []
    const openAndClosedStatus: string[] = this.caseListFilters.statusFilters.open.concat(
      this.caseListFilters.statusFilters.closed,
    )

    if (this.filter.status) {
      const searchParams = new URLSearchParams(this.params)
      searchParams.delete('status')
      const paramAttributes = openAndClosedStatus.filter(referralStatus => referralStatus === this.filter.status)
      selectedFilters.push({
        heading: {
          text: 'Referral Status',
        },
        items: [
          {
            href: `/pdu/${this.openOrClosedUrl}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
            text: paramAttributes[0],
          },
        ],
      })
    }

    if (this.filter.cohort) {
      const searchParams = new URLSearchParams(this.params)
      searchParams.delete('cohort')
      const paramAttributes = CaselistUtils.cohorts.filter(cohort => cohort.value === this.filter.cohort)
      selectedFilters.push({
        heading: {
          text: 'Cohort',
        },
        items: [
          {
            href: `/pdu/${this.openOrClosedUrl}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
            text: paramAttributes[0].text,
          },
        ],
      })
    }

    if (this.filter.crnOrPersonName) {
      const searchParams = new URLSearchParams(this.params)
      searchParams.delete('crnOrPersonName')
      selectedFilters.push({
        heading: {
          text: 'Name Or Crn',
        },
        items: [
          {
            href: `/pdu/${this.openOrClosedUrl}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
            text: this.filter.crnOrPersonName,
          },
        ],
      })
    }

    if (this.filter.pdu) {
      const searchParams = new URLSearchParams(this.params)
      searchParams.delete('pdu')
      selectedFilters.push({
        heading: {
          text: 'PDU',
        },
        items: [
          {
            href: `/pdu/${this.openOrClosedUrl}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
            text: this.filter.pdu,
          },
        ],
      })
    }

    if (this.filter.reportingTeam) {
      const reportingTeams =
        typeof this.filter.reportingTeam === 'string' ? [this.filter.reportingTeam] : this.filter.reportingTeam
      selectedFilters.push({
        heading: {
          text: 'Reporting Team',
        },
        items: reportingTeams.map(reportingTeamFilter => {
          const searchParams = new URLSearchParams(this.params)
          searchParams.delete('reportingTeam', reportingTeamFilter)
          return {
            href: `/pdu/${this.openOrClosedUrl}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
            text: reportingTeamFilter,
          }
        }),
      })
    }
    return selectedFilters
  }
}

import { ReferralCaseListItem } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import { SelectArgs, SelectArgsItem, TableArgs } from '../utils/govukFrontendTypes'
import Pagination from '../utils/pagination/pagination'
import CaselistFilter from './caselistFilter'
import CaselistUtils from './caseListUtils'

export enum CaselistPageSection {
  Open = 1,
  Closed = 2,
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
  ) {
    this.pagination = new Pagination(referralCaseListItems, params)
    this.referralCaseListItems = referralCaseListItems
    this.openOrClosedUrl = isOpenReferrals ? 'open-referrals' : 'closed-referrals'
  }

  readonly text = {
    pageHeading: `Building Choices: moderate intensity`,
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
      ],
      rows: this.generateTableRows(),
    }
  }

  generateTableRows() {
    const referralData: ({ html: string; text?: undefined } | { text: string; html?: undefined })[][] = []
    this.referralCaseListItems.content.forEach(referral => {
      referralData.push([
        {
          html: `<a href='/personalDetails/${referral.referralId}'>${referral.personName}</a><br><span>${referral.crn}</span>`,
        },

        { text: referral.referralStatus },
      ])
    })
    return referralData
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: `Open referrals (${this.referralCaseListItems.totalElements})`,
          href: `/pdu/open-referrals`,
          active: this.section === CaselistPageSection.Open,
        },
        {
          text: `Closed referrals (${this.referralCaseListItems.totalElements})`,
          href: `/pdu/closed-referrals`,
          active: this.section === CaselistPageSection.Closed,
        },
      ],
    }
  }

  readonly searchBycrnOrPersonNameArgs = {
    id: 'crnOrPersonName',
    name: 'crnOrPersonName',
    label: {
      text: 'Search by name or CRN',
      classes: 'govuk-label--s',
    },
  }

  searchByCohortArgs(): SelectArgs {
    return {
      id: 'cohort',
      name: 'cohort',
      label: {
        text: 'Cohort',
        classes: 'govuk-label--s',
      },
      items: this.generateSelectValues(CaselistUtils.cohorts, this.filter.cohort),
    }
  }

  searchByStatusArgs(): SelectArgs {
    return {
      id: 'referralStatus',
      name: 'referralStatus',
      label: {
        text: 'Referral status',
        classes: 'govuk-label--s',
      },
      items: this.generateSelectValues(CaselistUtils.referralStatus, this.filter.referralStatus),
    }
  }

  generateSelectValues(options: { value: string; text: string }[], caseListFilter: string): SelectArgsItem[] {
    const selectOptions: SelectArgsItem[] = [
      {
        text: 'Select',
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

    if (this.filter.referralStatus) {
      const searchParams = new URLSearchParams(this.params)
      searchParams.delete('referralStatus')
      const paramAttributes = CaselistUtils.referralStatus.filter(
        referralStatus => referralStatus.value === this.filter.referralStatus,
      )
      selectedFilters.push({
        heading: {
          text: 'Referral Status',
        },
        items: [
          {
            // href: `/interventions/${this.setting}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
            text: paramAttributes[0].text,
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
            // href: `/interventions/${this.setting}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
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

    return selectedFilters
  }
}

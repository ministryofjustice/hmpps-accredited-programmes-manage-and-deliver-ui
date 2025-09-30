import { CaseListFilters, CohortEnum, ReferralCaseListItem, StatusFilterItems } from '@manage-and-deliver-api'
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
    readonly caseListFilters: CaseListFilters,
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

  searchByStatusArgs(): {
    id: string
    name: string
    prompt: string
    label: { text: string }
    items: { label: string; items: SelectArgsItem[] }[]
    attributes: { 'data-testid': string }
    classes: string
  } {
    return {
      id: 'status',
      name: 'status',
      prompt: 'Select',
      label: {
        text: 'Referral status',
      },
      items: [
        {
          label: 'Open referrals',
          items: this.generateStatusSelectOpts(this.caseListFilters.statusFilters.open, this.filter.status),
        },
        {
          label: 'Closed referrals',
          items: this.generateStatusSelectOpts(this.caseListFilters.statusFilters.closed, this.filter.status),
        },
      ],
      attributes: { 'data-testid': 'referral-status-select' },
      classes: 'govuk-select--restrict-width',
    }
  }

  generateStatusSelectOpts(options: { value: string; text: string }[], caseListFilter: string): SelectArgsItem[] {
    return options.map(option => ({
      value: option.value,
      text: option.text,
      selected: caseListFilter?.includes(`${option.value}`) ?? false,
    }))
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
    const openAndClosedStasus: StatusFilterItems[] = this.caseListFilters.statusFilters.open.concat(
      this.caseListFilters.statusFilters.closed,
    )

    if (this.filter.status) {
      const searchParams = new URLSearchParams(this.params)
      searchParams.delete('status')
      const paramAttributes = openAndClosedStasus.filter(referralStatus => referralStatus.value === this.filter.status)
      selectedFilters.push({
        heading: {
          text: 'Referral Status',
        },
        items: [
          {
            href: `/pdu/${this.openOrClosedUrl}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
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

    return selectedFilters
  }
}

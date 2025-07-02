import Caselist from '../models/caseList'
import { SelectArgs, SelectArgsItem, TableArgs } from '../utils/govukFrontendTypes'
import CaselistFilter from './caselistFilter'
import CaselistUtils from './caseListUtils'

export enum CaselistPageSection {
  Open = 1,
  Closed = 2,
}

export default class CaselistPresenter {
  constructor(
    readonly section: CaselistPageSection,
    readonly caselist: Caselist,
    readonly filter: CaselistFilter,
    readonly params: string,
  ) {}

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
          text: 'Probation Office',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Sentence and Date',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'PSS end date',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Sentence',
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
    this.caselist.referrals.forEach(referral => {
      referralData.push([
        { html: `<a href='#'>${referral.personName}</a><br><span>${referral.personCrn}</span>` },
        { text: 'Brighton Probation Office' },
        { text: '20 May 2025 Licence end date' },
        { text: '21 Dec 2025' },
        { text: 'ORA Adult custody (inc PSS) (11 months)' },
        { text: 'Sexual offence' },
        { text: 'Referral submitted' },
      ])
    })
    return referralData
  }

  getSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: 'Open referrals',
          href: `/pdu/open-referrals`,
          active: this.section === CaselistPageSection.Open,
        },
        {
          text: 'Closed referrals',
          href: `/pdu/closed-referrals`,
          active: this.section === CaselistPageSection.Closed,
        },
      ],
    }
  }

  readonly searchByNameOrCrnArgs = {
    id: 'nameOrCrn',
    name: 'nameOrCrn',
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
      classes: 'test',
      items: this.generateSelectValues(CaselistUtils.referralStatus, this.filter.referralStatus),
    }
  }

  generateSelectValues(options: { value: string; text: string }[], caseListFilter: string): SelectArgsItem[] {
    const selectOptions: SelectArgsItem[] = [
      {
        text: 'Select',
        disabled: true,
        selected: true,
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
          href: `/`,
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
      searchParams.delete('referralStatus')
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

    if (this.filter.nameOrCrn) {
      const searchParams = new URLSearchParams(this.params)
      searchParams.delete('nameOrCrn')

      selectedFilters.push({
        heading: {
          text: 'Name Or Crn',
        },
        items: [
          {
            // href: `/interventions/${this.setting}${searchParams.size === 0 ? '' : `?${searchParams.toString()}`}`,
            text: this.filter.nameOrCrn,
          },
        ],
      })
    }

    return selectedFilters
  }
}

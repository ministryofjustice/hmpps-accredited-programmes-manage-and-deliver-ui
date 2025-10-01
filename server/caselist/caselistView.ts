import { SelectArgsItem } from '../utils/govukFrontendTypes'
import CaselistPresenter from './caselistPresenter'

export default class CaselistView {
  constructor(private readonly presenter: CaselistPresenter) {}

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
          items: this.generateStatusSelectOpts(
            this.presenter.caseListFilters.statusFilters.open,
            this.presenter.filter.status,
          ),
        },
        {
          label: 'Closed referrals',
          items: this.generateStatusSelectOpts(
            this.presenter.caseListFilters.statusFilters.closed,
            this.presenter.filter.status,
          ),
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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'caselist/caselist',
      {
        presenter: this.presenter,
        subNavArgs: this.presenter.getSubNavArgs(),
        selectedFilters: this.presenter.generateFilterPane(),
        searchByStatusArgs: this.searchByStatusArgs(),
        pagination: this.presenter.pagination.mojPaginationArgs,
      },
    ]
  }
}

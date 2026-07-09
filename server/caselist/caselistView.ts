import { CheckboxesArgs, InputArgs, SelectArgs, SelectArgsItem } from '../utils/govukFrontendTypes'
import CaselistPresenter from './caselistPresenter'

export default class CaselistView {
  constructor(private readonly presenter: CaselistPresenter) {}

  searchByStatusArgs(): {
    id: string
    name: string
    prompt: string
    label: { text: string; classes: string }
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
        classes: 'govuk-label--s',
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

  generateStatusSelectOpts(options: string[], caseListFilter: string): SelectArgsItem[] {
    return options.map(option => ({
      value: option,
      text: option,
      selected: caseListFilter?.includes(`${option}`) ?? false,
    }))
  }

  private get pduCheckboxArgs(): CheckboxesArgs {
    return {
      name: 'pdu',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'PDU',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--s',
        },
      },
      items: this.presenter.generatePDUCheckboxArgs(),
    }
  }

  private get reportingTeamCheckboxArgs(): CheckboxesArgs {
    return {
      name: 'reportingTeam',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Reporting team',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--s',
        },
      },
      items: this.presenter.generateReportingTeamCheckboxArgs(),
    }
  }

  private get searchByCrnOrPersonNameArgs(): InputArgs {
    return {
      id: 'crnOrPersonName',
      name: 'crnOrPersonName',
      label: {
        text: 'Name or CRN',
        classes: 'govuk-label--s',
      },
      value: this.presenter.filter.crnOrPersonName,
    }
  }

  private get searchByCohortArgs(): SelectArgs {
    return {
      id: 'cohort',
      name: 'cohort',
      label: {
        text: 'Cohort',
        classes: 'govuk-label--s',
      },
      items: this.presenter.generateCohortSelectArgs(),
    }
  }

  private get applyFilterButtonArgs() {
    return { text: 'Apply filters', classes: 'govuk-!-margin-top-4' }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'caselist/caselist',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        subNavArgs: this.presenter.getSubNavArgs(),
        searchByStatusArgs: this.searchByStatusArgs(),
        pagination: this.presenter.pagination.govukPaginationArgs,
        searchByPduArgs: this.pduCheckboxArgs,
        reportingTeamCheckboxArgs: this.reportingTeamCheckboxArgs,
        searchByCrnOrPersonNameArgs: this.searchByCrnOrPersonNameArgs,
        searchByCohortArgs: this.searchByCohortArgs,
        applyFilterButtonArgs: this.applyFilterButtonArgs,
        noResultsString: this.presenter.generateNoResultsString(),
        resultsText: this.presenter.resultsText,
        text: this.presenter.text,
      },
    ]
  }
}

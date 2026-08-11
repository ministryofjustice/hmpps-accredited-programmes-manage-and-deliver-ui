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
    const pduItems = this.presenter.generatePDUCheckboxArgs()
    const pduOptionCount = pduItems.length
    const optionWord = pduOptionCount === 1 ? 'option' : 'options'

    return {
      name: 'pdu',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          html: `PDU <span class="govuk-visually-hidden">, ${pduOptionCount} ${optionWord}</span>`,
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--s',
        },
      },
      items: pduItems,
    }
  }

  private get reportingTeamCheckboxArgs(): CheckboxesArgs {
    const reportingTeamItems = this.presenter.generateReportingTeamCheckboxArgs()
    const reportingTeamOptionCount = reportingTeamItems.length
    const optionWord = reportingTeamOptionCount === 1 ? 'option' : 'options'

    return {
      name: 'reportingTeam',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          html: `Reporting team <span class="govuk-visually-hidden">, ${reportingTeamOptionCount} ${optionWord}</span>`,
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--s',
        },
      },
      items: reportingTeamItems,
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

  private get searchBySexArgs(): SelectArgs {
    return {
      id: 'sex',
      name: 'sex',
      label: {
        text: 'Select sex',
        classes: 'govuk-label--s',
      },
      items: this.presenter.generateSexSelectArgs(),
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
        searchBySexArgs: this.searchBySexArgs,
        applyFilterButtonArgs: this.applyFilterButtonArgs,
        noResultsString: this.presenter.generateNoResultsString(),
        resultsText: this.presenter.resultsText,
        text: this.presenter.text,
      },
    ]
  }
}

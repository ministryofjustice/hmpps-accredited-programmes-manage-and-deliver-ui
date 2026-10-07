import { InputArgs } from '../utils/govukFrontendTypes'
import { CollapsibleCheckboxFilterArgs } from '../utils/collapsibleCheckboxFilterArgs'
import CaselistPresenter from './caselistPresenter'

export default class CaselistView {
  constructor(private readonly presenter: CaselistPresenter) {}

  searchByStatusArgs(): CollapsibleCheckboxFilterArgs {
    const groups = this.presenter.generateStatusCheckboxGroups()
    const selectedCount = groups.reduce(
      (count, group) => count + group.options.filter(option => option.checked).length,
      0,
    )
    return {
      title: 'Referral status',
      name: 'status',
      dataQa: 'referral-status',
      selectedCount,
      groups,
    }
  }

  private get searchByPduArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generatePDUCheckboxArgs().map(item => ({
      value: `${item.value}`,
      label: item.text,
      checked: item.checked ?? false,
    }))
    return {
      title: 'PDU',
      name: 'pdu',
      dataQa: 'pdu',
      searchable: true,
      // searchLabel: 'Search PDUs',
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  private get reportingTeamCheckboxArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generateReportingTeamCheckboxArgs().map(item => ({
      value: `${item.value}`,
      label: item.text,
      checked: item.checked ?? false,
    }))
    return {
      title: 'Reporting team',
      name: 'reportingTeam',
      dataQa: 'reporting-team',
      searchable: true,
      // searchLabel: 'Search reporting teams',
      selectedCount: options.filter(option => option.checked).length,
      options,
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

  private get searchByCohortArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generateCohortCheckboxOptions()
    return {
      title: 'Cohort',
      name: 'cohort',
      dataQa: 'cohort',
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  private get searchBySexArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generateSexCheckboxOptions()
    return {
      title: 'Sex',
      name: 'sex',
      dataQa: 'sex',
      selectedCount: options.filter(option => option.checked).length,
      options,
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
        searchByPduArgs: this.searchByPduArgs,
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

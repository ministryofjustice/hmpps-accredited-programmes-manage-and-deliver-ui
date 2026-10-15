import { InputArgs, TableArgs } from '../../utils/govukFrontendTypes'
import { CollapsibleCheckboxFilterArgs } from '../../utils/collapsibleCheckboxFilterArgs'
import ViewUtils from '../../utils/viewUtils'
import GroupAllocationsPresenter, { GroupAllocationsPageSection } from './groupAllocationsPresenter'

export default class GroupAllocationsView {
  constructor(private readonly presenter: GroupAllocationsPresenter) {}

  private get searchByCrnOrPersonNameArgs(): InputArgs {
    return {
      id: 'nameOrCRN',
      name: 'nameOrCRN',
      label: {
        text: 'Name or CRN',
        classes: 'govuk-label--s',
      },
      value: this.presenter.filter.nameOrCRN,
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

  private get pduCheckboxArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generatePduCheckboxArgs().map(item => ({
      value: `${item.value}`,
      label: item.text,
      checked: item.checked ?? false,
    }))
    return {
      title: 'PDU',
      name: 'pdu',
      dataQa: 'pdu',
      searchable: true,
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  getGroupAllocationsTableArgs(): TableArgs {
    return {
      caption: this.presenter.tableCaption,
      captionClasses: this.presenter.tableCaptionClass,
      attributes: {
        'data-module': 'moj-sortable-table',
        'data-caselist-table': 'true',
      },
      classes: this.presenter.section === GroupAllocationsPageSection.Allocated ? 'allocated' : '',
      head: this.presenter.generateTableHeadings(),
      rows:
        this.presenter.section === GroupAllocationsPageSection.Allocated
          ? this.presenter.generateAllocatedTableArgs()
          : this.presenter.generateWaitlistTableArgs(),
    }
  }

  private successMessageArgs() {
    if (!this.presenter.successMessage) {
      return null
    }

    return {
      variant: 'success',
      title: this.presenter.successMessage,
      showTitleAsHeading: true,
      dismissible: true,
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
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  private get applyFilterButtonArgs() {
    return { text: 'Apply filters', classes: 'govuk-!-margin-top-4' }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupOverview/groupOverview',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        subNavArgs: this.presenter.getSubNavArgs(),
        searchByCrnOrPersonNameArgs: this.searchByCrnOrPersonNameArgs,
        isWaitlist: this.presenter.section === GroupAllocationsPageSection.Waitlist,
        pagination: this.presenter.pagination.govukPaginationArgs,
        searchByCohortArgs: this.searchByCohortArgs,
        searchBySexArgs: this.searchBySexArgs,
        pduCheckboxArgs: this.pduCheckboxArgs,
        formButtonArgs: this.presenter.formButtonArgs,
        getGroupAllocationsTableArgs: this.getGroupAllocationsTableArgs(),
        successMessageArgs: this.successMessageArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        reportingTeamCheckboxArgs: this.reportingTeamCheckboxArgs,
        text: this.presenter.text,
        hasResults: this.presenter.hasResults(),
        noResultsString: this.presenter.generateNoResultsString(),
        resultsText: this.presenter.resultsText,
        serviceNavigationArgs: this.presenter.getMojSubNavigationArgs(),
        applyFilterButtonArgs: this.applyFilterButtonArgs,
      },
    ]
  }
}

import { CheckboxesArgs, InputArgs, SelectArgs, TableArgs } from '../../utils/govukFrontendTypes'
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

  private get searchByCohortArgs(): SelectArgs {
    return {
      id: 'cohort',
      name: 'cohort',
      label: {
        text: 'Cohort',
        classes: 'govuk-label--s',
      },
      items: this.presenter.generateSelectValues(
        this.presenter.group.filters.cohort,
        this.presenter.filter.cohort,
        'Select cohort',
      ),
    }
  }

  private get searchBySexArgs(): SelectArgs {
    return {
      id: 'sex',
      name: 'sex',
      label: {
        text: 'Sex',
        classes: 'govuk-label--s',
      },
      items: this.presenter.generateSelectValues(
        this.presenter.group.filters.sex,
        this.presenter.filter.sex,
        'Select sex',
      ),
    }
  }

  private get searchByPduArgs(): SelectArgs {
    return {
      id: 'pdu',
      name: 'pdu',
      label: {
        text: 'PDU',
        classes: 'govuk-label--s',
      },
      items: this.presenter.generatePduSelectArgs(),
    }
  }

  getGroupOverviewTableArgs(): TableArgs {
    return {
      attributes: {
        'data-module': 'moj-sortable-table',
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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupOverview/groupOverview',
      {
        presenter: this.presenter,
        subNavArgs: this.presenter.getSubNavArgs(),
        searchByCrnOrPersonNameArgs: this.searchByCrnOrPersonNameArgs,
        isWaitlist: this.presenter.section === GroupAllocationsPageSection.Waitlist,
        pagination: this.presenter.pagination.govukPaginationArgs,
        searchByCohortArgs: this.searchByCohortArgs,
        searchBySexArgs: this.searchBySexArgs,
        searchByPduArgs: this.searchByPduArgs,
        formButtonArgs: this.presenter.formButtonArgs,
        getGroupOverviewTableArgs: this.getGroupOverviewTableArgs(),
        successMessageArgs: this.successMessageArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        reportingTeamCheckboxArgs: this.reportingTeamCheckboxArgs,
        text: this.presenter.text,
        hasResults: this.presenter.hasResults(),
        noResultsString: this.presenter.generateNoResultsString(),
        resultsText: this.presenter.resultsText,
        serviceNavigationArgs: this.presenter.getServiceNavigationArgs(),
      },
    ]
  }
}

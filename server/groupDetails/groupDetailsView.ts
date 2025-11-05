import { CheckboxesArgs, InputArgs, SelectArgs, TableArgs } from '../utils/govukFrontendTypes'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import ViewUtils from '../utils/viewUtils'

export default class GroupDetailsView {
  constructor(private readonly presenter: GroupDetailsPresenter) {}

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
        this.presenter.group.allocationAndWaitlistData.filters.cohort,
        this.presenter.filter.cohort,
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
        this.presenter.group.allocationAndWaitlistData.filters.sex,
        this.presenter.filter.sex,
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

  getGroupDetailsTableArgs(): TableArgs {
    return {
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      classes: this.presenter.section === GroupDetailsPageSection.Allocated ? 'allocated' : '',
      head: this.presenter.generateTableHeadings(),
      rows:
        this.presenter.section === GroupDetailsPageSection.Allocated
          ? this.presenter.generateAllocatedTableArgs()
          : this.presenter.generateWaitlistTableArgs(),
    }
  }

  private successMessageArgs() {
    return {
      variant: 'success',
      title: `${this.presenter.personName} was added to this group. Their referral status is now Scheduled.`,
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
      'groupDetails/groupDetails',
      {
        presenter: this.presenter,
        subNavArgs: this.presenter.getSubNavArgs(),
        searchByCrnOrPersonNameArgs: this.searchByCrnOrPersonNameArgs,
        isWaitlist: this.presenter.section === GroupDetailsPageSection.Waitlist,
        searchByCohortArgs: this.searchByCohortArgs,
        searchBySexArgs: this.searchBySexArgs,
        searchByPduArgs: this.searchByPduArgs,
        formButtonArgs: this.presenter.formButtonArgs,
        getGroupDetailsTableArgs: this.getGroupDetailsTableArgs(),
        isPersonAdded: this.presenter.isPersonAdded,
        successMessageArgs: this.successMessageArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        reportingTeamCheckboxArgs: this.reportingTeamCheckboxArgs,
        text: this.presenter.text,
      },
    ]
  }
}

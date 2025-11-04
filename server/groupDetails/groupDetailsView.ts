import { InputArgs, SelectArgs, TableArgs } from '../utils/govukFrontendTypes'
import GroupDetailsPresenter, { GroupDetailsPageSection } from './groupDetailsPresenter'
import CaselistUtils from '../caselist/caseListUtils'

export default class GroupDetailsView {
  constructor(private readonly presenter: GroupDetailsPresenter) {}

  private get searchByCrnOrPersonNameArgs(): InputArgs {
    return {
      id: 'crnOrPersonName',
      name: 'crnOrPersonName',
      label: {
        text: 'Name or CRN',
        classes: 'govuk-label--s',
      },
      value: '',
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
      items: this.presenter.generateSelectValues(CaselistUtils.cohorts, ''),
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
        [
          { value: 'MALE', text: 'Male' },
          { value: 'FEMALE', text: 'Female' },
        ],
        '',
      ),
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
    if (!this.presenter.isPersonAdded || !this.presenter.addedPersonName) {
      return null
    }

    return {
      variant: 'success',
      title: `${this.presenter.addedPersonName} was added to this group. Their referral status is now Scheduled.`,
      showTitleAsHeading: true,
      dismissible: true,
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
        pagination: this.presenter.pagination.mojPaginationArgs,
        searchByCohortArgs: this.searchByCohortArgs,
        searchBySexArgs: this.searchBySexArgs,
        formButtonArgs: this.presenter.formButtonArgs,
        getGroupDetailsTableArgs: this.getGroupDetailsTableArgs(),
        isPersonAdded: this.presenter.isPersonAdded,
        successMessageArgs: this.successMessageArgs(),
      },
    ]
  }
}

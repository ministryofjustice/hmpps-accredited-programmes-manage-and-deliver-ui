import { InputArgs, SelectArgs } from '../utils/govukFrontendTypes'
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
        formButtonArgs: this.presenter.formButtonArgs,
      },
    ]
  }
}

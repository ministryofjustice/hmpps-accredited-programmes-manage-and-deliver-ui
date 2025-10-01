import CaselistPresenter from './caselistPresenter'
import { CheckboxesArgs, SelectArgs, SelectArgsItem } from '../utils/govukFrontendTypes'
import CaselistUtils from './caseListUtils'

export default class CaselistView {
  constructor(private readonly presenter: CaselistPresenter) {}

  searchByPduArgs(): SelectArgs {
    return {
      id: 'pdu',
      name: 'pdu',
      label: {
        text: 'Select pdu',
        classes: 'govuk-label--s',
      },
      items: this.presenter.generateSelectValues(CaselistUtils.referralStatus, this.presenter.filter.status),
    }
  }

  private checkboxArgs(): CheckboxesArgs {
    return {
      name: 'pdu-locations',
      fieldset: {
        legend: {
          text: 'locations',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      // hint: {
      //   text: `Select any locations ${this.presenter.details.personName} can attend. You can skip this question if you do not know.`,
      // },
      items: [
        {
          value: 'a',
          text: 'Red',
        },
        {
          value: 'b',
          text: 'Yellow',
        },
        {
          value: 'c',
          text: 'Blue',
        },
      ],
    }
  }

  private get probationOfficeSelectArgs(): SelectArgs {
    return {
      id: 'probation-office',
      name: 'probation-office',
      classes: 'confirm-probation-office',
      label: {
        text: 'Search by colour',
        classes: 'govuk-label--s',
      },
      items: [
        {
          text: 'blue',
          value: 'blue',
          selected: false,
        },
        {
          text: 'green',
          value: 'green',
          selected: false,
        },
        {
          text: 'red',
          value: 'red',
          selected: false,
        },
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'caselist/caselist',
      {
        presenter: this.presenter,
        subNavArgs: this.presenter.getSubNavArgs(),
        selectedFilters: this.presenter.generateFilterPane(),
        pagination: this.presenter.pagination.mojPaginationArgs,
        searchByPduArgs: this.searchByPduArgs(),
        checkboxArgs: this.checkboxArgs(),
        probationOfficeSelectArgs: this.probationOfficeSelectArgs,
      },
    ]
  }
}

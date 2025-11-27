import GroupPresenter from './groupPresenter'
import { CheckboxesArgs, InputArgs, SelectArgs } from '../utils/govukFrontendTypes'

export default class GroupView {
  constructor(private readonly presenter: GroupPresenter) {}

  private get searchByGroupCodeArgs(): InputArgs {
    return {
      id: 'group-code',
      name: 'group-code',
      // prompt: 'Select',
      label: {
        text: 'Group code',
        classes: 'govuk-label--s',
      },
      value: '',
      classes: 'govuk-select--restrict-width',
    }
  }

  private get searchByPduSelectArgs(): SelectArgs {
    return {
      id: 'pdu',
      name: 'pdu',
      classes: 'confirm-pdu-select',
      label: {
        text: 'PDU',
        classes: 'govuk-label--s',
      },
      items: [],
    }
  }

  private get deliveryTeamCheckboxArgs(): CheckboxesArgs {
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
      items: [],
    }
  }

  private get searchBySexArgs(): SelectArgs {
    return {
      id: 'sexSelect',
      name: 'sexSelect',
      label: {
        text: 'Sex',
        classes: 'govuk-label--s',
      },
      items: [],
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
      items: [],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'group/group',
      {
        groupTableArgs: this.presenter.groupTableArgs,
        subNavArgs: this.presenter.getSubNavArgs(),
        text: this.presenter.text,
        searchByGroupCodeArgs: this.searchByGroupCodeArgs,
        searchByPduSelectArgs: this.searchByPduSelectArgs,
        searchBySexArgs: this.searchBySexArgs,
        searchByCohortArgs: this.searchByCohortArgs,
        deliveryTeamCheckboxArgs: this.deliveryTeamCheckboxArgs,
      },
    ]
  }
}

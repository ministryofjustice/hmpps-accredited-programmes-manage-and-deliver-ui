import GroupPresenter from './groupPresenter'
import { CheckboxesArgs, InputArgs, SelectArgs } from '../utils/govukFrontendTypes'

export default class GroupView {
  constructor(private readonly presenter: GroupPresenter) {}

  private get searchByGroupCodeArgs(): InputArgs {
    return {
      id: 'group-code',
      name: 'group-code',
      label: {
        text: 'Group code',
        classes: 'govuk-label--s',
      },
      value: this.presenter.filter?.groupCode || '',
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
      items: this.presenter.generatePduSelectArgs(),
    }
  }

  private get deliveryTeamCheckboxArgs(): CheckboxesArgs {
    return {
      name: 'deliveryLocations',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Reporting team',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--s',
        },
      },
      items: this.presenter.generateDeliveryLocationCheckboxArgs(),
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
      items: this.presenter.generateSexSelectArgs(),
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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'group/group',
      {
        presenter: this.presenter,
        groupTableArgs: this.presenter.groupTableArgs,
        subNavArgs: this.presenter.getSubNavArgs(),
        pagination: this.presenter.pagination.mojPaginationArgs,
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

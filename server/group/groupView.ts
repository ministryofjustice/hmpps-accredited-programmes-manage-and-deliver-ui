import GroupPresenter from './groupPresenter'
import { CheckboxesArgs, InputArgs, SelectArgs } from '../utils/govukFrontendTypes'

export default class GroupView {
  constructor(private readonly presenter: GroupPresenter) {}

  private get searchByGroupCodeArgs(): InputArgs {
    return {
      id: 'groupCode',
      name: 'groupCode',
      label: {
        text: 'Group code',
        classes: 'govuk-label--s',
      },
      value: this.presenter.filter?.groupCode || '',
      classes: 'govuk-select--restrict-width',
    }
  }

  private get pduCheckboxArgs(): CheckboxesArgs {
    return {
      name: 'pdu',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'PDU',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--s',
        },
      },
      items: this.presenter.generatePDUCheckboxArgs(),
    }
  }

  private get deliveryLocationCheckboxArgs(): CheckboxesArgs {
    return {
      name: 'deliveryLocations',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Delivery Location',
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

  private get pageHeaderOptions(): Record<string, unknown> {
    return {
      heading: {
        html: this.presenter.text.pageHeading,
      },
      items: [
        {
          text: 'Create group',
          classes: 'govuk-button--primary',
          href: '/create-group',
        },
      ],
    }
  }

  private get applyFilterButtonArgs() {
    return { text: 'Apply filters', classes: 'govuk-!-margin-top-4' }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'group/group',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        groupTableArgs: this.presenter.groupTableArgs,
        subNavArgs: this.presenter.getSubNavArgs(),
        pagination: this.presenter.pagination.govukPaginationArgs,
        text: this.presenter.text,
        searchByGroupCodeArgs: this.searchByGroupCodeArgs,
        searchByPduArgs: this.pduCheckboxArgs,
        searchBySexArgs: this.searchBySexArgs,
        searchByCohortArgs: this.searchByCohortArgs,
        deliveryLocationCheckboxArgs: this.deliveryLocationCheckboxArgs,
        pageHeaderOptions: this.pageHeaderOptions,
        resultsText: this.presenter.resultsText,
        hasResults: this.presenter.groupListItems.content.length > 0,
        noResultsText: this.presenter.noResultsText,
        noResultsString: this.presenter.generateNoResultsString(),
        applyFilterButtonArgs: this.applyFilterButtonArgs,
      },
    ]
  }
}

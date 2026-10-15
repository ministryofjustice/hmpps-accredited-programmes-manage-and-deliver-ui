import GroupPresenter from './groupPresenter'
import { ButtonArgs, InputArgs } from '../utils/govukFrontendTypes'
import { CollapsibleCheckboxFilterArgs } from '../utils/collapsibleCheckboxFilterArgs'

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

  private get pduCheckboxArgs(): CollapsibleCheckboxFilterArgs {
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
      searchLabel: 'Search PDUs',
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  private get deliveryLocationCheckboxArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generateDeliveryLocationCheckboxArgs().map(item => ({
      value: `${item.value}`,
      label: item.text,
      checked: item.checked ?? false,
    }))
    return {
      title: 'Delivery Location',
      name: 'deliveryLocations',
      dataQa: 'deliveryLocations',
      searchable: true,
      searchLabel: 'Search delivery locations',
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  private get searchBySexArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generateSexCheckboxArgs().map(item => ({
      value: `${item.value}`,
      label: item.text,
      checked: item.checked ?? false,
    }))
    return {
      title: 'Sex',
      name: 'sex',
      dataQa: 'sex',
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  private get searchByCohortArgs(): CollapsibleCheckboxFilterArgs {
    const options = this.presenter.generateCohortCheckboxArgs().map(item => ({
      value: `${item.value}`,
      label: item.text,
      checked: item.checked ?? false,
    }))
    return {
      title: 'Cohort',
      name: 'cohort',
      dataQa: 'cohort',
      selectedCount: options.filter(option => option.checked).length,
      options,
    }
  }

  private get createGroupButtonArgs(): ButtonArgs {
    return {
      text: 'Create group',
      classes: 'govuk-button--primary govuk-!-margin-bottom-0',
      href: '/create-group',
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
        createGroupButtonArgs: this.createGroupButtonArgs,
        resultsText: this.presenter.resultsText,
        hasResults: this.presenter.groupListItems.content.length > 0,
        noResultsText: this.presenter.noResultsText,
        noResultsString: this.presenter.generateNoResultsString(),
        applyFilterButtonArgs: this.applyFilterButtonArgs,
      },
    ]
  }
}

import CaselistPresenter from './caselistPresenter'
import { CheckboxesArgs, CheckboxesArgsItem, SelectArgs, SelectArgsItem } from '../utils/govukFrontendTypes'
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
    let checkboxItems: CheckboxesArgsItem[] = [{ text: 'No locations', value: 'No locations', checked: false }]
    if (this.presenter.pdu !== null && this.presenter.pdu !== undefined && this.presenter.pdu !== 'Select a pdu') {
      const pduLocationData = this.presenter.locations.find(location => location.pdu === this.presenter.pdu)
      checkboxItems = pduLocationData.locations.map(location => ({
        text: location,
        value: location,
      }))
    }

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
      // text: string; value: string; checked: boolean
      items: checkboxItems,
      //   this.presenter.locations.map(location => {
      //     if(location.pdu === this.presenter.pdu){
      //       return {
      //         text: location.locations,
      //         value: location.locations
      //       }
      //     }
      // })
    }
  }

  private get pduSelectArgs(): SelectArgs {
    return {
      id: 'pdu-select',
      name: 'pdu-select',
      classes: 'confirm-pdu-select',
      label: {
        text: 'Search by pdu',
        classes: 'govuk-label--s',
      },
      items: [
        {
          text: 'Select a pdu',
          value: 'select',
        },
        {
          text: 'London',
          value: 'London',
        },
        {
          text: 'Manchester',
          value: 'Manchester',
        },
        {
          text: 'Liverpool',
          value: 'Liverpool',
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
        pduSelectArgs: this.pduSelectArgs,
        locations: this.presenter.locations,
      },
    ]
  }
}

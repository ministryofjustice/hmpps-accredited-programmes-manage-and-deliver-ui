import { CheckboxesArgsItem } from '../../utils/govukFrontendTypes'

export default class AddAvailabilityPresenter {
  constructor() {}

  checkboxItems: CheckboxesArgsItem[] = [
    {
      value: 'Male',
      text: 'Male',
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'Female',
      text: 'Female',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
    // {
    //   divider: 'or',
    //   class: 'govuk-heading-l',
    // },
  ]
}

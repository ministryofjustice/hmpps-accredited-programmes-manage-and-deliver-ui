import ViewUtils from '../../utils/viewUtils'
import CreateOrEditGroupLocationPresenter from './createOrEditGroupLocationPresenter'
import { RadiosArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'

export default class CreateOrEditGroupLocationView {
  constructor(private readonly presenter: CreateOrEditGroupLocationPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private selectOfficeArgs(): RadiosArgs {
    return {
      name: 'create-group-location',
      fieldset: {
        legend: {
          text: 'Select the delivery location',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: this.presenter.generateRadioOptions(),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupLocation.errorMessage),
    }
  }

  private summary(): SummaryListArgs {
    return {
      rows: [
        {
          key: {
            text: 'PDU',
          },
          value: {
            text: `${this.presenter.createGroupFormData.pduName}`,
          },
          actions: {
            items: [
              {
                href: this.presenter.changeLinkUri,
                text: 'Change',
              },
            ],
          },
        },
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupLocation',
      {
        backLinkArgs: this.backLinkArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        selectOfficeArgs: this.selectOfficeArgs(),
        summary: this.summary(),
      },
    ]
  }
}

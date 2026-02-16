import ViewUtils from '../../utils/viewUtils'
import CreateGroupLocationPresenter from './groupCreateLocationPresenter'
import { RadiosArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'

export default class CreateGroupLocationView {
  constructor(private readonly presenter: CreateGroupLocationPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
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
                href: this.presenter.backLinkUri,
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
      'groupCreate/groupCreateLocation',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        selectOfficeArgs: this.selectOfficeArgs(),
        summary: this.summary(),
      },
    ]
  }
}

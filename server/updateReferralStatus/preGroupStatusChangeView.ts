import PreGroupStatusChangePresenter from './preGroupStatusChangePresenter'
import ViewUtils from '../utils/viewUtils'
import { ButtonArgs, InsetTextArgs } from '../utils/govukFrontendTypes'

export default class PreGroupStatusChangeView {
  constructor(private readonly presenter: PreGroupStatusChangePresenter) {}

  get preGroupOneToOneInsetTextArgs(): InsetTextArgs {
    if (this.presenter.isAddToGroupJourney) {
      return {
        text: `As ${this.presenter.details.personName} has previously started the programme, their referral status will return to ‘On programme’.`,
        classes: 'govuk-!-margin-top-0',
      }
    }

    // Dynamic text based on attendance outcome code
    if (this.presenter.attendanceCode === 'ATTC') {
      return {
        text: `As the person attended their pre-group one-to-one, their referral status will change to 'On programme'.`,
        classes: 'govuk-!-margin-top-0',
      }
    }

    if (this.presenter.attendanceCode === 'AFTC') {
      return {
        text: `As the person attended their pre-group one-to-one but did not comply, their referral status will change back to 'Scheduled'.`,
        classes: 'govuk-!-margin-top-0',
      }
    }

    if (this.presenter.attendanceCode === 'UAAB') {
      return {
        text: `As the person did not attend their pre-group one-to-one, their referral status will change back to 'Scheduled'.`,
        classes: 'govuk-!-margin-top-0',
      }
    }

    return {
      text: `As the person attended their pre-group one-to-one, their referral status will change to ‘On programme’.`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get addDetailsTextboxArgs() {
    return {
      name: 'add-details',
      id: 'add-details',
      label: {
        text: 'Add details (optional)',
        classes: 'govuk-label--m',
        isPageHeading: false,
      },
      maxlength: '500',
      hint: {
        text: 'You can add more information about this update if you need to.',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.addDetailsTextArea.errorMessage),
      value: this.presenter.fields.addDetailsTextArea.value,
    }
  }

  get submitButtonArgs(): ButtonArgs {
    return {
      text: this.presenter.isAddToGroupJourney ? 'Save' : 'Submit attendance and update status',
      preventDoubleClick: true,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'updateReferralStatus/preGroupStatusChange',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        backLinkArgs: this.presenter.backLinkArgs,
        backLinkUri: this.presenter.backLinkUri,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        preGroupOneToOneInsetTextArgs: this.preGroupOneToOneInsetTextArgs,
        addDetailsTextboxArgs: this.addDetailsTextboxArgs,
        submitButtonArgs: this.submitButtonArgs,
      },
    ]
  }
}

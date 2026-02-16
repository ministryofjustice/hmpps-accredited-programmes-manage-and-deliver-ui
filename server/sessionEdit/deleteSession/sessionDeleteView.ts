import DeleteSessionPresenter from './sessionDeletePresenter'
import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class DeleteSessionView {
  constructor(private readonly presenter: DeleteSessionPresenter) {}

  get radioArgs(): RadiosArgs {
    return {
      name: 'delete-session',
      fieldset: {
        legend: {
          text: 'Are you sure you want to delete this session?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        text: 'Any attendance record and session notes will also be deleted.',
      },
      items: [
        {
          text: 'Yes',
          value: 'yes',
        },
        {
          text: 'No',
          value: 'no',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.delete.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionEdit/sessionDelete/sessionDelete',
      {
        presenter: this.presenter,
        backLinkArgs: this.presenter.backLinkArgs,
        radioArgs: this.radioArgs,
        text: this.presenter.text,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}

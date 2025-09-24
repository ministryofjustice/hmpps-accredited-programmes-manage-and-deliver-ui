import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'

export default class UpdateReferralStatusView {
  constructor(private readonly presenter: UpdateReferralStatusPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'updateReferralStatus/updateReferralStatus',
      {
        presenter: this.presenter,
        statusUpdateRadioButtons: this.presenter.statusUpdateRadioButtonsOptions,
        addDetailsTextboxOptions: this.presenter.addDetailsTextboxOptions,
        currentStatusTagOptions: this.presenter.currentStatusTagOptions,
        getCurrentStatusTimelineOptions: this.presenter.getCurrentStatusTimelineOptions.bind(this),
        backLinkArgs: this.presenter.backLinkArgs,
      },
    ]
  }
}

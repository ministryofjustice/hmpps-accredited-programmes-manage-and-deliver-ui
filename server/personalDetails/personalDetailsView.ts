import PersonalDetailsPresenter from './personalDetailsPresenter'

export default class PersonalDetailsView {
  constructor(private readonly presenter: PersonalDetailsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'personalDetails/personalDetails',
      {
        presenter: this.presenter,
      },
    ]
  }
}

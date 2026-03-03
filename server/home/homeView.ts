import HomePresenter from './homePresenter'

export default class HomeView {
  constructor(private readonly presenter: HomePresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'home/home.njk',
      {
        presenter: this.presenter,
        text: this.presenter.text,
      },
    ]
  }
}

import TestPagePresenter from './testPagePresenter'

export default class TestPageView {
  constructor(private readonly presenter: TestPagePresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'testPage/testPage',
      {
        presenter: this.presenter,
      },
    ]
  }
}

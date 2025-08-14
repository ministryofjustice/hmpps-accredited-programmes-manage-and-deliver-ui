import EducationTrainingAndEmploymentPresenter from './educationTrainingAndEmploymentPresenter'

export default class EducationTrainingAndEmploymentView {
  constructor(private readonly presenter: EducationTrainingAndEmploymentPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}

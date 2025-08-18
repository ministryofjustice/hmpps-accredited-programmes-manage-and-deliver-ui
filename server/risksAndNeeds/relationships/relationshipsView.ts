import RelationshipsPresenter from './relationshipsPresenter'

export default class RelationshipsView {
  constructor(private readonly presenter: RelationshipsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}

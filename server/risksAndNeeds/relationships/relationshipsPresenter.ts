import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class RelationshipsPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
  ) {
    super(subNavValue, referralId)
  }
}

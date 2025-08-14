import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class ThinkingAndBehavingPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
  ) {
    super(subNavValue, referralId)
  }
}

import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class EmotionalWellbeingPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
  ) {
    super(subNavValue, referralId)
  }
}

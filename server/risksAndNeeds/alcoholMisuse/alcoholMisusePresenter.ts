import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class AlcoholMisusePresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
  ) {
    super(subNavValue, referralId)
  }
}

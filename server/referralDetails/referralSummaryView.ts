import ReferralSummaryPresenter from './referralSummaryPresenter'

interface ReferralSummaryItem {
  key: string
  value?: string
  valueLink?: string
}

export default class ReferralSummaryView {
  constructor(private readonly presenter: ReferralSummaryPresenter) {}

  get referralSummaryItems(): ReferralSummaryItem[] {
    const summaryList = this.presenter.referralSummaryList()
    return summaryList.map(item => {
      const firstLine = item.lines[0]
      const lineValue = typeof firstLine === 'string' ? firstLine : firstLine?.item || ''
      return {
        key: item.key,
        value: item.valueLink ? undefined : lineValue,
        valueLink: item.valueLink,
      }
    })
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        referralSummaryItems: this.referralSummaryItems,
      },
    ]
  }
}

import { ReferralStatusHistory } from '@manage-and-deliver-api'
import { MojTimelineItem } from '@manage-and-deliver-ui'
import StatusHistoryPresenter from './statusHistoryPresenter'
import DateUtils from '../utils/dateUtils'

export default class StatusHistoryView {
  constructor(private readonly presenter: StatusHistoryPresenter) {}

  getStatusHistoryTimelineOptions(): { items: MojTimelineItem[] } {
    const makeStatusTagHtml = (statusColour: string, statusDescription: string, additionalDetails: string): string => {
      let text = `
      <strong class="govuk-tag govuk-tag--${statusColour}">${statusDescription || 'Unknown status'}</strong>
      `

      if (additionalDetails) {
        text = [text, `<br ><br ><strong>Details:</strong><p>${additionalDetails}</p>`].join('\n')
      }

      return text.trim()
    }

    return {
      items: this.presenter.statusHistory.toReversed().map((status: ReferralStatusHistory) => ({
        label: {
          text: status.referralStatusDescriptionName,
        },
        html: makeStatusTagHtml(status.tagColour, status.referralStatusDescriptionName, status.additionalDetails),
        datetime: {
          timestamp: DateUtils.removeTimezoneOffset(status.updatedAt),
          type: 'datetime',
        },
        byline: {
          text: status.updatedBy,
        },
        ...(status.additionalDetails && {
          html: makeStatusTagHtml(status.tagColour, status.referralStatusDescriptionName, status.additionalDetails),
        }),
      })),
    }
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: `/pdu/referrals/${this.presenter.referralId}`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'statusHistory/statusHistory',
      {
        buttons: this.presenter.getSubHeaderArgs().items,
        errorSummary: this.presenter.errorMessageSummary,
        successMessageSummary: this.presenter.successMessageSummary,
        pageHeading: this.presenter.pageHeading,
        presenter: this.presenter,
        statusHistoryTimelineOptions: this.getStatusHistoryTimelineOptions(),
        subNavigationItems: this.presenter.getHorizontalSubNavArgs().items,
      },
    ]
  }
}

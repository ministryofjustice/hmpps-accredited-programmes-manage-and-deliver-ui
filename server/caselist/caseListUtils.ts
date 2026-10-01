import { GroupItem, ReferralCaseListItem } from '@manage-and-deliver-api'
import DateUtils from '../utils/dateUtils'

type SentenceEndDateSource = NonNullable<ReferralCaseListItem['sentenceEndDateSource']>

export interface SentenceEndDateCell {
  html: string
  sortValue: number
}

export default class CaselistUtils {
  static hasLdcTagHtml(referral: ReferralCaseListItem): string {
    return referral.hasLdc ? '<br/><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
  }

  static hasLaoBadgeHtml(referral: ReferralCaseListItem): string {
    return referral.isLimitedAccessOffender
      ? '<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span>'
      : ''
  }

  static hasLaoBadgeHtmlGroupItem(groupItem: GroupItem): string {
    return groupItem.isLimitedAccessOffender
      ? '<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span>'
      : ''
  }

  static sentenceEndDateCell(referral: ReferralCaseListItem): SentenceEndDateCell {
    return CaselistUtils.buildSentenceEndDateCell(
      referral.sentenceEndDate ? DateUtils.formattedDate(referral.sentenceEndDate) : null,
      referral.licenceExpiryDate ? DateUtils.formattedDate(referral.licenceExpiryDate) : null,
      referral.sentenceEndDateSource,
    )
  }

  // GroupItem dates are already formatted by the API, e.g. '28 April 2027'
  static sentenceEndDateCellGroupItem(groupItem: GroupItem): SentenceEndDateCell {
    return CaselistUtils.buildSentenceEndDateCell(
      groupItem.sentenceEndDate,
      groupItem.licenceExpiryDate,
      groupItem.sourcedFrom,
    )
  }

  // Licence cases prioritise the licence end date, falling back to the calculated expected end date.
  // Rows with no date sort as the earliest end date.
  private static buildSentenceEndDateCell(
    sentenceEndDate: string | null | undefined,
    licenceExpiryDate: string | null | undefined,
    source: SentenceEndDateSource | undefined | null,
  ): SentenceEndDateCell {
    let date = sentenceEndDate
    let label = source === 'REQUIREMENT' ? 'Order end date' : null
    if (source === 'LICENCE_CONDITION') {
      date = licenceExpiryDate ?? sentenceEndDate
      label = licenceExpiryDate ? 'Licence end date' : 'Calculated expected end date'
    }

    if (!date) {
      return { html: 'No information available', sortValue: 0 }
    }
    return { html: label ? `${date} <br> ${label}` : date, sortValue: new Date(date).getTime() }
  }
}

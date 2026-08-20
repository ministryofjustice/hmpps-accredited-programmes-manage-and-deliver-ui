import { GroupItem, ReferralCaseListItem } from '@manage-and-deliver-api'

export default class CaselistUtils {
  static hasLdcTagHtml(referral: ReferralCaseListItem): string {
    return referral.hasLdc ? '<br/><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
  }

  static hasLaoBadgeHtml(referral: ReferralCaseListItem): string {
    return referral.lao ? '<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span>' : ''
  }

  static hasLaoBadgeHtmlGroupItem(groupItem: GroupItem): string {
    return groupItem.isLimitedAccessOffender
      ? '<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span>'
      : ''
  }
}

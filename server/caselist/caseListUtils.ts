import { ReferralCaseListItem } from '@manage-and-deliver-api'

export default class CaselistUtils {
  static hasLdcTagHtml(referral: ReferralCaseListItem): string {
    return referral.hasLdc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
  }

  static isExcludedLAO(referral: ReferralCaseListItem): boolean {
    return (referral as ReferralCaseListItem & { userExcluded?: boolean }).userExcluded === true
  }

  static isLAO(referral: ReferralCaseListItem): string {
    const laoFlags = referral as ReferralCaseListItem & { isLAO?: boolean; userRestricted?: boolean }
    const isRestrictedAccess = referral.lao === true || laoFlags.isLAO === true || laoFlags.userRestricted === true

    return isRestrictedAccess ? '<br><span class="moj-badge moj-badge--red">Restricted Access</span><br>' : ''
  }
}

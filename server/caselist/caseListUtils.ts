import { ReferralCaseListItem } from '@manage-and-deliver-api'

export type LaoAccessFields = {
  lao?: boolean | null
  isLAO?: boolean
  userRestricted?: boolean
  userExcluded?: boolean
}

export default class CaselistUtils {
  static hasLdcTagHtml(referral: ReferralCaseListItem): string {
    return referral.hasLdc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
  }

  static isExcludedLAO(referral: LaoAccessFields): boolean {
    return referral.userExcluded === true
  }

  static laoBadge(referral: LaoAccessFields): string {
    const isRestrictedAccess = referral.lao === true || referral.isLAO === true || referral.userRestricted === true

    return isRestrictedAccess ? '<br><span class="moj-badge moj-badge--red">Restricted Access</span><br>' : ''
  }
}

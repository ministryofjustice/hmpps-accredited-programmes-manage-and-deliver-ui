import { ReferralCaseListItem } from '@manage-and-deliver-api'

export default class CaselistUtils {
  static cohorts = [
    { value: 'GENERAL_OFFENCE', text: 'General Offence' },
    { value: 'SEXUAL_OFFENCE', text: 'Sexual Offence' },
  ]

  static hasLdcTagHtml(referral: ReferralCaseListItem): string {
    return referral.hasLdc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
  }
}

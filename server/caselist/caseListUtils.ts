import { ReferralCaseListItem } from '@manage-and-deliver-api'

const parseCrnList = (envVarName: string): Set<string> => {
  const value = process.env[envVarName]
  if (!value) return new Set()

  return new Set(
    value
      .split(',')
      .map(crn => crn.trim())
      .filter(Boolean),
  )
}

const localRestrictedLaoCrns = parseCrnList('LOCAL_TEST_LAO_RESTRICTED_CRNS')
const localExcludedLaoCrns = parseCrnList('LOCAL_TEST_LAO_EXCLUDED_CRNS')

export default class CaselistUtils {
  static hasLdcTagHtml(referral: ReferralCaseListItem): string {
    return referral.hasLdc ? '</br><span class="moj-badge moj-badge--bright-purple">LDC</span>' : ''
  }

  static isExcludedLAO(referral: ReferralCaseListItem): boolean {
    return (
      (referral as ReferralCaseListItem & { userExcluded?: boolean }).userExcluded === true ||
      localExcludedLaoCrns.has(referral.crn)
    )
  }

  static isLAO(referral: ReferralCaseListItem): string {
    const laoFlags = referral as ReferralCaseListItem & { isLAO?: boolean; userRestricted?: boolean }
    const isRestrictedAccess =
      referral.lao === true ||
      laoFlags.isLAO === true ||
      laoFlags.userRestricted === true ||
      localRestrictedLaoCrns.has(referral.crn) ||
      localExcludedLaoCrns.has(referral.crn)

    return isRestrictedAccess ? '<br><span class="moj-badge moj-badge--red">Restricted Access</span><br>' : ''
  }
}

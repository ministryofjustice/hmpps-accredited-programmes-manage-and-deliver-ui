/** For info:
 * N54 Is the North East
 * N57 Is KSS
 * N59 Is the South Central
 * N56 Is East of England
 * N52 Is West Midlands
 * N50 Is Greater Manchester
 * N58 Is South West
 * CreateGroupFormTest.test.ts also needs to be updated to reflect the change to the region
 */

export const ALLOWED_PAST_DATE_REGIONS: string[] = ['N54', 'N57', 'N59', 'N56', 'N52', 'N50', 'N58']

/**
 * Checks if the region restriction for past dates is enabled.
 * When set to 'true', only regions in ALLOWED_PAST_DATE_REGIONS can use past dates.
 * When set to 'false', all regions can use past dates.
 */
function isRegionRestrictionEnabled(): boolean {
  return process.env.ENABLE_PAST_DATE_REGION_RESTRICTION === 'true'
}

export function isRegionAllowedPastDates(regionCode: string | undefined): boolean {
  if (!isRegionRestrictionEnabled()) {
    return true
  }

  if (!regionCode) {
    return false
  }
  return ALLOWED_PAST_DATE_REGIONS.includes(regionCode)
}

export const ALLOWED_PAST_DATE_REGIONS: string[] = ['N50MANC']

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

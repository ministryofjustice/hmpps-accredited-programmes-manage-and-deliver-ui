import config from "../config"

/**
 * For info:
 * N53 Is the East Midlands
 * N54 Is the North East
 * Full region code mapping can be found at:
 * https://dsdmoj.atlassian.net/wiki/spaces/IC/pages/6027477185/Interventions+Manager+Data+Migration+Strategy#2.-Phased-out-Data-Migration
 */
export const ALLOWED_REGIONS: string[] = ['N53', 'N54']

/**
 * For info:
 * N02 Is an alternate region code for the north east used in test Delius accounts, but not used in production.
 * N07 Is the region code for London. Currently used for test accounts but not yet allowed in production.
 * Other are descibed in ALLOWED_REGIONS above.
 */
export const DEV_ALLOWED_REGIONS: string[] = ['N01', 'N07', 'N53', 'N54'] // Dev users do not have access to the same regions in delius so extra ones allowed.

/**
 * Checks if the region restriction is enabled.
 * When set to 'true', only regions in ALLOWED_REGIONS can access the service.
 * When set to 'false', all regions can access the service.
 */
function isRegionRestrictionEnabled(): boolean {
  return config.enable_region_restriction === true
}

function getAllowedRegions(): string[] {
  return config.environmentName?.toUpperCase()  === 'DEV' ? DEV_ALLOWED_REGIONS : ALLOWED_REGIONS
}

export function isRegionAllowed(regionCode: string | undefined): boolean {
  if (!isRegionRestrictionEnabled()) {
    return true
  }
  if (!regionCode) {
    return false
  }
  return getAllowedRegions().includes(regionCode)
}

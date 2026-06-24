/** 
 * For info: N53 is the east midlands, N54 is the North East.
 * Full region code mapping can be found at:
 * https://dsdmoj.atlassian.net/wiki/spaces/IC/pages/6027477185/Interventions+Manager+Data+Migration+Strategy#2.-Phased-out-Data-Migration
*/
export const ALLOWED_REGIONS: string[] = ['N53', 'N54']

/**
 * Checks if the region restriction is enabled.
 * When set to 'true', only regions in ALLOWED_REGIONS can access the service.
 * When set to 'false', all regions can access the service.
 */
function isRegionRestrictionEnabled(): boolean {
  return process.env.ENABLE_REGION_RESTRICTION === 'true'
}

export function isRegionAllowed(regionCode: string | undefined): boolean {
  if (!isRegionRestrictionEnabled()) {
    return true
  }

  if (!regionCode) {
    return false
  }
  return ALLOWED_REGIONS.includes(regionCode)
}

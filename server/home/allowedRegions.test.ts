import config from '../config'

jest.mock('../config')

describe('allowedRegions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('isRegionAllowed', () => {
    describe('when region restriction is enabled and ENVIRONMENT_NAME is not DEV', () => {
      beforeEach(() => {
        ;(config as jest.Mocked<typeof config>).enable_region_restriction = true
        ;(config as jest.Mocked<typeof config>).environmentName = 'PREPROD'
      })

      it('should allow allowed region', () => {
        expect(isRegionAllowed('N53')).toBe(true)
      })

      it('should not allow dev only region)', () => {
        expect(isRegionAllowed('N01')).toBe(false)
      })

      it('should not allow unknown region', () => {
        expect(isRegionAllowed('Y02')).toBe(false)
      })

      it('should not allow undefined region', () => {
        expect(isRegionAllowed(undefined)).toBe(false)
      })
    })

    describe('when region restriction is enabled and ENVIRONMENT_NAME is DEV', () => {
      beforeEach(() => {
        ;(config as jest.Mocked<typeof config>).enable_region_restriction = true
        ;(config as jest.Mocked<typeof config>).environmentName = 'DEV'
      })

      it('should allow dev allowed region)', () => {
        expect(isRegionAllowed('N01')).toBe(true)
      })

      it('should not allow unknown region', () => {
        expect(isRegionAllowed('Y02')).toBe(false)
      })

      it('should not allow undefined region', () => {
        expect(isRegionAllowed(undefined)).toBe(false)
      })
    })

    describe('when region restriction is enabled and ENVIRONMENT_NAME is dev (lowercase)', () => {
      beforeEach(() => {
        ;(config as jest.Mocked<typeof config>).enable_region_restriction = true
        ;(config as jest.Mocked<typeof config>).environmentName = 'dev'
      })

      it('should allow dev regions when environmentName is lowercase', () => {
        expect(isRegionAllowed('N01')).toBe(true)
      })
    })

    describe('when region restriction is disabled', () => {
      beforeEach(() => {
        ;(config as jest.Mocked<typeof config>).enable_region_restriction = false
      })

      it('should allow N53', () => {
        expect(isRegionAllowed('N53')).toBe(true)
      })
      it('should allow unknown region ', () => {
        expect(isRegionAllowed('Y02')).toBe(true)
      })

      it('should allow undefined region', () => {
        expect(isRegionAllowed(undefined)).toBe(true)
      })
    })
  })
})

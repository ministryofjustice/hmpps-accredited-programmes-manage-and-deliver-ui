import risksFactory from '../../testutils/factories/risksAndNeeds/risksFactory'
import RisksAndAlertsOgrs4Presenter from './risksAndAlertsOgrs4Presenter'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'

describe('RisksAndAlertsOgrs4Presenter', () => {
  describe('getLevelClass', () => {
    const risks = risksFactory.build()
    const referral = referralDetailsFactory.build()
    const presenter = new RisksAndAlertsOgrs4Presenter('risksAndAlerts', referral, risks)

    test.each([
      { input: 'LOW', expectedResult: 'risk-box--low' },
      { input: 'MEDIUM', expectedResult: 'risk-box--medium' },
      { input: 'HIGH', expectedResult: 'risk-box--high' },
      { input: 'VERY_HIGH', expectedResult: 'risk-box--very-high' },
      { input: 'Not Applicable', expectedResult: 'risk-box--not-applicable' },
      { input: '', expectedResult: 'risk-box--unknown' },
    ])(
      'should generate the correct string for the class based on the score level $input',
      ({ input, expectedResult }) => {
        expect(presenter.getLevelClass(input)).toEqual(expectedResult)
      },
    )
  })

  describe('getLevelText', () => {
    const risks = risksFactory.build()
    const referral = referralDetailsFactory.build()
    const presenter = new RisksAndAlertsOgrs4Presenter('risksAndAlerts', referral, risks)

    test.each([
      { input: 'LOW', expectedResult: 'LOW' },
      { input: 'MEDIUM', expectedResult: 'MEDIUM' },
      { input: 'HIGH', expectedResult: 'HIGH' },
      { input: 'VERY_HIGH', expectedResult: 'VERY HIGH' },
      { input: 'Not Applicable', expectedResult: 'NOT APPLICABLE' },
      { input: '', expectedResult: 'UNKNOWN' },
    ])(
      'should generate the correct string for the level text based on the score level $input',
      ({ input, expectedResult }) => {
        expect(presenter.getLevelText(input)).toEqual(expectedResult)
      },
    )

    test.each([
      { input: 'LOW', expectedResult: 'Low' },
      { input: 'MEDIUM', expectedResult: 'Medium' },
      { input: 'HIGH', expectedResult: 'High' },
      { input: 'VERY_HIGH', expectedResult: 'Very high' },
      { input: 'Not Applicable', expectedResult: 'Not applicable' },
      { input: '', expectedResult: 'Unknown' },
    ])(
      'should generate the correct string for the level text based on the score level $input and proper casing',
      ({ input, expectedResult }) => {
        expect(presenter.getLevelText(input, 'proper')).toEqual(expectedResult)
      },
    )
  })

  describe('levelOrUnknown', () => {
    const risks = risksFactory.build()
    const referral = referralDetailsFactory.build()
    const presenter = new RisksAndAlertsOgrs4Presenter('risksAndAlerts', referral, risks)

    test.each([
      { input: 'LOW', expectedResult: 'LOW' },
      { input: 'Very_High', expectedResult: 'VERY_HIGH' },
      { input: 'Not Applicable', expectedResult: 'NOT_APPLICABLE' },
      { input: undefined, expectedResult: 'UNKNOWN' },
      { input: '', expectedResult: 'UNKNOWN' },
    ])('should return $expectedResult for input $input', ({ input, expectedResult }) => {
      expect(presenter.levelOrUnknown(input)).toEqual(expectedResult)
    })
  })
})

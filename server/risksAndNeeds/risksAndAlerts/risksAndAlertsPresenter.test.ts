import { randomUUID } from 'crypto'
import risksFactory from '../../testutils/factories/risksAndNeeds/risksFactory'
import RisksAndAlertsPresenter, { RiskLevel } from './risksAndAlertsPresenter'

describe(`getLevelClass.`, () => {
  const risks = risksFactory.build()
  const presenter = new RisksAndAlertsPresenter('risksAndAlerts', randomUUID(), risks, 'Awaiting assessment')

  test.each([
    { input: 'LOW', expectedResult: 'risk-box--low' },
    { input: 'MEDIUM', expectedResult: 'risk-box--medium' },
    { input: 'HIGH', expectedResult: 'risk-box--high' },
    { input: 'VERY_HIGH', expectedResult: 'risk-box--very-high' },
    { input: 'Not Applicable', expectedResult: 'risk-box--not applicable' },
    { input: null, expectedResult: 'risk-box--unknown' },
    { input: undefined, expectedResult: 'risk-box--unknown' },
  ])(
    `should generate the correct string for the class based on the score level $input.`,
    ({ input, expectedResult }) => {
      expect(presenter.getLevelClass(input as RiskLevel)).toEqual(expectedResult)
    },
  )
})

describe(`getLevelText.`, () => {
  const risks = risksFactory.build()
  const presenter = new RisksAndAlertsPresenter('risksAndAlerts', randomUUID(), risks, 'Awaiting assessment')

  test.each([
    { input: 'LOW', expectedResult: 'LOW' },
    { input: 'MEDIUM', expectedResult: 'MEDIUM' },
    { input: 'HIGH', expectedResult: 'HIGH' },
    { input: 'VERY_HIGH', expectedResult: 'VERY HIGH' },
    { input: 'Not Applicable', expectedResult: 'Not Applicable' },
    { input: null, expectedResult: 'UNKNOWN' },
    { input: undefined, expectedResult: 'UNKNOWN' },
  ])(
    `should generate the correct string for the level text based on the score level $input.`,
    ({ input, expectedResult }) => {
      expect(presenter.getLevelText(input as RiskLevel)).toEqual(expectedResult)
    },
  )

  test.each([
    { input: 'LOW', expectedResult: 'Low' },
    { input: 'MEDIUM', expectedResult: 'Medium' },
    { input: 'HIGH', expectedResult: 'High' },
    { input: 'VERY_HIGH', expectedResult: 'Very high' },
    { input: 'Not Applicable', expectedResult: 'Not applicable' },
    { input: null, expectedResult: 'Unknown' },
    { input: undefined, expectedResult: 'Unknown' },
  ])(
    `should generate the correct string for the level text based on the score level $input and proper casing.`,
    ({ input, expectedResult }) => {
      expect(presenter.getLevelText(input as RiskLevel, 'proper')).toEqual(expectedResult)
    },
  )
})

describe(`formatFigure.`, () => {
  it('should correctly format the figure with a % symbol', () => {
    const risks = risksFactory.build()
    const presenter = new RisksAndAlertsPresenter('risksAndAlerts', randomUUID(), risks, 'Awaiting assessment')

    expect(presenter.formatFigure(2)).toEqual('2%')
  })

  it('should return undefined if the figure input is not provided', () => {
    const risks = risksFactory.build()
    const presenter = new RisksAndAlertsPresenter('risksAndAlerts', randomUUID(), risks, 'Awaiting assessment')

    expect(presenter.formatFigure(null)).toEqual(undefined)
  })
})

describe(`getBodyHtmlStringWithClass.`, () => {
  it('should return the correct string based on the input', () => {
    const risks = risksFactory.build()
    const presenter = new RisksAndAlertsPresenter('risksAndAlerts', randomUUID(), risks, 'Awaiting assessment')

    expect(presenter.getBodyHtmlStringWithClass('A random string')).toEqual(
      `<p class="govuk-body-m govuk-!-margin-bottom-0">A random string</p>`,
    )
  })
})

describe(`getLastUpdatedStringWithClass.`, () => {
  it('should return the correct string based on the input', () => {
    const risks = risksFactory.build()
    const presenter = new RisksAndAlertsPresenter('risksAndAlerts', randomUUID(), risks, 'Awaiting assessment')

    expect(presenter.getLastUpdatedStringWithClass('12th October 2024')).toEqual(
      `<p class="risk-box__body-text govuk-!-margin-bottom-0">Last updated: 12th October 2024</p>`,
    )
  })
})

describe(`roshTableCellForLevel.`, () => {
  const risks = risksFactory.build()
  const presenter = new RisksAndAlertsPresenter('risksAndAlerts', randomUUID(), risks, 'Awaiting assessment')

  test.each([
    { input: 'LOW', expectedResult: { classes: `rosh-table__cell rosh-table__cell--low`, text: 'Low' } },
    { input: 'MEDIUM', expectedResult: { classes: `rosh-table__cell rosh-table__cell--medium`, text: 'Medium' } },
    { input: 'HIGH', expectedResult: { classes: `rosh-table__cell rosh-table__cell--high`, text: 'High' } },
    {
      input: 'VERY_HIGH',
      expectedResult: { classes: `rosh-table__cell rosh-table__cell--very-high`, text: 'Very high' },
    },
    {
      input: 'Not Applicable',
      expectedResult: { classes: `rosh-table__cell rosh-table__cell--not applicable`, text: 'Not applicable' },
    },
    { input: null, expectedResult: { classes: `rosh-table__cell rosh-table__cell--unknown`, text: 'Unknown' } },
    { input: undefined, expectedResult: { classes: `rosh-table__cell rosh-table__cell--unknown`, text: 'Unknown' } },
  ])(
    `should generate the correct rosh cell classes and text based on the level input: $input.`,
    ({ input, expectedResult }) => {
      expect(presenter.roshTableCellForLevel(input as RiskLevel)).toEqual(expectedResult)
    },
  )
})

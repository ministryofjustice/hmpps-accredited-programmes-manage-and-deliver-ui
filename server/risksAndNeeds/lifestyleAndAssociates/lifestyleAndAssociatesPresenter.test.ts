import { randomUUID } from 'crypto'
import lifestyleAndAssociatesFactory from '../../testutils/factories/risksAndNeeds/lifestyleAndAssociatesFactory'
import LifestyleAndAssociatesPresenter from './lifestyleAndAssociatesPresenter'

describe(`reoffendingSummaryList.`, () => {
  it('should generate the table correctly from the values supplied', () => {
    const lifestyleAndAssociates = lifestyleAndAssociatesFactory.build()
    const presenter = new LifestyleAndAssociatesPresenter(
      'lifestyleAndAssociates',
      randomUUID(),
      lifestyleAndAssociates,
    )

    expect(presenter.reoffendingSummaryList()).toEqual([
      {
        key: 'Are there any activities that encourage reoffending',
        lines: [lifestyleAndAssociates.regActivitiesEncourageOffending],
      },
    ])
  })
})

describe(`lifestyleIssuesSummaryList.`, () => {
  it('should generate the table correctly from the values supplied', () => {
    const lifestyleAndAssociates = lifestyleAndAssociatesFactory.build()
    const presenter = new LifestyleAndAssociatesPresenter(
      'lifestyleAndAssociates',
      randomUUID(),
      lifestyleAndAssociates,
    )

    expect(presenter.lifestyleIssuesSummaryList()).toEqual([
      {
        key: '',
        lines: [lifestyleAndAssociates.lifestyleIssuesDetails],
      },
    ])
  })
})

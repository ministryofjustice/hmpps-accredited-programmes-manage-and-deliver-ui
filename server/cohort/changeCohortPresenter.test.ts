import { CohortEnum, ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import ChangeCohortPresenter from './changeCohortPresenter'

describe('ChangeCohortPresenter', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return correct form action URL', () => {
    const referralId = randomUUID()
    const mockDetails = {
      cohort: 'SEXUAL_OFFENCE' as CohortEnum,
    } as ReferralDetails

    const presenter = new ChangeCohortPresenter(referralId, mockDetails, null)

    expect(presenter.changeCohortFormAction).toEqual(`/referral/${referralId}/change-cohort`)
  })

  it('should return the correct cohort in fields.updatedCohort.value', () => {
    const referralId = randomUUID()
    const mockDetails = {
      cohort: 'SEXUAL_OFFENCE' as CohortEnum,
    } as ReferralDetails

    const presenter = new ChangeCohortPresenter(referralId, mockDetails, null)

    expect(presenter.fields).toEqual({
      updatedCohort: {
        value: 'SEXUAL_OFFENCE' as CohortEnum,
      },
    })
  })
})

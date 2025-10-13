import { fakerEN_GB as faker } from '@faker-js/faker'
import { CohortEnum } from '@manage-and-deliver-api'
import TestUtils from '../testutils/testUtils'
import ChangeCohortForm from './changeCohortForm'

describe('ChangeCohortForm.data', () => {
  const referralId = faker.string.uuid()

  describe('when all mandatory fields are passed', () => {
    it('returns params for update with correct cohort enum', async () => {
      const request = TestUtils.createRequest({
        updatedCohort: 'SEXUAL_OFFENCE',
      })

      const form = new ChangeCohortForm(request, referralId)
      const data = await form.data()

      expect(data.paramsForUpdate).toStrictEqual({
        referralId,
        updatedCohort: 'SEXUAL_OFFENCE' as CohortEnum,
      })

      expect(data.error).toBeNull()
    })
  })
})

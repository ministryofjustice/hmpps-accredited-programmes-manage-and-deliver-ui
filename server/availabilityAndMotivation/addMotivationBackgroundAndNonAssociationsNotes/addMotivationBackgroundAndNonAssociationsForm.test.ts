import { fakerEN_GB as faker } from '@faker-js/faker'
import TestUtils from '../../testutils/testUtils'
import AddMotivationBackgroundAndNonAssociatesForm from './addMotivationBackgroundAndNonAssociatesForm'

describe(`AddMotivationBackgroundAndNonAssociatesForm `, () => {
  describe('addMotivationBackgroundAndNonAssociatesData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'maintains-innocence': 'yes',
          'motivated-character-count': 'They are motivated',
          'other-considerations-character-count': 'Some considerations',
          'non-associations-character-count': 'Some non associations',
        })
        const data = await new AddMotivationBackgroundAndNonAssociatesForm(
          request,
        ).addMotivationBackgroundAndNonAssociatesData()

        expect(data.paramsForUpdate).toStrictEqual({
          maintainsInnocence: true,
          motivations: 'They are motivated',
          otherConsiderations: 'Some considerations',
          nonAssociations: 'Some non associations',
        })
      })
    })

    describe('when character counts exceed the defined limit', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({
          'maintains-innocence': 'yes',
          'motivated-character-count': faker.string.alpha({ length: 2001 }),
          'other-considerations-character-count': faker.string.alpha({ length: 2001 }),
          'non-associations-character-count': faker.string.alpha({ length: 2001 }),
        })
        const data = await new AddMotivationBackgroundAndNonAssociatesForm(
          request,
        ).addMotivationBackgroundAndNonAssociatesData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'motivated-character-count',
              formFields: ['motivated-character-count'],
              message: 'Details must be 2,000 characters or fewer',
            },
            {
              errorSummaryLinkedField: 'other-considerations-character-count',
              formFields: ['other-considerations-character-count'],
              message: 'Details must be 2,000 characters or fewer',
            },
            {
              errorSummaryLinkedField: 'non-associations-character-count',
              formFields: ['non-associations-character-count'],
              message: 'Details must be 2,000 characters or fewer',
            },
          ],
        })
      })
    })
  })
})

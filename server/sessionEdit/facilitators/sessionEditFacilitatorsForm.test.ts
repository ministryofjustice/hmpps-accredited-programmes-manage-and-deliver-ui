import TestUtils from '../../testutils/testUtils'
import EditSessionFacilitatorsForm from './sessionEditFacilitatorsForm'

describe('EditSessionFacilitatorsForm', () => {
  describe('editSessionFacilitatorsData', () => {
    describe('when validation passes', () => {
      it('returns params for update with parsed values', async () => {
        const request = TestUtils.createRequest({
          'edit-session-facilitator':
            '{"facilitator":"John Doe", "facilitatorCode":"N07B656", "teamName":"GM Manchester N1", "teamCode":"N50CAC"}',
        })
        const data = await new EditSessionFacilitatorsForm(request).editSessionFacilitatorsData()

        expect(data.paramsForUpdate).toEqual([
          {
            facilitator: 'John Doe',
            facilitatorCode: 'N07B656',
            teamCode: 'N50CAC',
            teamName: 'GM Manchester N1',
          },
        ])
        expect(data.error).toBeNull()
      })
    })

    describe('validation', () => {
      it('returns error when data is missing', async () => {
        const req = TestUtils.createRequest({})
        const data = await new EditSessionFacilitatorsForm(req).editSessionFacilitatorsData()
        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'edit-session-facilitator',
              formFields: ['edit-session-facilitator'],
              message: 'Select a Facilitator. Start typing to search.',
            },
          ],
        })
      })

      it('returns error when same facilitator is entered', async () => {
        const request = TestUtils.createRequest({
          'edit-session-facilitator':
            '{"facilitator":"John Doe", "facilitatorCode":"N07B656", "teamName":"GM Manchester N1", "teamCode":"N50CAC"}',
          'edit-session-facilitator1':
            '{"facilitator":"John Doe", "facilitatorCode":"N07B656", "teamName":"GM Manchester N1", "teamCode":"N50CAC"}',
        })
        const data = await new EditSessionFacilitatorsForm(request).editSessionFacilitatorsData()
        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'edit-session-facilitator',
              formFields: ['edit-session-facilitator'],
              message: 'You cannot add the same facilitator twice. Select a different facilitator.',
            },
          ],
        })
      })
    })
  })
})

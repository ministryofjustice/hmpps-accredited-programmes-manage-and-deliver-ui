import TestUtils from '../../testutils/testUtils'
import RescheduleOtherSessionsForm from './sessionEditOtherRescheduleForm'

describe(`RescheduleOtherSessionsForm `, () => {
  describe('rescheduleSessionDetailsData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'reschedule-other-sessions': 'false',
        })
        const data = await new RescheduleOtherSessionsForm(request).rescheduleSessionDetailsData()

        expect(data.paramsForUpdate).toStrictEqual({
          rescheduleOtherSessions: false,
        })
      })
    })

    describe('when no value is given for reschedule other sessions', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})
        const data = await new RescheduleOtherSessionsForm(request).rescheduleSessionDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'reschedule-other-sessions',
              formFields: ['reschedule-other-sessions'],
              message: 'Select whether to reschedule future sessions or not',
            },
          ],
        })
      })
    })
  })
})

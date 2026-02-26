import TestUtils from '../testutils/testUtils'
import RecordAttendanceForm from './recordAttendanceForm'

describe('RecordAttendanceForm', () => {
  describe('recordAttendanceData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'attendance-referral1': 'ATTC',
        })

        const data = await new RecordAttendanceForm(request, [
          { referralId: 'referral1', name: 'Alex River' },
        ]).recordAttendanceData()

        expect(data.paramsForUpdate).toStrictEqual({
          attendees: [
            {
              referralId: 'referral1',
              outcomeCode: 'ATTC',
              sessionNotes: '',
            },
          ],
        })
        expect(data.error).toBeNull()
      })

      describe('when mandatory fields are missing', () => {
        it('returns an appropriate error', async () => {
          const request = TestUtils.createRequest({})

          const data = await new RecordAttendanceForm(request, [
            { referralId: 'referral1', name: 'Alex River' },
          ]).recordAttendanceData()

          expect(data.paramsForUpdate).toBeNull()
          expect(data.error).toStrictEqual({
            errors: [
              {
                errorSummaryLinkedField: 'attendance-referral1',
                formFields: ['attendance-referral1'],
                message: `Select an attendance status for Alex River`,
              },
            ],
          })
        })
      })
    })
  })
})

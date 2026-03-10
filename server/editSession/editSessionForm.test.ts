import TestUtils from '../testutils/testUtils'
import EditSessionForm from './editSessionForm'

describe('EditSessionForm', () => {
  describe('deleteData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'delete-session': 'yes',
        })

        const data = await new EditSessionForm(request).deleteData()

        expect(data.paramsForUpdate).toStrictEqual({
          delete: 'yes',
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new EditSessionForm(request).deleteData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'delete-session',
              formFields: ['delete-session'],
              message: 'Select whether to delete the session or not',
            },
          ],
        })
      })
    })
  })

  describe('attendeesData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update with a single attendee', async () => {
        const request = TestUtils.createRequest({
          'edit-session-attendees': 'referral-123',
        })

        const data = await new EditSessionForm(request).attendeesData()

        expect(data.paramsForUpdate).toStrictEqual({
          referralId: ['referral-123'],
        })
        expect(data.error).toBeNull()
      })

      it('returns params for update with multiple attendees as an array', async () => {
        const request = TestUtils.createRequest({
          'edit-session-attendees': ['referral-123', 'referral-456', 'referral-789'],
        })

        const data = await new EditSessionForm(request).attendeesData()

        expect(data.paramsForUpdate).toStrictEqual({
          referralId: ['referral-123', 'referral-456', 'referral-789'],
        })
        expect(data.error).toBeNull()
      })

      it('converts a single string to an array', async () => {
        const request = TestUtils.createRequest({
          'edit-session-attendees': 'single-referral',
        })

        const data = await new EditSessionForm(request).attendeesData()

        expect(data.paramsForUpdate?.referralId).toBeInstanceOf(Array)
        expect(data.paramsForUpdate?.referralId).toHaveLength(1)
        expect(data.paramsForUpdate?.referralId[0]).toBe('single-referral')
        expect(data.error).toBeNull()
      })
    })

    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new EditSessionForm(request).attendeesData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'edit-session-attendees',
              formFields: ['edit-session-attendees'],
              message: 'Select who should attend the session',
            },
          ],
        })
      })
    })
  })

  describe('attendanceAndSessionNotesData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update with a single referral ID', async () => {
        const request = TestUtils.createRequest({
          'multi-select-selected': ['referral-123'],
        })

        const data = await new EditSessionForm(request).attendanceAndSessionNotesData()

        expect(data.paramsForUpdate).toStrictEqual({
          referralIds: ['referral-123'],
        })
        expect(data.error).toBeNull()
      })

      it('returns params for update with multiple referral IDs', async () => {
        const request = TestUtils.createRequest({
          'multi-select-selected': ['referral-123', 'referral-456', 'referral-789'],
        })

        const data = await new EditSessionForm(request).attendanceAndSessionNotesData()

        expect(data.paramsForUpdate).toStrictEqual({
          referralIds: ['referral-123', 'referral-456', 'referral-789'],
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new EditSessionForm(request).attendanceAndSessionNotesData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'multi-select-selected',
              formFields: ['multi-select-selected'],
              message: "Select the checkbox next to a person's name to update their attendance and notes",
            },
          ],
        })
      })
    })
  })
})

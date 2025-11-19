import TestUtils from '../testutils/testUtils'
import CreateGroupForm from './createGroupForm'

describe('CreateGroupForm', () => {
  describe('createGroupCodeData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'create-group-code': 'GROUP123',
        })

        const data = await new CreateGroupForm(request).createGroupCodeData()

        expect(data.paramsForUpdate).toStrictEqual({
          groupCode: 'GROUP123',
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new CreateGroupForm(request).createGroupCodeData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-code',
              formFields: ['create-group-code'],
              message: 'Enter a code for your group',
            },
          ],
        })
      })
    })
    describe('when group code already exists in region', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({ 'create-group-code': 'GROUP123' })

        const data = await new CreateGroupForm(request, 'GROUP123').createGroupCodeData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-code',
              formFields: ['create-group-code'],
              message: 'Group code GROUP123 already exists for a group in this region. Enter a different code.',
            },
          ],
        })
      })
    })
  })

  describe('createGroupDateData', () => {
    describe('when date is provided', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'create-group-date': '10/7/2050',
        })

        const data = await new CreateGroupForm(request).createGroupDateData()

        expect(data.paramsForUpdate).toStrictEqual({
          startedAtDate: '10/7/2050',
        })
        expect(data.error).toBeNull()
      })
    })
    describe('when date is invalid format', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({
          'create-group-date': '2025-07-10',
        })

        const data = await new CreateGroupForm(request).createGroupDateData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-date',
              formFields: ['create-group-date'],
              message: 'Enter a date in the format 10/7/2025',
            },
          ],
        })
      })
    })
    describe('when date is missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new CreateGroupForm(request).createGroupDateData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-date',
              formFields: ['create-group-date'],
              message: 'Enter or select a date',
            },
          ],
        })
      })
    })
    describe('when date is in the past', () => {
      it('returns appropriate error', async () => {
        const request = TestUtils.createRequest({
          'create-group-date': '1/1/2000',
        })

        const data = await new CreateGroupForm(request).createGroupDateData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error.errors[0].message).toBe('Enter or select a date in the future')
      })
    })
  })

  describe('createGroupCohortData', () => {
    describe('when cohort is provided', () => {
      it('returns params for update', async () => {
        const today = new Date()
        today.setDate(today.getDate() + 1)
        const day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        const formatted = `${day}/${month}/${year}`

        const request = TestUtils.createRequest({
          'create-group-date': formatted,
        })

        const data = await new CreateGroupForm(request).createGroupDateData()

        expect(data.paramsForUpdate).toStrictEqual({
          startedAtDate: formatted,
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when cohort is missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new CreateGroupForm(request).createGroupCohortData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-cohort',
              formFields: ['create-group-cohort'],
              message: 'Select a cohort',
            },
          ],
        })
      })
    })
  })

  describe('createGroupSexData', () => {
    describe('when sex is provided', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'create-group-sex': 'Male',
        })

        const data = await new CreateGroupForm(request).createGroupSexData()

        expect(data.paramsForUpdate).toStrictEqual({
          sex: 'Male',
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when sex is missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new CreateGroupForm(request).createGroupSexData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-sex',
              formFields: ['create-group-sex'],
              message: 'Select a gender',
            },
          ],
        })
      })
    })
  })
})

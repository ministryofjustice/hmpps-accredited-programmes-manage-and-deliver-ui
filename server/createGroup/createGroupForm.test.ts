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
              message: 'Code: Please change this error message in errorMessages.ts',
            },
          ],
        })
      })
    })
  })

  describe('createGroupCohortData', () => {
    describe('when cohort is provided', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'create-group-cohort': 'SEXUAL',
        })

        const data = await new CreateGroupForm(request).createGroupCohortData()

        expect(data.paramsForUpdate).toStrictEqual({
          cohort: 'SEXUAL',
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
              message: 'Cohort: Please change this error message in errorMessages.ts',
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
              message: 'Sex: Please change this error message in errorMessages.ts',
            },
          ],
        })
      })
    })
  })
})

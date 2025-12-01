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
              message: 'Select a sex',
            },
          ],
        })
      })
    })
  })

  describe('createGroupPduData', () => {
    describe('when pdu is provided', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'create-group-pdu': '{"code":"LDN", "name":"London"}',
        })

        const data = await new CreateGroupForm(request).createGroupPduData()

        expect(data.paramsForUpdate).toStrictEqual({
          pduName: 'London',
          pduCode: 'LDN',
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when pdu is missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new CreateGroupForm(request).createGroupPduData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-pdu',
              formFields: ['create-group-pdu'],
              message: 'Select a probation delivery unit. Start typing to search.',
            },
          ],
        })
      })
    })
  })

  describe('createGroupLocationData', () => {
    describe('when location is provided', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'create-group-location': '{"code":"CDF", "name":"Cardiff Office"}',
        })

        const data = await new CreateGroupForm(request).createGroupLocationData()

        expect(data.paramsForUpdate).toStrictEqual({
          deliveryLocationName: 'Cardiff Office',
          deliveryLocationCode: 'CDF',
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when location is missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new CreateGroupForm(request).createGroupLocationData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'create-group-location',
              formFields: ['create-group-location'],
              message: 'Select a delivery location.',
            },
          ],
        })
      })
    })

    describe('createGroupTreatmentManagerData', () => {
      describe('when treatment manager and facilitators are provided', () => {
        it('returns params for update', async () => {
          const request = TestUtils.createRequest({
            'create-group-treatment-manager':
              '{"facilitator":"John Smith","facilitatorCode":"JS123","teamName":"Team A","teamCode":"TA001","teamMemberType":"TREATMENT_MANAGER"}',
            'create-group-facilitator-1':
              '{"facilitator":"Jane Doe","facilitatorCode":"JD456","teamName":"Team B","teamCode":"TB002","teamMemberType":"REGULAR_FACILITATOR"}',
            'create-group-facilitator-2':
              '{"facilitator":"Bob Jones","facilitatorCode":"BJ789","teamName":"Team C","teamCode":"TC003","teamMemberType":"COVER_FACILITATOR"}',
          })

          const data = await new CreateGroupForm(request).createGroupTreatmentManagerData()

          expect(data.paramsForUpdate).toStrictEqual({
            teamMembers: [
              '{"facilitator":"John Smith","facilitatorCode":"JS123","teamName":"Team A","teamCode":"TA001","teamMemberType":"TREATMENT_MANAGER"}',
              '{"facilitator":"Jane Doe","facilitatorCode":"JD456","teamName":"Team B","teamCode":"TB002","teamMemberType":"REGULAR_FACILITATOR"}',
              '{"facilitator":"Bob Jones","facilitatorCode":"BJ789","teamName":"Team C","teamCode":"TC003","teamMemberType":"COVER_FACILITATOR"}',
            ],
          })
          expect(data.error).toBeNull()
        })
      })

      describe('when treatment manager is missing', () => {
        it('returns an appropriate error', async () => {
          const request = TestUtils.createRequest({
            'create-group-facilitator-1':
              '{"facilitator":"Jane Doe","facilitatorCode":"JD456","teamName":"Team B","teamCode":"TB002","teamMemberType":"REGULAR_FACILITATOR"}',
          })

          const data = await new CreateGroupForm(request).createGroupTreatmentManagerData()

          expect(data.paramsForUpdate).toBeNull()
          expect(data.error).toStrictEqual({
            errors: [
              {
                errorSummaryLinkedField: 'create-group-treatment-manager',
                formFields: ['create-group-treatment-manager'],
                message: 'Select a Treatment Manager. Start typing to search.',
              },
            ],
          })
        })
      })

      describe('when facilitator is missing', () => {
        it('returns an appropriate error', async () => {
          const request = TestUtils.createRequest({
            'create-group-treatment-manager':
              '{"facilitator":"John Smith","facilitatorCode":"JS123","teamName":"Team A","teamCode":"TA001","teamMemberType":"TREATMENT_MANAGER"}',
          })

          const data = await new CreateGroupForm(request).createGroupTreatmentManagerData()

          expect(data.paramsForUpdate).toBeNull()
          expect(data.error).toStrictEqual({
            errors: [
              {
                errorSummaryLinkedField: 'create-group-facilitator',
                formFields: ['create-group-facilitator'],
                message: 'Select a Facilitator. Start typing to search.',
              },
            ],
          })
        })
      })

      describe('when both treatment manager and facilitator are missing', () => {
        it('returns errors for both fields', async () => {
          const request = TestUtils.createRequest({})

          const data = await new CreateGroupForm(request).createGroupTreatmentManagerData()

          expect(data.paramsForUpdate).toBeNull()
          expect(data.error.errors).toHaveLength(2)
          expect(data.error.errors).toContainEqual({
            errorSummaryLinkedField: 'create-group-treatment-manager',
            formFields: ['create-group-treatment-manager'],
            message: 'Select a Treatment Manager. Start typing to search.',
          })
          expect(data.error.errors).toContainEqual({
            errorSummaryLinkedField: 'create-group-facilitator',
            formFields: ['create-group-facilitator'],
            message: 'Select a Facilitator. Start typing to search.',
          })
        })
      })

      describe('when empty facilitator fields are included', () => {
        it('filters out empty values and returns params for update', async () => {
          const request = TestUtils.createRequest({
            'create-group-treatment-manager':
              '{"facilitator":"John Smith","facilitatorCode":"JS123","teamName":"Team A","teamCode":"TA001","teamMemberType":"TREATMENT_MANAGER"}',
            'create-group-facilitator-1':
              '{"facilitator":"Jane Doe","facilitatorCode":"JD456","teamName":"Team B","teamCode":"TB002","teamMemberType":"REGULAR_FACILITATOR"}',
            'create-group-facilitator-2': '',
            'create-group-facilitator-3': '',
          })

          const data = await new CreateGroupForm(request).createGroupTreatmentManagerData()

          expect(data.paramsForUpdate).toStrictEqual({
            teamMembers: [
              '{"facilitator":"John Smith","facilitatorCode":"JS123","teamName":"Team A","teamCode":"TA001","teamMemberType":"TREATMENT_MANAGER"}',
              '{"facilitator":"Jane Doe","facilitatorCode":"JD456","teamName":"Team B","teamCode":"TB002","teamMemberType":"REGULAR_FACILITATOR"}',
            ],
          })
          expect(data.error).toBeNull()
        })
      })
    })
  })
})

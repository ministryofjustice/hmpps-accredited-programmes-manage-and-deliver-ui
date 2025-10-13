import { fakerEN_GB as faker } from '@faker-js/faker'
import { SessionData } from 'express-session'
import TestUtils from '../testutils/testUtils'
import deliveryLocationPreferencesFormDataFactory from '../testutils/factories/deliveryLocationPreferences/deliveryLocationPreferencesFormDataFactory'
import AddLocationPreferenceForm from './addLocationPreferenceForm'

describe(`AddLocationPreferenceForm `, () => {
  describe('primaryPduData', () => {
    const referralId = faker.string.uuid()
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        // Given
        const preferredDeliveryLocations = deliveryLocationPreferencesFormDataFactory.build()

        const sessionData: Partial<SessionData> = {
          locationPreferenceFormData: {
            preferredLocationReferenceData: preferredDeliveryLocations,
          },
        }

        const expectedLocationDataResult = [
          {
            deliveryLocations: [
              {
                code: 'OFF-001',
                description: 'Primary PDU Office Location',
              },
            ],
            pduCode: preferredDeliveryLocations.primaryPdu.code,
            pduDescription: preferredDeliveryLocations.primaryPdu.name,
          },
        ]

        const request = TestUtils.createRequestWithSession(
          {
            'pdu-locations': ['OFF-001', 'OFF-002'],
            'add-other-pdu-locations': 'Yes',
          },
          sessionData,
        )

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).primaryPduData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual({
          referralId,
          locations: expectedLocationDataResult,
          addOtherPduLocations: 'Yes',
        })
      })
    })

    describe('when mandatory fields are missing', () => {
      it('returns params for update as null and error field is present', async () => {
        // Given
        const request = TestUtils.createRequest({
          'pdu-locations': ['OFF-001', 'OFF-002'],
        })

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).primaryPduData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual(null)
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'add-other-pdu-locations',
              formFields: ['add-other-pdu-locations'],
              message: 'Select whether you want to add locations in another PDU',
            },
          ],
        })
      })
    })
  })

  describe('additionalPdusData', () => {
    const referralId = faker.string.uuid()
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        // Given
        const preferredDeliveryLocations = deliveryLocationPreferencesFormDataFactory.build()

        const sessionData: Partial<SessionData> = {
          locationPreferenceFormData: {
            preferredLocationReferenceData: preferredDeliveryLocations,
          },
        }

        const expectedLocationDataResult = [
          {
            deliveryLocations: [
              {
                code: 'OFF-999',
                description: 'Office Nearby',
              },
            ],
            pduCode: 'PDU-999',
            pduDescription: 'Other PDU in same region',
          },
        ]

        const request = TestUtils.createRequestWithSession({ 'PDU-999': 'OFF-999' }, sessionData)

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).additionalPdusData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual({
          referralId,
          otherPduLocations: expectedLocationDataResult,
        })
      })
    })

    describe('when there are no matching locations', () => {
      it('returns params for update locations as an empty array', async () => {
        // Given
        const preferredDeliveryLocations = deliveryLocationPreferencesFormDataFactory.build()

        const sessionData: Partial<SessionData> = {
          locationPreferenceFormData: {
            preferredLocationReferenceData: preferredDeliveryLocations,
          },
        }

        const request = TestUtils.createRequestWithSession({ 'PDU-111': 'OFF-111' }, sessionData)

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).additionalPdusData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual({
          referralId,
          otherPduLocations: [],
        })
      })
    })
  })

  describe('cannotAttendLocationData', () => {
    const referralId = faker.string.uuid()
    describe('when all mandatory fields are passed', () => {
      it('if there are locations that cannot be attended, they are returned params for update', async () => {
        // Given
        const request = TestUtils.createRequest({
          'cannot-attend-locations-radio': 'yes',
          'cannot-attend-locations-text-area': 'office 1',
        })

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).cannotAttendLocationData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual({
          referralId,
          cannotAttendLocations: 'office 1',
        })
      })

      it('if there are no locations that cant be attended null is returned in params for update for that field', async () => {
        // Given
        const request = TestUtils.createRequest({
          'cannot-attend-locations-radio': 'no',
          'cannot-attend-locations-text-area': null,
        })

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).cannotAttendLocationData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual({
          referralId,
          cannotAttendLocations: null,
        })
      })
    })

    describe('when mandatory fields are missing or incorrect', () => {
      it('cannot-attend-locations-radio returned in error summary if field is missing', async () => {
        // Given
        const request = TestUtils.createRequest({
          'cannot-attend-locations-text-area': 'test value',
        })

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).cannotAttendLocationData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual(null)
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'cannot-attend-locations-radio',
              formFields: ['cannot-attend-locations-radio'],
              message: 'Select whether there are any locations the person cannot attend',
            },
          ],
        })
      })

      it('cannot-attend-locations-text area cannot be null if cannot-attend-locations-radio is set to yes', async () => {
        // Given
        const request = TestUtils.createRequest({
          'cannot-attend-locations-radio': 'yes',
          'cannot-attend-locations-text-area': null,
        })

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).cannotAttendLocationData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual(null)
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'cannot-attend-locations-text-area',
              formFields: ['cannot-attend-locations-text-area'],
              message: 'Give details of the locations the person cannot attend',
            },
          ],
        })
      })

      it('cannot-attend-locations-text area cannot exceed 2000 characters', async () => {
        // Given
        const request = TestUtils.createRequest({
          'cannot-attend-locations-radio': 'yes',
          'cannot-attend-locations-text-area': faker.string.alpha({ length: 2001 }),
        })

        // When
        const data = await new AddLocationPreferenceForm(request, referralId).cannotAttendLocationData()

        // Then
        expect(data.paramsForUpdate).toStrictEqual(null)
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'cannot-attend-locations-text-area',
              formFields: ['cannot-attend-locations-text-area'],
              message: 'Location details must be 2,000 characters or fewer',
            },
          ],
        })
      })
    })
  })
})

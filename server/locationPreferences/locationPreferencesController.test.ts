import {
  Availability,
  CreateDeliveryLocationPreferences,
  DeliveryLocationPreferencesFormData,
  PersonalDetails,
  ReferralDetails,
} from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import deliveryLocationPreferencesFormDataFactory from '../testutils/factories/deliveryLocationPreferences/deliveryLocationPreferencesFormDataFactory'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralDetails: ReferralDetails = referralDetailsFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      accreditedProgrammesManageAndDeliverService,
    },
  })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
})

describe('location-preferences', () => {
  describe(`GET /referral/:referralId/add-location-preferences`, () => {
    it('loads the add location preferences for primary pdu page', async () => {
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )
      return request(app)
        .get(`/referral/${randomUUID()}/add-location-preferences`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(`Where can ${referralDetails.personName} attend a programme?`)
        })
    })

    it('calls the service with correct parameters', async () => {
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )
      const referralId = randomUUID()
      await request(app).get(`/referral/${referralId}/add-location-preferences`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral).toHaveBeenCalledWith(
        'user1',
        referralId,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockRejectedValue(
        new Error('Service unavailable'),
      )

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/add-location-preferences`).expect(500)
    })
  })

  describe(`POST /referral/:referralId/add-location-preferences`, () => {
    it('posts to the add availability page and redirects successfully to the additional pdu page if add-other-pdu-locations is selected', async () => {
      const referralId = randomUUID()
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      return request(app)
        .post(`/referral/${referralId}/add-location-preferences`)
        .type('form')
        .send({
          'pdu-locations': ['Location1', 'Location2'],
          'add-other-pdu-locations': 'yes',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /referral/${referralId}/add-location-preferences/additional-pdus`)
        })
    })

    it('posts to the add availability page and redirects successfully to the cannot attend loactions page if add-other-pdu-locations is not selected', async () => {
      const referralId = randomUUID()
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      return request(app)
        .post(`/referral/${referralId}/add-location-preferences`)
        .type('form')
        .send({
          'pdu-locations': ['Location1', 'Location2'],
          'add-other-pdu-locations': 'no',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral/${referralId}/add-location-preferences/cannot-attend-locations`,
          )
        })
    })
  })

  describe(`GET /referral/:referralId/add-location-preferences/additional-pdus`, () => {
    it('loads the add additional location preferences page', async () => {
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      // app.request.session.locationPreferenceFormData = {
      //   updatePreferredLocationData: null,
      //   preferredLocationReferenceData: deliveryLocationPreferencesFormData,
      //   hasUpdatedAdditionalLocationData: null,
      // }

      return request(app)
        .get(`/referral/${randomUUID()}/add-location-preferences/additional-pdus`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(`Which locations can ${referralDetails.personName} attend`)
        })
    })
  })
})

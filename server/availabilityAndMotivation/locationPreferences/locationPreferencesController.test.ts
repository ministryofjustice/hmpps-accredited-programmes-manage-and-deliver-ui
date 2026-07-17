import { ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { SessionData } from 'express-session'
import { appWithAllRoutes } from '../../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../../services/auditService'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'
import deliveryLocationPreferencesFormDataFactory from '../../testutils/factories/deliveryLocationPreferences/deliveryLocationPreferencesFormDataFactory'
import createDeliveryLocationPreferencesFactory from '../../testutils/factories/deliveryLocationPreferences/createDeliveryLocationPreferencesFactory'
import TestUtils from '../../testutils/testUtils'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')
jest.mock('../../services/auditService')

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
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'VIEW_ADD_LOCATION_PREFERENCES',
            'user1',
            referralDetails.crn,
            'CRN',
            { referralId: expect.any(String) },
          )
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
          expect(res.text).toContain(`Redirecting to /referral/${referralId}/add-location-preferences/other-pdu`)
        })
        .expect(() => {
          expect(sendAuditEvent).not.toHaveBeenCalledWith(
            'VIEW_ADD_LOCATION_PREFERENCES',
            'user1',
            referralDetails.crn,
            'CRN',
            { referralId: expect.any(String) },
          )
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
          expect(res.text).toContain(`Redirecting to /referral/${referralId}/add-locations-cannot-attend`)
        })
        .expect(() => {
          expect(sendAuditEvent).not.toHaveBeenCalledWith(
            'VIEW_ADDITIONAL_PDU_LOCATION_PREFERENCES',
            'user1',
            referralDetails.crn,
            'CRN',
            { referralId: expect.any(String) },
          )
        })
    })
  })

  describe(`GET /referral/:referralId/add-location-preferences/other-pdu`, () => {
    it('loads the add additional location preferences page', async () => {
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      const createDeliveryLocationPreferences = createDeliveryLocationPreferencesFactory.build({
        cannotAttendText: null,
      })

      const sessionData: Partial<SessionData> = {
        originPage: '',
        locationPreferenceFormData: {
          updatePreferredLocationData: createDeliveryLocationPreferences,
          preferredLocationReferenceData: deliveryLocationPreferencesFormData,
          hasUpdatedAdditionalLocationData: null,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/add-location-preferences/other-pdu`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(`Which other locations can ${referralDetails.personName} attend`)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'VIEW_ADDITIONAL_PDU_LOCATION_PREFERENCES',
            'user1',
            referralDetails.crn,
            'CRN',
            { referralId: expect.any(String) },
          )
        })
    })
  })

  describe(`POST /referral/:referralId/add-location-preferences/other-pdu`, () => {
    it('loads the add additional location preferences page', async () => {
      const referralId = randomUUID()
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      const createDeliveryLocationPreferences = createDeliveryLocationPreferencesFactory.build({
        cannotAttendText: null,
      })

      const sessionData: Partial<SessionData> = {
        originPage: '',
        locationPreferenceFormData: {
          updatePreferredLocationData: createDeliveryLocationPreferences,
          preferredLocationReferenceData: deliveryLocationPreferencesFormData,
          hasUpdatedAdditionalLocationData: null,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      return request(app)
        .post(`/referral/${referralId}/add-location-preferences/other-pdu`)
        .type('form')
        .send({
          PDU002: ['LOC005', 'LOC003'],
          PDU003: 'LOC006',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /referral/${referralId}/add-locations-cannot-attend`)
        })
        .expect(() => {
          expect(sendAuditEvent).not.toHaveBeenCalledWith(
            'VIEW_ADDITIONAL_PDU_LOCATION_PREFERENCES',
            'user1',
            referralDetails.crn,
            'CRN',
            { referralId: expect.any(String) },
          )
        })
    })
  })

  describe(`GET /referral/:referralId/add-locations-cannot-attend`, () => {
    it('loads the add cannot attend location preferences page', async () => {
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()
      const createDeliveryLocationPreferences = createDeliveryLocationPreferencesFactory.build({
        cannotAttendText: null,
      })

      const sessionData: Partial<SessionData> = {
        originPage: '',
        locationPreferenceFormData: {
          updatePreferredLocationData: createDeliveryLocationPreferences,
          preferredLocationReferenceData: deliveryLocationPreferencesFormData,
          hasUpdatedAdditionalLocationData: null,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/add-locations-cannot-attend`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(`Are there any locations ${referralDetails.personName} cannot attend?`)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'VIEW_CANNOT_ATTEND_LOCATIONS',
            'user1',
            referralDetails.crn,
            'CRN',
            { referralId: expect.any(String) },
          )
        })
    })
  })

  describe(`POST /referral/:referralId/add-locations-cannot-attend`, () => {
    const createDeliveryLocationPreferences = createDeliveryLocationPreferencesFactory.build({
      cannotAttendText: 'A reason',
    })

    it('sends a put request to the api if there are existing location preferences', async () => {
      const referralId = randomUUID()
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory
        .existingDeliveryLocationPreferences()
        .build()

      const sessionData: Partial<SessionData> = {
        originPage: '',
        locationPreferenceFormData: {
          updatePreferredLocationData: createDeliveryLocationPreferences,
          preferredLocationReferenceData: deliveryLocationPreferencesFormData,
          hasUpdatedAdditionalLocationData: null,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      await request(app)
        .post(`/referral/${referralId}/add-locations-cannot-attend`)
        .type('form')
        .send({
          'cannot-attend-locations-radio': 'yes',
          'cannot-attend-locations-text-area': 'A reason',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral/${referralId}/availability-and-motivation/location?preferredLocationUpdated=true#location`,
          )
        })

      expect(accreditedProgrammesManageAndDeliverService.updateDeliveryLocationPreferences).toHaveBeenCalledWith(
        'user1',
        referralId,
        createDeliveryLocationPreferences,
      )
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_CANNOT_ATTEND_LOCATIONS',
        'user1',
        referralDetails.crn,
        'CRN',
        { referralId: expect.any(String) },
      )
    })

    it('sends an post request to the api with correct data if there was no existing location preferences.', async () => {
      const referralId = randomUUID()
      const deliveryLocationPreferencesFormData = deliveryLocationPreferencesFormDataFactory.build()

      const sessionData: Partial<SessionData> = {
        originPage: '',
        locationPreferenceFormData: {
          updatePreferredLocationData: createDeliveryLocationPreferences,
          preferredLocationReferenceData: deliveryLocationPreferencesFormData,
          hasUpdatedAdditionalLocationData: null,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockResolvedValue(
        deliveryLocationPreferencesFormData,
      )

      await request(app)
        .post(`/referral/${referralId}/add-locations-cannot-attend`)
        .type('form')
        .send({
          'cannot-attend-locations-radio': 'yes',
          'cannot-attend-locations-text-area': 'A reason',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral/${referralId}/availability-and-motivation/location?preferredLocationUpdated=true#location`,
          )
        })

      expect(accreditedProgrammesManageAndDeliverService.createDeliveryLocationPreferences).toHaveBeenCalledWith(
        'user1',
        referralId,
        createDeliveryLocationPreferences,
      )
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_CANNOT_ATTEND_LOCATIONS',
        'user1',
        referralDetails.crn,
        'CRN',
        { referralId: expect.any(String) },
      )
    })

    it('keeps location preference journey state isolated per referral across multiple tabs', async () => {
      const referralIdA = randomUUID()
      const referralIdB = randomUUID()

      const locationDataA = deliveryLocationPreferencesFormDataFactory.build({
        primaryPdu: {
          code: 'PDU-A',
          name: 'PDU A',
          deliveryLocations: [{ label: 'Office A', value: 'OFF-A-001' }],
        },
      })

      const locationDataB = deliveryLocationPreferencesFormDataFactory.build({
        primaryPdu: {
          code: 'PDU-B',
          name: 'PDU B',
          deliveryLocations: [{ label: 'Office B', value: 'OFF-B-001' }],
        },
      })

      accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral.mockImplementation(
        async (_, referralId) => (referralId === referralIdA ? locationDataA : locationDataB),
      )

      const agent = request.agent(app)

      await agent
        .post(`/referral/${referralIdA}/add-location-preferences`)
        .type('form')
        .send({
          'pdu-locations': ['OFF-A-001'],
          'add-other-pdu-locations': 'no',
        })
        .expect(302)

      await agent
        .post(`/referral/${referralIdB}/add-location-preferences`)
        .type('form')
        .send({
          'pdu-locations': ['OFF-B-001'],
          'add-other-pdu-locations': 'no',
        })
        .expect(302)

      await agent
        .post(`/referral/${referralIdA}/add-locations-cannot-attend`)
        .type('form')
        .send({
          'cannot-attend-locations-radio': 'yes',
          'cannot-attend-locations-text-area': 'A reason for referral A',
        })
        .expect(302)

      expect(accreditedProgrammesManageAndDeliverService.createDeliveryLocationPreferences).toHaveBeenCalledWith(
        'user1',
        referralIdA,
        {
          preferredDeliveryLocations: [
            {
              pduCode: 'PDU-A',
              pduDescription: 'PDU A',
              deliveryLocations: [{ code: 'OFF-A-001', description: 'Office A' }],
            },
          ],
          cannotAttendText: 'A reason for referral A',
        },
      )
    })
  })
})

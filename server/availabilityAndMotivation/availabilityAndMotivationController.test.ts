import { Availability, DeliveryLocationPreferences, ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { fakerEN_GB as faker } from '@faker-js/faker'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import ReferralMotivationBackgroundAndNonAssociationsFactory from '../testutils/factories/referralMotivationBackgroundAndNonAssociationsFactory'
import availabilityFactory from '../testutils/factories/availabilityFactory'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
jest.mock('../services/auditService')

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

describe('availabilityAndMotivation controller', () => {
  describe('GET /referral/:referralId/availability-and-motivation/motivation-background-and-non-associations', () => {
    it('loads the motivation background and non associations page', async () => {
      const motivationBackgroundAndNonAssociations = ReferralMotivationBackgroundAndNonAssociationsFactory.build({
        id: null,
      })
      accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations.mockResolvedValue(
        motivationBackgroundAndNonAssociations,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/availability-and-motivation/motivation-background-and-non-associations`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Availability and motivation: ${referralDetails.personName}`)
          expect(res.text).toContain(`Motivation, background and non-associations`)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_SHOW_MOTIVATION', 'user1', referralDetails.crn, 'CRN', {
            referralId: expect.any(String),
          })
        })
    })
  })

  describe('GET /referral/:referralId/availability-and-motivation/add-motivation-background-and-non-associations', () => {
    it('loads the page to add motivation background and non associations', async () => {
      const motivationBackgroundAndNonAssociations = ReferralMotivationBackgroundAndNonAssociationsFactory.build({
        id: null,
      })
      accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations.mockResolvedValue(
        motivationBackgroundAndNonAssociations,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/add-motivation-background-and-non-associations`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Provide information about motivation, background and non-associations`)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_ADD_MOTIVATION', 'user1', referralDetails.crn, 'CRN', {
            referralId: expect.any(String),
          })
        })
    })
  })

  describe(`POST /referral/:referralId/add-motivation-background-and-non-associations`, () => {
    it('posts to the add motivation background and non associations page and redirects successfully', async () => {
      const referralId = '123'
      return request(app)
        .post(`/referral/${referralId}/add-motivation-background-and-non-associations`)
        .type('form')
        .send({
          'maintains-innocence': 'yes',
          'motivated-character-count': 'They are motivated',
          'other-considerations-character-count': 'Some considerations',
          'non-associations-character-count': 'Some non associations',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral/${referralId}/availability-and-motivation/motivation-background-and-non-associations?isMotivationsUpdated=true`,
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('EDIT_REFERRAL_MOTIVATION', 'user1', referralDetails.crn, 'CRN', {
            referralId,
            details: {
              maintainsInnocence: true,
              motivations: 'They are motivated',
              otherConsiderations: 'Some considerations',
              nonAssociations: 'Some non associations',
            },
          })
          const call = (sendAuditEvent as jest.Mock).mock.calls.find(c => c[0] === 'EDIT_REFERRAL_MOTIVATION')
          expect(call).toBeDefined()
          const payload = call[4]
          expect(payload).toBeDefined()
          expect(payload.details).toBeDefined()
          expect(JSON.stringify(payload.details)).toContain('They are motivated')
        })
    })

    it('returns with errors if validation fails', async () => {
      const referralId = '123'
      const motivationBackgroundAndNonAssociations = ReferralMotivationBackgroundAndNonAssociationsFactory.build({
        id: null,
      })
      accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations.mockResolvedValue(
        motivationBackgroundAndNonAssociations,
      )

      return request(app)
        .post(`/referral/${referralId}/add-motivation-background-and-non-associations`)
        .type('form')
        .send({ 'motivated-character-count': faker.string.alpha({ length: 2001 }) })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Details must be 2,000 characters or fewer`)
        })
    })
  })

  describe(`GET /referral/availability-and-motivation/:id/location`, () => {
    it('loads the locations sub-nav with no existing details', async () => {
      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)

      const deliveryLocationPreferences: DeliveryLocationPreferences = {
        preferredDeliveryLocations: [],
        cannotAttendLocations: null,
        lastUpdatedAt: null,
        lastUpdatedBy: null,
      }
      accreditedProgrammesManageAndDeliverService.getDeliveryLocationPreferences.mockResolvedValue(
        deliveryLocationPreferences,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/availability-and-motivation/location`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Location')
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_SHOW_LOCATION', 'user1', referralDetails.crn, 'CRN', {
            referralId: expect.any(String),
          })
        })
    })

    it('loads the locations sub-nav with existing details', async () => {
      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)

      const deliveryLocationPreferences: DeliveryLocationPreferences = {
        preferredDeliveryLocations: [],
        cannotAttendLocations: 'Cannot attend locations in NE1',
        lastUpdatedAt: '25th September 2025',
        lastUpdatedBy: 'TEST_USER',
      }
      accreditedProgrammesManageAndDeliverService.getDeliveryLocationPreferences.mockResolvedValue(
        deliveryLocationPreferences,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/availability-and-motivation/location`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Location')
          expect(res.text).toContain('Cannot attend locations in NE1')
          expect(res.text).toContain('25th September 2025')
          expect(res.text).toContain('TEST_USER')
        })
    })

    describe(`GET /referral/:id/availability-and-motivation/availability`, () => {
      it('loads the availability sub-nav', async () => {
        const availability: Availability = availabilityFactory.defaultAvailability().build()
        accreditedProgrammesManageAndDeliverService.getAvailability.mockResolvedValue(availability)

        return request(app)
          .get(`/referral/${randomUUID()}/availability-and-motivation/availability`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
            expect(res.text).toContain('No availability details added for')
            expect(res.text).toContain('Add availability')
          })
          .then(() => {
            expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_SHOW_AVAILABILITY', 'user1', referralDetails.crn, 'CRN', {
              referralId: expect.any(String),
            })
          })
      })
    })
  })
})

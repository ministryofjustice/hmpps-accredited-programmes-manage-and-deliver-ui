import { Availability, PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { SessionData } from 'express-session'
import { appWithAllRoutes } from '../../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../../services/auditService'
import availabilityFactory from '../../testutils/factories/availabilityFactory'
import personalDetailsFactory from '../../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'
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

describe(`Add Availability`, () => {
  describe(`GET /referral/:referralId/add-availability`, () => {
    it('loads the add availability page successfully', async () => {
      const availability: Availability = availabilityFactory.defaultAvailability().build()
      const personalDetails: PersonalDetails = personalDetailsFactory.build()

      accreditedProgrammesManageAndDeliverService.getAvailability.mockResolvedValue(availability)
      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)

      return request(app)
        .get(`/referral/${randomUUID()}/add-availability`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`When is ${referralDetails.personName} available to attend a programme`)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_ADD_AVAILABILITY', 'user1', referralDetails.crn, 'CRN', {
            referralId: expect.any(String),
          })
        })
    })

    it('uses referral-specific origin page for back and cancel links when multiple PoP tabs are open', async () => {
      const referralId = randomUUID()
      const availability: Availability = availabilityFactory.defaultAvailability().build()
      const personalDetails: PersonalDetails = personalDetailsFactory.build()

      accreditedProgrammesManageAndDeliverService.getAvailability.mockResolvedValue(availability)
      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)

      const appWithReferralOriginMap = TestUtils.createTestAppWithSession(
        {
          originPage: '/referral-details/another-referral/personal-details',
          referralOriginPages: {
            [referralId]: `/referral/${referralId}/programme-needs-identifier`,
          },
        } as Partial<SessionData>,
        { accreditedProgrammesManageAndDeliverService },
      )

      return request(appWithReferralOriginMap)
        .get(`/referral/${referralId}/add-availability`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`href="/referral/${referralId}/programme-needs-identifier"`)
        })
    })
  })

  describe(`POST /referral/:referralId/add-availability`, () => {
    it('posts to the add availability page and redirects successfully', async () => {
      const referralId = randomUUID()
      const availability: Availability = availabilityFactory.defaultAvailability().build()
      const personalDetails: PersonalDetails = personalDetailsFactory.build()

      accreditedProgrammesManageAndDeliverService.getAvailability.mockResolvedValue(availability)
      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)

      return request(app)
        .post(`/referral/${referralId}/add-availability`)
        .type('form')
        .send({
          'availability-checkboxes': ['Mondays-daytime', 'Sundays-evening'],
          'other-availability-details-text-area': 'text',
          'end-date': 'Yes',
          date: '31/7/9225',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral/${referralId}/availability-and-motivation/availability?detailsUpdated=true`,
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('CREATE_AVAILABILITY', 'user1', referralDetails.crn, 'CRN', {
            referralId: expect.any(String),
            details: expect.objectContaining({
              otherDetails: 'text',
              availabilities: expect.arrayContaining([
                expect.objectContaining({ label: 'Mondays' }),
                expect.objectContaining({ label: 'Sundays' }),
              ]),
              endDate: '9225-07-31',
              startDate: expect.any(String),
            }),
          })
        })
    })
  })

  describe(`POST /referral/:referralId/update-availability/:availabilityId`, () => {
    it('posts to update availability and redirects successfully with audit', async () => {
      const referralId = randomUUID()
      const availabilityId = randomUUID()
      const availability: Availability = availabilityFactory.defaultAvailability().build()
      const personalDetails: PersonalDetails = personalDetailsFactory.build()

      accreditedProgrammesManageAndDeliverService.getAvailability.mockResolvedValue(availability)
      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)

      return request(app)
        .post(`/referral/${referralId}/update-availability/${availabilityId}`)
        .type('form')
        .send({
          'availability-checkboxes': ['Mondays-daytime'],
          'other-availability-details-text-area': 'text',
          'end-date': 'No',
        })
        .expect(302)
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('EDIT_AVAILABILITY', 'user1', referralDetails.crn, 'CRN', {
            referralId: expect.any(String),
            availabilityId: expect.any(String),
            details: expect.objectContaining({
              otherDetails: 'text',
              availabilities: expect.arrayContaining([expect.objectContaining({ label: 'Mondays' })]),
              startDate: expect.any(String),
            }),
          })
        })
    })
  })
})

import { Availability, PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import availabilityFactory from '../../testutils/factories/availabilityFactory'
import personalDetailsFactory from '../../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')

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
    })
  })
})

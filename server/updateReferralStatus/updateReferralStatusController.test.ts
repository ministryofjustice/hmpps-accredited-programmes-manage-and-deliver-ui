import { Express } from 'express'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { ReferralDetails } from '@manage-and-deliver-api'
import referralStatusFormDataFactory from '../testutils/factories/referralStatusFormDataFactory'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralDetails: ReferralDetails = referralDetailsFactory.build()
const statusDetails = referralStatusFormDataFactory.build()
const referralId = randomUUID()

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
  accreditedProgrammesManageAndDeliverService.getStatusDetails.mockResolvedValue(statusDetails)
})

describe('update-status', () => {
  describe(`GET /referral/:referralId/update-status`, () => {
    it('loads the update status page', async () => {
      return request(app)
        .get(`/referral/${randomUUID()}/update-status`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(statusDetails.currentStatus.title)
          expect(res.text).toContain(`Update ${referralDetails.personName}'s referral status`)
        })
    })

    it('calls the service with correct parameters', async () => {
      await request(app).get(`/referral/${referralId}/update-status`).expect(200)
      expect(accreditedProgrammesManageAndDeliverService.getStatusDetails).toHaveBeenCalledWith(referralId, 'user1')
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getStatusDetails.mockRejectedValue(new Error('Service unavailable'))
      return request(app).get(`/referral/${referralId}/update-status`).expect(500)
    })
  })

  describe(`POST /referral/:referralId/update-status`, () => {
    it('posts to the update status endpoint and redirects successfully to the correct page', async () => {
      return request(app)
        .post(`/referral/${referralId}/update-status`)
        .type('form')
        .send({
          'updated-status': 'afc0b94c-b983-4a68-a109-0be29a7d3b2f',
          'more-details': 'some details',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral-details/${referralId}/personal-details?statusUpdated=true`,
          )
        })
    })
    it('handles form errors correctly and displays the appropriate error message', async () => {
      return request(app)
        .post(`/referral/${referralId}/update-status`)
        .type('form')
        .send({
          'updated-status': undefined,
          'more-details': 'some details',
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Select the referral status you want to move the person to.`)
        })
    })
  })
})

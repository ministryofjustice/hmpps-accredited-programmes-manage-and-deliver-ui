import { Express } from 'express'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { ReferralDetails } from '@manage-and-deliver-api'
import { SessionData } from 'express-session'
import { fakerEN_GB as faker } from '@faker-js/faker'
import referralStatusFormDataFactory from '../testutils/factories/referralStatusFormDataFactory'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import TestUtils from '../testutils/testUtils'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralDetails: ReferralDetails = referralDetailsFactory.build()
const statusDetails = referralStatusFormDataFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    originPage: '/referral-details/1/personal-details',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
  accreditedProgrammesManageAndDeliverService.getStatusDetails.mockResolvedValue(statusDetails)
})
describe('Update Referral Status Controller', () => {
  describe('update-status', () => {
    describe(`GET /referral/:referralDetails.id/update-status`, () => {
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
        await request(app).get(`/referral/${referralDetails.id}/update-status`).expect(200)
        expect(accreditedProgrammesManageAndDeliverService.getStatusDetails).toHaveBeenCalledWith(
          referralDetails.id,
          'user1',
        )
      })

      it('handles service errors gracefully', async () => {
        accreditedProgrammesManageAndDeliverService.getStatusDetails.mockRejectedValue(new Error('Service unavailable'))
        return request(app).get(`/referral/${referralDetails.id}/update-status`).expect(500)
      })
    })

    describe(`POST /referral/:referralDetails.id/update-status`, () => {
      it('posts to the update status endpoint and redirects successfully to the correct page', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status`)
          .type('form')
          .send({
            'updated-status': 'afc0b94c-b983-4a68-a109-0be29a7d3b2f',
            'more-details': 'some details',
          })
          .expect(302)
          .expect(res => {
            expect(res.text).toContain(
              `Redirecting to /referral/${referralDetails.id}/status-history?statusUpdated=true`,
            )
          })
      })
      it('handles form errors correctly and displays the appropriate error message', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status`)
          .type('form')
          .send({
            'updated-status': undefined,
            'more-details': 'some details',
          })
          .expect(400)
          .expect(res => {
            expect(res.text).toContain(`Select the referral status you want to move the person to`)
          })
      })
    })
  })
  describe('update-status-interim', () => {
    describe(`GET /referral/:referralDetails.id/update-status-interim`, () => {
      it('loads the update status interim page', async () => {
        return request(app)
          .get(`/referral/${referralDetails.id}/update-status-scheduled`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
          })
      })
    })
    describe(`POST /referral/:referralDetails.id/update-status-scheduled (or on-programme)`, () => {
      it('redirects to update-status-details if hasStartedOrCompleted is true', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-scheduled`)
          .type('form')
          .send({ 'started-or-completed': 'true' })
          .expect(302)
          .expect(res => {
            expect(res.text).toContain(`/referral/${referralDetails.id}/update-status-details`)
          })
      })
      it('redirects to update-status if hasStartedOrCompleted is false', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-on-programme`)
          .type('form')
          .send({ 'started-or-completed': 'false' })
          .expect(302)
          .expect(res => {
            expect(res.text).toContain(`/referral/${referralDetails.id}/update-status`)
          })
      })

      it('returns 400 and displays error if radio buttons are not selected', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-on-programme`)
          .type('form')
          .send({})
          .expect(400)
          .expect(res => {
            expect(res.text).toContain('Select whether the person has completed the programme or not')
          })
      })
    })
  })

  describe('update-status-fixed', () => {
    describe(`GET /referral/:referralDetails.id/update-status-details`, () => {
      it('loads the update status fixed page for Scheduled', async () => {
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'Scheduled',
        })
        return request(app)
          .get(`/referral/${referralDetails.id}/update-status-scheduled`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
          })
      })

      it('loads the update status fixed page for On programme', async () => {
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'On programme',
        })
        return request(app)
          .get(`/referral/${referralDetails.id}/update-status-details`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
          })
      })
    })

    describe(`POST /referral/:referralDetails.id/update-status-details`, () => {
      it('updates status and redirects for On programme', async () => {
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'On programme',
        })
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-details`)
          .type('form')
          .send({ 'more-details': 'Some details' })
          .expect(302)
          .expect(res => {
            expect(res.text).toContain(`/referral/${referralDetails.id}/status-history?statusUpdated=true`)
          })
      })

      it('returns 400 and displays error if more-details is too long', async () => {
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'Scheduled',
        })
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-details`)
          .type('form')
          .send({ 'more-details': faker.string.alpha({ length: 501 }) })
          .expect(400)
          .expect(res => {
            expect(res.text).toContain('Details must be 500 characters or fewer')
          })
      })
    })
  })
})

import request from 'supertest'

import { CohortEnum, PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { Express } from 'express'
import { SessionData } from 'express-session'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import TestUtils from '../testutils/testUtils'

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
  const sessionData: Partial<SessionData> = {
    originPage: '/referral-details/1/personal-details',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
})

describe('Update cohort', () => {
  describe(`GET /referral/:referralDetails.id/update-cohort`, () => {
    it('calls the API with the correct params', async () => {
      accreditedProgrammesManageAndDeliverService.updateCohort.mockResolvedValue(referralDetails)
      return request(app)
        .get(`/referral/${referralDetails.id}/change-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(referralDetails.cohort)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_UPDATE_COHORT', 'user1', referralDetails.crn, 'CRN', {
            referralId: referralDetails.id,
          })
        })
    })
  })

  describe(`POST /referral/:referralDetails.id/update-cohort`, () => {
    it('posts to the update cohort page and redirects successfully', async () => {
      const personalDetails: PersonalDetails = personalDetailsFactory.build()

      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)
      accreditedProgrammesManageAndDeliverService.updateCohort.mockResolvedValue(referralDetails)

      return request(app)
        .post(`/referral/${referralDetails.id}/change-cohort`)
        .type('form')
        .send({
          updatedCohort: 'GENERAL_OFFENCE' as CohortEnum,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral-details/${referralDetails.id}/personal-details?isCohortUpdated=true`,
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('EDIT_REFERRAL_COHORT', 'user1', referralDetails.crn, 'CRN', {
            referralId: referralDetails.id,
            cohort: 'GENERAL_OFFENCE',
          })
        })
    })

    it('uses referral-specific origin page when session contains multiple referral tabs', async () => {
      const sessionData: Partial<SessionData> = {
        originPage: '/referral-details/another-referral/personal-details',
        referralOriginPages: {
          [referralDetails.id]: `/referral/${referralDetails.id}/availability-and-motivation/availability`,
        },
      }
      const appWithReferralOriginMap = TestUtils.createTestAppWithSession(sessionData, {
        accreditedProgrammesManageAndDeliverService,
      })

      accreditedProgrammesManageAndDeliverService.updateCohort.mockResolvedValue(referralDetails)

      return request(appWithReferralOriginMap)
        .post(`/referral/${referralDetails.id}/change-cohort`)
        .type('form')
        .send({
          updatedCohort: 'GENERAL_OFFENCE' as CohortEnum,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral/${referralDetails.id}/availability-and-motivation/availability?isCohortUpdated=true`,
          )
        })
    })
  })
})

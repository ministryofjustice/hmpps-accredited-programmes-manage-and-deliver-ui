import request from 'supertest'

import { CohortEnum, PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
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

    it('keeps cohort updates scoped per referral when multiple tabs are open', async () => {
      const referralIdA = 'referral-a'
      const referralIdB = 'referral-b'
      const originPageA = `/referral/${referralIdA}/availability-and-motivation/availability`
      const originPageB = `/referral/${referralIdB}/availability-and-motivation/location`

      const sessionData: Partial<SessionData> = {
        originPage: '/referral-details/unrelated-referral/personal-details',
        referralOriginPages: {
          [referralIdA]: originPageA,
          [referralIdB]: originPageB,
        },
      }
      const appWithReferralOriginMap = TestUtils.createTestAppWithSession(sessionData, {
        accreditedProgrammesManageAndDeliverService,
      })

      accreditedProgrammesManageAndDeliverService.updateCohort.mockResolvedValue(referralDetails)

      const agent = request.agent(appWithReferralOriginMap)

      await agent
        .post(`/referral/${referralIdA}/change-cohort`)
        .type('form')
        .send({
          updatedCohort: 'GENERAL_OFFENCE' as CohortEnum,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to ${originPageA}?isCohortUpdated=true`)
        })

      await agent
        .post(`/referral/${referralIdB}/change-cohort`)
        .type('form')
        .send({
          updatedCohort: 'SEXUAL_OFFENCE' as CohortEnum,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to ${originPageB}?isCohortUpdated=true`)
        })

      expect(accreditedProgrammesManageAndDeliverService.updateCohort).toHaveBeenNthCalledWith(
        1,
        'user1',
        referralIdA,
        'GENERAL_OFFENCE',
      )
      expect(accreditedProgrammesManageAndDeliverService.updateCohort).toHaveBeenNthCalledWith(
        2,
        'user1',
        referralIdB,
        'SEXUAL_OFFENCE',
      )
    })

    it('does not alter tab B links when tab A cohort is submitted', async () => {
      const referralIdA = randomUUID()
      const referralIdB = randomUUID()
      const originPageA = `/referral/${referralIdA}/availability-and-motivation/availability`
      const originPageB = `/referral/${referralIdB}/availability-and-motivation/location`

      const sessionData: Partial<SessionData> = {
        originPage: '/referral-details/unrelated-referral/personal-details',
        referralOriginPages: {
          [referralIdA]: originPageA,
          [referralIdB]: originPageB,
        },
      }
      const appWithReferralOriginMap = TestUtils.createTestAppWithSession(sessionData, {
        accreditedProgrammesManageAndDeliverService,
      })

      accreditedProgrammesManageAndDeliverService.updateCohort.mockResolvedValue(referralDetails)

      const agent = request.agent(appWithReferralOriginMap)

      await agent
        .post(`/referral/${referralIdA}/change-cohort`)
        .type('form')
        .send({
          updatedCohort: 'GENERAL_OFFENCE' as CohortEnum,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to ${originPageA}?isCohortUpdated=true`)
        })

      await agent
        .get(`/referral/${referralIdB}/change-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`href="${originPageB}"`)
        })

      expect(accreditedProgrammesManageAndDeliverService.updateCohort).toHaveBeenCalledTimes(1)
      expect(accreditedProgrammesManageAndDeliverService.updateCohort).toHaveBeenCalledWith(
        'user1',
        referralIdA,
        'GENERAL_OFFENCE',
      )
    })
  })
})

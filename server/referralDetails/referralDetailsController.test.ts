import {
  OffenceHistory,
  PersonalDetails,
  ReferralDetails,
  ReferralStatusHistory,
  SentenceInformation,
} from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import attendanceHistoryResponseFactory from '../testutils/factories/attendanceHistoryResponseFactory'
import offenceHistoryFactory from '../testutils/factories/offenceHistoryFactory'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import sentenceInformationFactory from '../testutils/factories/sentenceInformationFactory'
import statusHistoryFactory from '../testutils/factories/statusHistoryFactory'

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

describe('referral-details', () => {
  describe(`GET /referral-details/:id/personal-details`, () => {
    it('loads the referral details page with personal details sub-nav', async () => {
      const personalDetails: PersonalDetails = personalDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)
      return request(app)
        .get(`/referral-details/${randomUUID()}/personal-details`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(personalDetails.probationDeliveryUnit)
        })
    })
  })

  describe(`GET /referral-details/:id/offence-history`, () => {
    it('loads the referral details page with offence history sub-nav', async () => {
      const offenceHistory: OffenceHistory = offenceHistoryFactory.build()
      offenceHistory.mainOffence.offence = 'Absconding from lawful custody'
      accreditedProgrammesManageAndDeliverService.getOffenceHistory.mockResolvedValue(offenceHistory)
      return request(app)
        .get(`/referral-details/${randomUUID()}/offence-history`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Absconding from lawful custody')
        })
    })
  })

  describe(`GET /referral-details/:id/sentence-information`, () => {
    it('loads the referral details page with sentence information sub-nav', async () => {
      const sentenceInformation: SentenceInformation = sentenceInformationFactory.licence().build()
      accreditedProgrammesManageAndDeliverService.getSentenceInformation.mockResolvedValue(sentenceInformation)
      return request(app)
        .get(`/referral-details/${randomUUID()}/sentence-information`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Referral details: ${referralDetails.personName}`)
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Sentence details')
        })
    })
  })
})

describe(`/referral`, () => {
  describe(`GET /referral-details/:id/status-history`, () => {
    it('loads the referral details page with status history sub-nav', async () => {
      const statusHistory: ReferralStatusHistory[] = [
        statusHistoryFactory.awaitingAssessment().withAdditionalDetails('This was created automatically').build(),
        statusHistoryFactory.awaitingAllocation().build(),
      ]

      accreditedProgrammesManageAndDeliverService.getStatusHistory.mockResolvedValue(statusHistory)

      return request(app)
        .get(`/referral/${randomUUID()}/status-history`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('This was created automatically')
          expect(res.text).toContain('Awaiting assessment')

          expect(res.text).toContain('Awaiting allocation')
        })
    })
  })
})

describe(`Attendance History`, () => {
  const attendanceHistory = attendanceHistoryResponseFactory.build()

  beforeEach(() => {
    accreditedProgrammesManageAndDeliverService.getAttendanceHistory.mockResolvedValue(attendanceHistory)
  })

  describe(`GET /referral/:referralId/attendance-history`, () => {
    it('loads the attendance history page successfully', async () => {
      const referralId = randomUUID()

      return request(app)
        .get(`/referral/${referralId}/attendance-history`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Attendance history')
        })
    })

    it('displays sessions in the attendance history table', async () => {
      const referralId = randomUUID()

      return request(app)
        .get(`/referral/${referralId}/attendance-history`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Pre-group one-to-one')
          expect(res.text).toContain('Session 1: Introduction')
          expect(res.text).toContain('11 July 2025')
          expect(res.text).toContain('18 July 2025')
          expect(res.text).toContain('Attended')
          expect(res.text).toContain('Not attended')
        })
    })
  })
})

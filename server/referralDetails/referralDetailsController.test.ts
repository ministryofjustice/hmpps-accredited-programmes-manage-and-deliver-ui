import {
  Availability,
  OffenceHistory,
  PersonalDetails,
  ReferralDetails,
  SentenceInformation,
} from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import availabilityFactory from '../testutils/factories/availabilityFactory'
import sentenceInformationFactory from '../testutils/factories/sentenceInformationFactory'
import offenceHistoryFactory from '../testutils/factories/offenceHistoryFactory'

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

  describe(`GET /referral-details/:id/programme-history`, () => {
    it('loads the referral details page with programme history sub-nav', async () => {
      return request(app)
        .get(`/referral-details/${randomUUID()}/programme-history`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Programme History')
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
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Sentence details')
        })
    })
  })

  describe(`GET /referral-details/:id/availability`, () => {
    it('loads the referral details page with availability sub-nav', async () => {
      const availability: Availability = availabilityFactory.defaultAvailability().build()
      accreditedProgrammesManageAndDeliverService.getAvailability.mockResolvedValue(availability)

      return request(app)
        .get(`/referral-details/${randomUUID()}/availability`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('No availability details added for')
          expect(res.text).toContain('Add availability')
        })
    })
  })

  describe(`GET /referral-details/:id/location`, () => {
    it('loads the referral details page with locations sub-nav', async () => {
      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)

      return request(app)
        .get(`/referral-details/${randomUUID()}/location`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Location')
        })
    })
  })

  describe(`GET /referral-details/:id/additional-information`, () => {
    it('loads the referral details page with additional information sub-nav', async () => {
      return request(app)
        .get(`/referral-details/${randomUUID()}/additional-information`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Additional Information')
        })
    })
  })
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
          expect(res.text).toContain(`Redirecting to /referral-details/${referralId}/availability?detailsUpdated=true`)
        })
    })
  })
})

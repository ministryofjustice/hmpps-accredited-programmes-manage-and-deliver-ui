import { ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { fakerEN_GB as faker } from '@faker-js/faker'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import ReferralMotivationBackgroundAndNonAssociationsFactory from '../testutils/factories/referralMotivationBackgroundAndNonAssociationsFactory'

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

describe('Group allocation notes', () => {
  describe('GET /referral/:referralId/group-allocation-notes/motivation-background-and-non-associations', () => {
    it('loads the motivation background and non associations page', async () => {
      const motivationBackgroundAndNonAssociations = ReferralMotivationBackgroundAndNonAssociationsFactory.build({
        id: null,
      })
      accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations.mockResolvedValue(
        motivationBackgroundAndNonAssociations,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/group-allocation-notes/motivation-background-and-non-associations`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Group allocation notes`)
        })
    })
  })

  describe('GET /referral/:referralId/add-motivation-background-and-non-associations', () => {
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
            `Redirecting to /referral/${referralId}/group-allocation-notes/motivation-background-and-non-associations?isMotivationsUpdated=true`,
          )
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
})

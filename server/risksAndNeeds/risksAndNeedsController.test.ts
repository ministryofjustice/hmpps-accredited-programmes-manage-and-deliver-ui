import { ReferralDetails, RoshAnalysis } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import roshAnalysisFactory from '../testutils/factories/risksAndNeeds/roshAnalysisFactory'

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

describe('Rosh Analysis', () => {
  describe('GET /referral/:id/rosh-analysis', () => {
    it('loads the risks and needs page with ROSH analysis sub-nav', async () => {
      const roshAnalysis: RoshAnalysis = roshAnalysisFactory.build()
      accreditedProgrammesManageAndDeliverService.getRoshAnalysis.mockResolvedValue(roshAnalysis)
      return request(app)
        .get(`/referral/${randomUUID()}/rosh-analysis`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(roshAnalysis.assessmentCompleted)
          expect(res.text).toContain(roshAnalysis.offenceDetails)
          expect(res.text).toContain(roshAnalysis.whereAndWhen)
          expect(res.text).toContain(roshAnalysis.howDone)
          expect(res.text).toContain(roshAnalysis.whoVictims)
          expect(res.text).toContain(roshAnalysis.anyoneElsePresent)
          expect(res.text).toContain(roshAnalysis.whyDone)
          expect(res.text).toContain(roshAnalysis.sources)
          expect(res.text).toContain(roshAnalysis.identifyBehavioursIncidents)
          expect(res.text).toContain(roshAnalysis.analysisBehaviourIncidents)
        })
    })
  })
})

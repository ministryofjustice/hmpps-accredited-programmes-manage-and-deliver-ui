import { Health, LearningNeeds, ReferralDetails, Relationships, RoshAnalysis } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import learningNeedsFactory from '../testutils/factories/risksAndNeeds/learningNeedsFactory'
import roshAnalysisFactory from '../testutils/factories/risksAndNeeds/roshAnalysisFactory'
import healthFactory from '../testutils/factories/risksAndNeeds/healthFactory'
import relationshipsFactory from '../testutils/factories/risksAndNeeds/relationshipsFactory'

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

describe('Learning Needs', () => {
  describe('GET /referral/:id/learning-needs', () => {
    it('loads the risks and needs page with learning needs sub-nav and displays all learning needs data', async () => {
      const learningNeeds: LearningNeeds = learningNeedsFactory.build()
      accreditedProgrammesManageAndDeliverService.getLearningNeeds.mockResolvedValue(learningNeeds)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/learning-needs`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(learningNeeds.workRelatedSkills)
          expect(res.text).toContain(learningNeeds.problemsReadWriteNum)
          expect(res.text).toContain(learningNeeds.learningDifficulties)
          expect(res.text).toContain(learningNeeds.qualifications)
          expect(res.text).toContain(learningNeeds.basicSkillsScore)
          expect(res.text).toContain(learningNeeds.basicSkillsScoreDescription)
          learningNeeds.problemAreas?.forEach(problemArea => {
            expect(res.text).toContain(problemArea)
          })
        })
    })

    it('handles learning needs with minimal data', async () => {
      const learningNeeds: LearningNeeds = learningNeedsFactory.build({
        workRelatedSkills: undefined,
        problemsReadWriteNum: undefined,
        learningDifficulties: undefined,
        problemAreas: [],
        qualifications: undefined,
        basicSkillsScore: undefined,
        basicSkillsScoreDescription: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getLearningNeeds.mockResolvedValue(learningNeeds)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/learning-needs`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const learningNeeds: LearningNeeds = learningNeedsFactory.build()
      accreditedProgrammesManageAndDeliverService.getLearningNeeds.mockResolvedValue(learningNeeds)

      const referralId = randomUUID()
      await request(app).get(`/referral/${referralId}/learning-needs`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getLearningNeeds).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getLearningNeeds.mockRejectedValue(new Error('Service unavailable'))

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/learning-needs`).expect(500)
    })
  })
})

describe('Health section of risks and needs', () => {
  describe('GET /referral/:id/health', () => {
    it('loads the risks and needs page with health sub-nav and displays all health related data', async () => {
      const health: Health = healthFactory.build()
      accreditedProgrammesManageAndDeliverService.getHealth.mockResolvedValue(health)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/health`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain(health.description)

          const $ = cheerio.load(res.text)
          const element = $(`span[data-test-id='any-health-condition']`)
          expect(element).not.toBeNull()
        })
    })

    it('handles health info with minimal data', async () => {
      const health: Health = healthFactory.build({
        anyHealthConditions: undefined,
        description: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getHealth.mockResolvedValue(health)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/health`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const referralId = randomUUID()

      const health: Health = healthFactory.build()
      accreditedProgrammesManageAndDeliverService.getHealth.mockResolvedValue(health)

      await request(app).get(`/referral/${referralId}/health`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getHealth).toHaveBeenCalledWith('user1', referralDetails.crn)
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getHealth.mockRejectedValue(new Error('Service unavailable'))

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/health`).expect(500)
    })
  })
})

describe('Relationships', () => {
  describe('GET /referral/:id/relationships', () => {
    it('loads the risks and needs page with relationships sub-nav and displays all relationships data', async () => {
      const relationships: Relationships = relationshipsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRelationships.mockResolvedValue(relationships)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/relationships`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain(relationships.relIssuesDetails)
          expect(res.text).toContain('6.7 - Evidence of domestic violence / partner abuse')
          expect(res.text).toContain('6.7.1.1 - Is the victim a current or former partner?')
          expect(res.text).toContain('6.7.1.2 - Is the victim a family member?')
          expect(res.text).toContain('6.7.2.1 - Is the perpetrator a victim of partner or family abuse?')
          expect(res.text).toContain('6.7.2.2 - Are they the perpetrator of partner or family abuse?')
        })
    })

    it('handles relationships with minimal data', async () => {
      const relationships: Relationships = relationshipsFactory.build({
        dvEvidence: undefined,
        victimFormerPartner: undefined,
        victimFamilyMember: undefined,
        victimOfPartnerFamily: undefined,
        perpOfPartnerOrFamily: undefined,
        relIssuesDetails: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getRelationships.mockResolvedValue(relationships)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/relationships`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const relationships: Relationships = relationshipsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRelationships.mockResolvedValue(relationships)

      const referralId = randomUUID()
      await request(app).get(`/referral/${referralId}/relationships`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getRelationships).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getRelationships.mockRejectedValue(new Error('Service unavailable'))

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/relationships`).expect(500)
    })
  })
})

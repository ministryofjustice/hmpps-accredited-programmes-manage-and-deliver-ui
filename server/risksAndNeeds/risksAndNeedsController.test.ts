import {
  AlcoholMisuseDetails,
  Attitude,
  DrugDetails,
  EmotionalWellbeing,
  Health,
  LearningNeeds,
  LifestyleAndAssociates,
  OffenceAnalysis,
  ReferralDetails,
  Relationships,
  RoshAnalysis,
  ThinkingAndBehaviour,
} from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import alcoholMisuseFactory from '../testutils/factories/risksAndNeeds/alcoholMisuseFactory'
import learningNeedsFactory from '../testutils/factories/risksAndNeeds/learningNeedsFactory'
import roshAnalysisFactory from '../testutils/factories/risksAndNeeds/roshAnalysisFactory'
import healthFactory from '../testutils/factories/risksAndNeeds/healthFactory'
import drugDetailsFactory from '../testutils/factories/risksAndNeeds/drugDetailsFactory'
import relationshipsFactory from '../testutils/factories/risksAndNeeds/relationshipsFactory'
import lifestyleAndAssociatesFactory from '../testutils/factories/risksAndNeeds/lifestyleAndAssociatesFactory'
import offenceAnalysisFactory from '../testutils/factories/risksAndNeeds/offenceAnalysisFactory'
import emotionalWellbeingFactory from '../testutils/factories/risksAndNeeds/emotionalWellbeingFactory'
import thinkingAndBehaviourFactory from '../testutils/factories/risksAndNeeds/thinkingAndBehaviourFactory'
import attitudesFactory from '../testutils/factories/risksAndNeeds/attitudesFactory'

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

describe('Lifestyle and associates section of risks and needs', () => {
  describe('GET /referral/:id/lifestyle-and-associates', () => {
    it('loads the risks and needs page with lifestyle and associates sub-nav and displays all related data', async () => {
      const lifestyleAndAssociates: LifestyleAndAssociates = lifestyleAndAssociatesFactory.build()
      accreditedProgrammesManageAndDeliverService.getLifestyleAndAssociates.mockResolvedValue(lifestyleAndAssociates)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/lifestyle-and-associates`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain(lifestyleAndAssociates.regActivitiesEncourageOffending)
          expect(res.text).toContain(lifestyleAndAssociates.lifestyleIssuesDetails)
        })
    })

    it('handles health info with minimal data', async () => {
      const lifestyleAndAssociates: LifestyleAndAssociates = lifestyleAndAssociatesFactory.build({
        regActivitiesEncourageOffending: undefined,
        lifestyleIssuesDetails: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getLifestyleAndAssociates.mockResolvedValue(lifestyleAndAssociates)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/lifestyle-and-associates`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const referralId = randomUUID()

      const lifestyleAndAssociates: LifestyleAndAssociates = lifestyleAndAssociatesFactory.build()
      accreditedProgrammesManageAndDeliverService.getLifestyleAndAssociates.mockResolvedValue(lifestyleAndAssociates)

      await request(app).get(`/referral/${referralId}/lifestyle-and-associates`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getLifestyleAndAssociates).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getLifestyleAndAssociates.mockRejectedValue(
        new Error('Service unavailable'),
      )

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/lifestyle-and-associates`).expect(500)
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

describe('Alcohol Misuse', () => {
  describe('GET /referral/:id/alcohol-misuse', () => {
    it('loads the risks and needs page with alcohol misuse sub-nav and displays all alcohol misuse data', async () => {
      const alcoholMisuseDetails: AlcoholMisuseDetails = alcoholMisuseFactory.build()
      accreditedProgrammesManageAndDeliverService.getAlcoholMisuseDetails.mockResolvedValue(alcoholMisuseDetails)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/alcohol-misuse`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain(alcoholMisuseDetails.currentUse)
          expect(res.text).toContain(alcoholMisuseDetails.bingeDrinking)
          expect(res.text).toContain(alcoholMisuseDetails.frequencyAndLevel)
          expect(res.text).toContain(alcoholMisuseDetails.alcoholIssuesDetails)
        })
    })

    it('handles alcohol misuse with minimal data', async () => {
      const alcoholMisuseDetails: AlcoholMisuseDetails = alcoholMisuseFactory.build({
        currentUse: undefined,
        bingeDrinking: undefined,
        frequencyAndLevel: undefined,
        alcoholIssuesDetails: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getAlcoholMisuseDetails.mockResolvedValue(alcoholMisuseDetails)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/alcohol-misuse`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const alcoholMisuseDetails: AlcoholMisuseDetails = alcoholMisuseFactory.build()
      accreditedProgrammesManageAndDeliverService.getAlcoholMisuseDetails.mockResolvedValue(alcoholMisuseDetails)

      const referralId = randomUUID()
      await request(app).get(`/referral/${referralId}/alcohol-misuse`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getAlcoholMisuseDetails).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getAlcoholMisuseDetails.mockRejectedValue(
        new Error('Service unavailable'),
      )

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/alcohol-misuse`).expect(500)
    })
  })
})

describe('Drug misuse section of risks and needs', () => {
  describe('GET /referral/:id/drug-misuse', () => {
    it('loads the risks and needs page with drug misuse sub-nav and displays all drug misuse related data', async () => {
      const drugDetails: DrugDetails = drugDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getDrugDetails.mockResolvedValue(drugDetails)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/drug-misuse`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain('1 - Some problems')
          expect(res.text).toContain(drugDetails.drugsMajorActivity)
        })
    })

    it('handles drug misuse info with minimal data', async () => {
      const drugDetails: DrugDetails = drugDetailsFactory.build({
        assessmentCompleted: undefined,
        levelOfUseOfMainDrug: undefined,
        drugsMajorActivity: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getDrugDetails.mockResolvedValue(drugDetails)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/drug-misuse`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const referralId = randomUUID()

      const drugDetails: DrugDetails = drugDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getDrugDetails.mockResolvedValue(drugDetails)

      await request(app).get(`/referral/${referralId}/drug-misuse`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getDrugDetails).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getDrugDetails.mockRejectedValue(new Error('Service unavailable'))

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/drug-misuse`).expect(500)
    })
  })
})

describe('Offence Analysis', () => {
  describe('GET /referral/:id/offence-analysis', () => {
    it('loads the risks and needs page with offence analysis sub-nav and displays all offence analysis data', async () => {
      const offenceAnalysis: OffenceAnalysis = offenceAnalysisFactory.build()
      accreditedProgrammesManageAndDeliverService.getOffenceAnalysis.mockResolvedValue(offenceAnalysis)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/offence-analysis`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain(offenceAnalysis.briefOffenceDetails)
          expect(res.text).toContain(offenceAnalysis.motivationAndTriggers)
          expect(res.text).toContain(offenceAnalysis.patternOfOffending)
          expect(res.text).toContain(offenceAnalysis.recognisesImpact)
        })
    })

    it('handles offence analysis with minimal data', async () => {
      const offenceAnalysis: OffenceAnalysis = offenceAnalysisFactory.build({
        briefOffenceDetails: undefined,
        motivationAndTriggers: undefined,
        patternOfOffending: undefined,
        recognisesImpact: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getOffenceAnalysis.mockResolvedValue(offenceAnalysis)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/offence-analysis`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const offenceAnalysis: OffenceAnalysis = offenceAnalysisFactory.build()
      accreditedProgrammesManageAndDeliverService.getOffenceAnalysis.mockResolvedValue(offenceAnalysis)

      const referralId = randomUUID()
      await request(app).get(`/referral/${referralId}/offence-analysis`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getOffenceAnalysis).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getOffenceAnalysis.mockRejectedValue(new Error('Service unavailable'))

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/offence-analysis`).expect(500)
    })
  })
})

describe('Emotional wellbeing section of risks and needs', () => {
  describe('GET /referral/:id/emotional-wellbeing', () => {
    it('loads the risks and needs page with emotional wellbeing sub-nav and displays all emotional wellbeing related data', async () => {
      const emotionalWellbeing: EmotionalWellbeing = emotionalWellbeingFactory.build()
      accreditedProgrammesManageAndDeliverService.getEmotionalWellbeing.mockResolvedValue(emotionalWellbeing)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/emotional-wellbeing`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain('1 - Some problems')
          expect(res.text).toContain('0 - No problems')
        })
    })

    it('handles emotional-wellbeing info with minimal data', async () => {
      const emotionalWellbeing: EmotionalWellbeing = emotionalWellbeingFactory.build({
        assessmentCompleted: undefined,
        currentPsychologicalProblems: undefined,
        selfHarmSuicidal: undefined,
        currentPsychiatricProblems: undefined,
      })
      accreditedProgrammesManageAndDeliverService.getEmotionalWellbeing.mockResolvedValue(emotionalWellbeing)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/emotional-wellbeing`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const referralId = randomUUID()

      const emotionalWellbeing: EmotionalWellbeing = emotionalWellbeingFactory.build()
      accreditedProgrammesManageAndDeliverService.getEmotionalWellbeing.mockResolvedValue(emotionalWellbeing)

      await request(app).get(`/referral/${referralId}/emotional-wellbeing`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getEmotionalWellbeing).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getEmotionalWellbeing.mockRejectedValue(
        new Error('Service unavailable'),
      )

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/emotional-wellbeing`).expect(500)
    })
  })
})

describe('Thinking and behaviour section of risks and needs', () => {
  describe('GET /referral/:id/thinking-and-behaving', () => {
    it('loads the risks and needs page with thinking and behaving sub-nav and displays all thinking and behaving related data', async () => {
      const thinkingAndBehaviour: ThinkingAndBehaviour = thinkingAndBehaviourFactory.build()
      accreditedProgrammesManageAndDeliverService.getThinkingAndBehaviour.mockResolvedValue(thinkingAndBehaviour)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/thinking-and-behaving`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain('2 - Serious problems')
          expect(res.text).toContain('1 - Some problems')
          expect(res.text).toContain('0 - No problems')
        })
    })

    it('handles thinking and behaviour  info with minimal data', async () => {
      const thinkingAndBehaviour: ThinkingAndBehaviour = thinkingAndBehaviourFactory.build({
        assessmentCompleted: undefined,
        temperControl: undefined,
        problemSolvingSkills: undefined,
        awarenessOfConsequences: undefined,
        understandsViewsOfOthers: undefined,
        achieveGoals: undefined,
        concreteAbstractThinking: undefined,
      })

      accreditedProgrammesManageAndDeliverService.getThinkingAndBehaviour.mockResolvedValue(thinkingAndBehaviour)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/thinking-and-behaving`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const referralId = randomUUID()

      const thinkingAndBehaviour: ThinkingAndBehaviour = thinkingAndBehaviourFactory.build()
      accreditedProgrammesManageAndDeliverService.getThinkingAndBehaviour.mockResolvedValue(thinkingAndBehaviour)

      await request(app).get(`/referral/${referralId}/thinking-and-behaving`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getThinkingAndBehaviour).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getThinkingAndBehaviour.mockRejectedValue(
        new Error('Service unavailable'),
      )

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/thinking-and-behaving`).expect(500)
    })
  })
})

describe('Attitudes section of risks and needs', () => {
  describe('GET /referral/:id/attitudes', () => {
    it('loads the risks and needs page with attitude sub-nav and displays all attitude related data', async () => {
      const attitudes: Attitude = attitudesFactory.build()
      accreditedProgrammesManageAndDeliverService.getAttitudes.mockResolvedValue(attitudes)

      const referralId = randomUUID()
      return request(app)
        .get(`/referral/${referralId}/attitudes`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Assessment completed 23 August 2025')
          expect(res.text).toContain('1 - Quite motivated')
          expect(res.text).toContain('1 - Some problems')
        })
    })

    it('attitudes info with minimal data', async () => {
      const attitude: Attitude = attitudesFactory.build({
        assessmentCompleted: undefined,
        proCriminalAttitudes: undefined,
        motivationToAddressBehaviour: undefined,
      })

      accreditedProgrammesManageAndDeliverService.getAttitudes.mockResolvedValue(attitude)

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/attitudes`).expect(200)
    })

    it('calls the service with correct parameters', async () => {
      const referralId = randomUUID()

      const attitude: Attitude = attitudesFactory.build()
      accreditedProgrammesManageAndDeliverService.getAttitudes.mockResolvedValue(attitude)

      await request(app).get(`/referral/${referralId}/attitudes`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getAttitudes).toHaveBeenCalledWith(
        'user1',
        referralDetails.crn,
      )
    })

    it('handles service errors gracefully', async () => {
      accreditedProgrammesManageAndDeliverService.getAttitudes.mockRejectedValue(new Error('Service unavailable'))

      const referralId = randomUUID()
      return request(app).get(`/referral/${referralId}/attitudes`).expect(500)
    })
  })
})

import { Factory } from 'fishery'
import { PniScore } from '@manage-and-deliver-api'

class PniScoreFactory extends Factory<PniScore> {}

export default PniScoreFactory.define(() => ({
  domainScores: {
    RelationshipDomainScore: {
      individualRelationshipScores: {
        aggressiveControllingBehaviour: 0,
        curRelCloseFamily: 1,
        easilyInfluenced: 2,
        prevCloseRelationships: 3,
      },
      overallRelationshipDomainLevel:
        'LOW_NEED' as PniScore['domainScores']['RelationshipDomainScore']['overallRelationshipDomainLevel'],
    },
    SelfManagementDomainScore: {
      individualSelfManagementScores: {
        difficultiesCoping: 0,
        impulsivity: 1,
        problemSolvingSkills: 2,
        temperControl: 3,
      },
      overallSelfManagementDomainLevel:
        'MEDIUM_NEED' as PniScore['domainScores']['SelfManagementDomainScore']['overallSelfManagementDomainLevel'],
    },
    SexDomainScore: {
      individualSexScores: {
        emotionalCongruence: 0,
        offenceRelatedSexualInterests: 1,
        sexualPreOccupation: 2,
      },
      overallSexDomainLevel: 'HIGH_NEED' as PniScore['domainScores']['SexDomainScore']['overallSexDomainLevel'],
    },
    ThinkingDomainScore: {
      individualThinkingScores: {
        hostileOrientation: 1,
        proCriminalAttitudes: 2,
      },
      overallThinkingDomainLevel:
        'MEDIUM_NEED' as PniScore['domainScores']['ThinkingDomainScore']['overallThinkingDomainLevel'],
    },
  },
  RiskScore: {
    IndividualRiskScores: {},
    classification: 'MEDIUM_RISK',
  },
  validationErrors: [''],
  overallIntensity: 'HIGH' as PniScore['overallIntensity'],
}))

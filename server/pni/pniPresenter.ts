import { PniScore, ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'

export default class PniPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    readonly pniScore: PniScore,
  ) {
    super(HorizontalNavValues.programmeNeedsIdentifierTab, id, details.currentStatusDescription)
  }

  scoreValueText(value?: number | null): string {
    return value?.toString() || 'Score missing'
  }

  needScoreToString(needScore: string): string {
    const needsMap: Record<string, string> = {
      HIGH_NEED: 'High need',
      MEDIUM_NEED: 'Medium need',
      LOW_NEED: 'Low need',
    }

    return needsMap && needsMap[needScore] ? needsMap[needScore] : 'Cannot calculate – information missing'
  }

  getSexSummary() {
    const sexDomainScores = this.pniScore.domainScores.SexDomainScore
    return {
      card: {
        title: {
          text: 'Sex',
        },
        classes: 'govuk-!-margin-top-8',
      },
      rows: [
        {
          key: {
            text: '11.11 - Sexual preoccupation',
          },
          value: {
            text: this.scoreValueText(sexDomainScores.individualSexScores.sexualPreOccupation),
          },
        },
        {
          key: {
            text: '11.12 - Offence-related sexual interests',
          },
          value: {
            text: this.scoreValueText(sexDomainScores.individualSexScores.offenceRelatedSexualInterests),
          },
        },
        {
          key: {
            text: '6.12 - Emotional congruence with children or feeling closer to children than adults',
          },
          value: {
            text: this.scoreValueText(sexDomainScores.individualSexScores.emotionalCongruence),
          },
        },
        {
          key: {
            text: 'Sex result',
          },
          value: {
            text: this.needScoreToString(sexDomainScores.overallSexDomainLevel),
          },
        },
      ],
    }
  }

  getThinkingSummary() {
    const thinkingDomainScores = this.pniScore.domainScores.ThinkingDomainScore
    return {
      card: {
        title: {
          text: 'Thinking',
        },
        classes: 'govuk-!-margin-top-8',
      },
      rows: [
        {
          key: {
            text: '12.1 - Pro-criminal attitudes',
          },
          value: {
            text: this.scoreValueText(thinkingDomainScores.individualThinkingScores.proCriminalAttitudes),
          },
        },
        {
          key: {
            text: '12.9 - Hostile orientation',
          },
          value: {
            text: this.scoreValueText(thinkingDomainScores.individualThinkingScores.hostileOrientation),
          },
        },
        {
          key: {
            text: 'Thinking result',
          },
          value: {
            text: this.needScoreToString(thinkingDomainScores.overallThinkingDomainLevel),
          },
        },
      ],
    }
  }

  getRelationshipsSummary() {
    const relationshipsDomainScores = this.pniScore.domainScores.RelationshipDomainScore
    return {
      card: {
        title: {
          text: 'Relationships',
        },
        classes: 'govuk-!-margin-top-8',
      },
      rows: [
        {
          key: {
            text: '6.1 - Current relationship with close family',
          },
          value: {
            text: this.scoreValueText(relationshipsDomainScores.individualRelationshipScores.curRelCloseFamily),
          },
        },
        {
          key: {
            text: '6.6 - Previous experience of close relationships',
          },
          value: {
            text: this.scoreValueText(relationshipsDomainScores.individualRelationshipScores.prevCloseRelationships),
          },
        },
        {
          key: {
            text: '7.3 - Easily influenced by criminal associates',
          },
          value: {
            text: this.scoreValueText(relationshipsDomainScores.individualRelationshipScores.easilyInfluenced),
          },
        },
        {
          key: {
            text: '11.3 - Aggressive or controlling behaviour',
          },
          value: {
            text: this.scoreValueText(
              relationshipsDomainScores.individualRelationshipScores.aggressiveControllingBehaviour,
            ),
          },
        },
        {
          key: {
            text: 'Relationships result',
          },
          value: {
            text: this.needScoreToString(relationshipsDomainScores.overallRelationshipDomainLevel),
          },
        },
      ],
    }
  }

  getSelfManagementSummary() {
    const selfManagementDomainScores = this.pniScore.domainScores.SelfManagementDomainScore
    return {
      card: {
        title: {
          text: 'Self-management',
        },
        classes: 'govuk-!-margin-top-8',
      },
      rows: [
        {
          key: {
            text: '11.2 - Impulsivity',
          },
          value: {
            text: this.scoreValueText(selfManagementDomainScores.individualSelfManagementScores.impulsivity),
          },
        },
        {
          key: {
            text: '11.4 - Temper control',
          },
          value: {
            text: this.scoreValueText(selfManagementDomainScores.individualSelfManagementScores.temperControl),
          },
        },
        {
          key: {
            text: '11.6 - Problem-solving skills',
          },
          value: {
            text: this.scoreValueText(selfManagementDomainScores.individualSelfManagementScores.problemSolvingSkills),
          },
        },
        {
          key: {
            text: '10.1 - Difficulties coping',
          },
          value: {
            text: this.scoreValueText(selfManagementDomainScores.individualSelfManagementScores.difficultiesCoping),
          },
        },
        {
          key: {
            text: 'Self-management result',
          },
          value: {
            text: this.needScoreToString(selfManagementDomainScores.overallSelfManagementDomainLevel),
          },
        },
      ],
    }
  }

  getPathwayDetails() {
    const bodyTextPrefix = `Based on the risk and need scores, ${this.details.personName} may`
    const programmePathway = this.pniScore.overallIntensity
    switch (programmePathway) {
      case 'HIGH':
        return {
          bodyText: `${bodyTextPrefix} be eligible for the high intensity Accredited Programmes pathway.`,
          class: 'rosh-widget rosh-widget--high govuk-!-margin-bottom-6',
          headingText: 'HIGH INTENSITY',
        }
      case 'MODERATE':
        return {
          bodyText: `${bodyTextPrefix} be eligible for the moderate intensity Accredited Programmes pathway.`,
          class: 'rosh-widget rosh-widget--medium govuk-!-margin-bottom-6',
          headingText: 'MODERATE INTENSITY',
        }
      case 'ALTERNATIVE_PATHWAY':
        return {
          bodyText: `${bodyTextPrefix} not be eligible for either the moderate or high intensity Accredited Programmes pathway. Speak to the Offender Management team about other options.`,
          class: 'rosh-widget rosh-widget--alternative govuk-!-margin-bottom-6',
          headingText: 'NOT ELIGIBLE',
        }
      case 'MISSING_INFORMATION':
        return {
          bodyText:
            'There is not enough information in the risk and need assessment to calculate the recommended programme pathway.',
          class: 'rosh-widget rosh-widget--missing govuk-!-margin-bottom-6',
          headingText: 'INFORMATION MISSING',
        }
      default:
        return {
          bodyText: 'The service cannot calculate the recommended pathway at the moment. Try again later.',
          class: 'rosh-widget rosh-widget--error govuk-!-margin-bottom-6',
          headingText: 'Error',
        }
    }
  }
}

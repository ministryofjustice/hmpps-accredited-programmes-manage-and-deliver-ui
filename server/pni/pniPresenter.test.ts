import { PniScore, ReferralDetails } from '@manage-and-deliver-api'
import PniPresenter from './pniPresenter'

describe('PniPresenter', () => {
  const pniScore: PniScore = {
    domainScores: {
      RelationshipDomainScore: {
        individualRelationshipScores: {
          aggressiveControllingBehaviour: 0,
          curRelCloseFamily: 1,
          easilyInfluenced: 2,
          prevCloseRelationships: 3,
        },
        overallRelationshipDomainLevel: 'LOW_NEED',
      },
      SelfManagementDomainScore: {
        individualSelfManagementScores: {
          difficultiesCoping: 0,
          impulsivity: 1,
          problemSolvingSkills: 2,
          temperControl: 3,
        },
        overallSelfManagementDomainLevel: 'MEDIUM_NEED',
      },
      SexDomainScore: {
        individualSexScores: {
          emotionalCongruence: 0,
          offenceRelatedSexualInterests: 1,
          sexualPreOccupation: 2,
        },
        overallSexDomainLevel: 'HIGH_NEED',
      },
      ThinkingDomainScore: {
        individualThinkingScores: {
          hostileOrientation: 1,
          proCriminalAttitudes: 2,
        },
        overallThinkingDomainLevel: 'MEDIUM_NEED',
      },
    },
    RiskScore: {
      IndividualRiskScores: {},
      classification: 'MEDIUM_RISK',
    },
    validationErrors: [],
    overallIntensity: 'HIGH',
  }

  const referralDetails: ReferralDetails = {
    id: '1234',
    crn: '1234',
    personName: 'Steve Sticks',
    interventionName: 'An Intervention',
    createdAt: '2025-01-01',
    dateOfBirth: '1990-02-02',
    probationPractitionerName: 'Dave Davies',
    probationPractitionerEmail: 'dave.davies@moj.com',
    cohort: 'GENERAL_OFFENCE',
  }

  describe('needScoreToString', () => {
    const presenter = new PniPresenter('12345', referralDetails, pniScore)
    it('returns the string representation of the given score', () => {
      expect(presenter.needScoreToString('LOW_NEED')).toBe('Low need')
      expect(presenter.needScoreToString('MEDIUM_NEED')).toBe('Medium need')
      expect(presenter.needScoreToString('HIGH_NEED')).toBe('High need')
      expect(presenter.needScoreToString(null)).toBe('Cannot calculate – information missing')
    })
  })

  describe('pathwayContent', () => {
    it('returns the pathway content for the given person name and HIGH_INTENSITY_BC programme pathway', () => {
      pniScore.overallIntensity = 'HIGH'
      const presenter = new PniPresenter('12345', referralDetails, pniScore)

      const pathwayContent = presenter.getPathwayDetails()

      expect(pathwayContent).toEqual({
        bodyText:
          'Based on the risk and need scores, Steve Sticks may be eligible for the high intensity Accredited Programmes pathway.',
        class: 'rosh-widget rosh-widget--high govuk-!-margin-bottom-6',
        headingText: 'HIGH INTENSITY',
      })
    })

    it('returns the pathway content for the given person name and MODERATE_INTENSITY_BC programme pathway', () => {
      pniScore.overallIntensity = 'MODERATE'
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const pathwayContent = presenter.getPathwayDetails()

      expect(pathwayContent).toEqual({
        bodyText:
          'Based on the risk and need scores, Steve Sticks may be eligible for the moderate intensity Accredited Programmes pathway.',
        class: 'rosh-widget rosh-widget--medium govuk-!-margin-bottom-6',
        headingText: 'MODERATE INTENSITY',
      })
    })

    it('returns the pathway content for the given person name and ALTERNATIVE_PATHWAY programme pathway', () => {
      pniScore.overallIntensity = 'ALTERNATIVE_PATHWAY'
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const pathwayContent = presenter.getPathwayDetails()

      expect(pathwayContent).toEqual({
        bodyText:
          'Based on the risk and need scores, Steve Sticks may not be eligible for either the moderate or high intensity Accredited Programmes pathway. Speak to the Offender Management team about other options.',
        class: 'rosh-widget rosh-widget--alternative govuk-!-margin-bottom-6',
        headingText: 'NOT ELIGIBLE',
      })
    })

    it('returns the pathway content for the given person name and MISSING_INFORMATION programme pathway', () => {
      pniScore.overallIntensity = 'MISSING_INFORMATION'
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const pathwayContent = presenter.getPathwayDetails()

      expect(pathwayContent).toEqual({
        bodyText:
          'There is not enough information in the risk and need assessment to calculate the recommended programme pathway.',
        class: 'rosh-widget rosh-widget--missing govuk-!-margin-bottom-6',
        headingText: 'INFORMATION MISSING',
      })
    })

    it('returns the error pathway content when the pathway is undefined', () => {
      pniScore.overallIntensity = null
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const pathwayContent = presenter.getPathwayDetails()

      expect(pathwayContent).toEqual({
        bodyText: 'The service cannot calculate the recommended pathway at the moment. Try again later.',
        class: 'rosh-widget rosh-widget--error govuk-!-margin-bottom-6',
        headingText: 'Error',
      })
    })
  })

  describe('relationshipsSummaryListRows', () => {
    it('returns the summary list rows for the relationship domain score', () => {
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const rows = presenter.getRelationshipsSummary()

      expect(rows).toEqual({
        card: { classes: 'govuk-!-margin-top-8', title: { text: 'Relationships' } },
        rows: [
          {
            key: {
              text: '6.1 - Current relationship with close family',
            },
            value: {
              text: '1',
            },
          },
          {
            key: {
              text: '6.6 - Previous experience of close relationships',
            },
            value: {
              text: '3',
            },
          },
          {
            key: {
              text: '7.3 - Easily influenced by criminal associates',
            },
            value: {
              text: '2',
            },
          },
          {
            key: {
              text: '11.3 - Aggressive or controlling behaviour',
            },
            value: {
              text: '0',
            },
          },
          {
            key: {
              text: 'Relationships result',
            },
            value: {
              text: 'Low need',
            },
          },
        ],
      })
    })
  })

  describe('scoreValueText', () => {
    const presenter = new PniPresenter('12345', referralDetails, pniScore)
    it('returns the string representation of the given score', () => {
      expect(presenter.scoreValueText(0)).toBe('0')
      expect(presenter.scoreValueText(null)).toBe('Score missing')
      expect(presenter.scoreValueText(undefined)).toBe('Score missing')
    })
  })

  describe('selfManagementSummaryListRows', () => {
    it('returns the summary list rows for the self-management domain score', () => {
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const rows = presenter.getSelfManagementSummary()

      expect(rows).toEqual({
        card: { classes: 'govuk-!-margin-top-8', title: { text: 'Self-management' } },
        rows: [
          {
            key: {
              text: '11.2 - Impulsivity',
            },
            value: {
              text: '1',
            },
          },
          {
            key: {
              text: '11.4 - Temper control',
            },
            value: {
              text: '3',
            },
          },
          {
            key: {
              text: '11.6 - Problem-solving skills',
            },
            value: {
              text: '2',
            },
          },
          {
            key: {
              text: '10.1 - Difficulties coping',
            },
            value: {
              text: '0',
            },
          },
          {
            key: {
              text: 'Self-management result',
            },
            value: {
              text: 'Medium need',
            },
          },
        ],
      })
    })
  })

  describe('sexSummaryListRows', () => {
    it('returns the summary list rows for the sex domain score', () => {
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const rows = presenter.getSexSummary()

      expect(rows).toEqual({
        card: { classes: 'govuk-!-margin-top-8', title: { text: 'Sex' } },
        rows: [
          {
            key: {
              text: '11.11 - Sexual Pre-occupation',
            },
            value: {
              text: '2',
            },
          },
          {
            key: {
              text: '11.12 - Offence related Sexual Interests',
            },
            value: {
              text: '1',
            },
          },
          {
            key: {
              text: '6.12 Emotional congruence with children or feeling closer to children than adults',
            },
            value: {
              text: '0',
            },
          },
          {
            key: {
              text: 'Sex result',
            },
            value: {
              text: 'High need',
            },
          },
        ],
      })
    })
  })

  describe('thinkingSummaryListRows', () => {
    it('returns the summary list rows for the thinking domain score', () => {
      const presenter = new PniPresenter('12345', referralDetails, pniScore)
      const rows = presenter.getThinkingSummary()

      expect(rows).toEqual({
        card: { classes: 'govuk-!-margin-top-8', title: { text: 'Thinking' } },
        rows: [
          {
            key: {
              text: '12.1 Pro-criminal attitudes',
            },
            value: {
              text: '2',
            },
          },
          {
            key: {
              text: '12.9 Hostile orientation',
            },
            value: {
              text: '1',
            },
          },
          {
            key: {
              text: 'Thinking result',
            },
            value: {
              text: 'Medium need',
            },
          },
        ],
      })
    })
  })
})

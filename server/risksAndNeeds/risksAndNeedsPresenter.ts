import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'

export enum RisksAndNeedsPageSection {
  RisksAndAlertsTab = 'risksAndAlerts',
  LearningNeedsTab = 'learningNeeds',
  Section2OffenceAnalysisTab = 'offenceAnalysis',
  Section4EducationTrainingAndEmploymentTab = 'educationTrainingAndEmployment',
  Section6RelationshipsTab = 'relationships',
  Section7LifestyleAndAssociatesTab = 'lifestyleAndAssociates',
  Section8DrugMisuseTab = 'drugMisuse',
  Section9AlcoholMisuseTab = 'alcoholMisuse',
  Section10EmotionalWellbeingTab = 'emotionalWellbeing',
  Section11ThinkingAndBehaviourTab = 'thinkingAndBehaviour',
  Section12AttitudesTab = 'attitudes',
  Section13HealthTab = 'health',
  SectionR6ROSHAnalysisTab = 'roshAnalysis',
}

export default class RisksAndNeedsPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
  ) {
    super(HorizontalNavValues.risksAndNeedsTab, referralId)
  }

  readonly pageDescription =
    'Relevant sections from OASys to support the referral. The full Layer 3 assessment is available in OASys. Information is accurate at the time of the referral being submitted.'

  getSubHeaderArgs(): {
    heading: { text: string; classes: string }
    items: { text: string; classes: string; href?: string }[]
  } {
    return {
      heading: {
        text: 'Referral to Building Choices: moderate intensity',
        classes: 'govuk-heading-l',
      },
      items: [
        {
          text: 'Back to referrals',
          classes: 'govuk-button--secondary',
          href: '/pdu/open-referrals',
        },
      ],
    }
  }

  getVerticalSubNavArgs(): {
    items: { text: string; href: string; active: boolean; attributes: object | null }[]
    classes: string
  } {
    return {
      items: [
        {
          text: 'Risks and alerts',
          href: `/referral/${this.referralId}/risks-and-alerts/#risks-and-alerts`,
          active: this.subNavValue === RisksAndNeedsPageSection.RisksAndAlertsTab,
          attributes: {
            id: 'risks-and-alerts',
          },
        },
        {
          text: 'Learning needs',
          href: `/referral/${this.referralId}/learning-needs/#learning-needs`,
          active: this.subNavValue === RisksAndNeedsPageSection.LearningNeedsTab,
          attributes: {
            id: 'learning-needs',
          },
        },
        {
          text: 'Section 2 - Offence analysis',
          href: `/referral/${this.referralId}/offence-analysis/#offence-analysis`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section2OffenceAnalysisTab,
          attributes: {
            id: 'section-2-offence-analysis',
          },
        },
        {
          text: 'Section 4 - Education, training and employment',
          href: `/referral/${this.referralId}/education-training-and-employment/#education-training-and-employment`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section4EducationTrainingAndEmploymentTab,
          attributes: {
            id: 'section-4-education-training-and-employment',
          },
        },
        {
          text: 'Section 6 - Relationships',
          href: `/referral/${this.referralId}/relationships/#relationships`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section6RelationshipsTab,
          attributes: {
            id: 'section-6-relationships',
          },
        },
        {
          text: 'Section 7 - Lifestyle and associates',
          href: `/referral/${this.referralId}/lifestyle-and-associates/#lifestyle-and-associates`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section7LifestyleAndAssociatesTab,
          attributes: {
            id: 'section-7-lifestyle-and-associates',
          },
        },
        {
          text: 'Section 8 - Drug misuse',
          href: `/referral/${this.referralId}/drug-misuse/#drug-misuse`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section8DrugMisuseTab,
          attributes: {
            id: 'section-8-drug-misuse',
          },
        },
        {
          text: 'Section 9 - Alcohol misuse',
          href: `/referral/${this.referralId}/alcohol-misuse/#alcohol-misuse`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section9AlcoholMisuseTab,
          attributes: {
            id: 'section-9-alcohol-misuse',
          },
        },
        {
          text: 'Section 10 - Emotional wellbeing',
          href: `/referral/${this.referralId}/emotional-wellbeing/#emotional-wellbeing`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section10EmotionalWellbeingTab,
          attributes: {
            id: 'section-10-emotional-wellbeing',
          },
        },
        {
          text: 'Section 11 - Thinking and behaving',
          href: `/referral/${this.referralId}/thinking-and-behaving/#thinking-and-behaving`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section11ThinkingAndBehaviourTab,
          attributes: {
            id: 'section-11-thinking-and-behaving',
          },
        },
        {
          text: 'Section 12 - Attitudes',
          href: `/referral/${this.referralId}/attitudes/#attitudes`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section12AttitudesTab,
          attributes: {
            id: 'section-12-attitudes',
          },
        },
        {
          text: 'Section 13 - Health',
          href: `/referral/${this.referralId}/health/#health`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section13HealthTab,
          attributes: {
            id: 'section-13-health',
          },
        },
        {
          text: 'Section R6 - ROSH analysis',
          href: `/referral/${this.referralId}/rosh-analysis/#rosh-analysis`,
          active: this.subNavValue === RisksAndNeedsPageSection.SectionR6ROSHAnalysisTab,
          attributes: {
            id: 'section-r6-rosh-analysis',
          },
        },
      ],
      classes: 'govuk-!-padding-top-0',
    }
  }
}

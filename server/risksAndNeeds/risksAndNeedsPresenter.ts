import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'

export enum RisksAndNeedsPageSection {
  RisksAndAlertsTab = 'risksAndAlerts',
  LearningNeedsTab = 'learningNeeds',
  Section2OffenceAnalysisTab = 'offenceAnalysis',
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
    readonly referral: ReferralDetails,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(HorizontalNavValues.risksAndNeedsTab, referral, isLdcUpdated, isCohortUpdated)
  }

  readonly pageDescription =
    'Relevant information to support the referral, taken from the latest approved assessment in OASys. The full risk and need assessment is available in OASys.'

  get pageTitle(): string {
    switch (this.subNavValue) {
      case RisksAndNeedsPageSection.LearningNeedsTab:
        return 'Learning needs - Risks and needs'
      case RisksAndNeedsPageSection.Section2OffenceAnalysisTab:
        return 'Section 2 - Offence analysis - Risks and needs'
      case RisksAndNeedsPageSection.Section6RelationshipsTab:
        return 'Section 6 - Relationships - Risks and needs'
      case RisksAndNeedsPageSection.Section7LifestyleAndAssociatesTab:
        return 'Section 7 - Lifestyle and associates - Risks and needs'
      case RisksAndNeedsPageSection.Section8DrugMisuseTab:
        return 'Section 8 - Drug misuse - Risks and needs'
      case RisksAndNeedsPageSection.Section9AlcoholMisuseTab:
        return 'Section 9 - Alcohol misuse - Risks and needs'
      case RisksAndNeedsPageSection.Section10EmotionalWellbeingTab:
        return 'Section 10 - Emotional wellbeing - Risks and needs'
      case RisksAndNeedsPageSection.Section11ThinkingAndBehaviourTab:
        return 'Section 11 - Thinking and behaving - Risks and needs'
      case RisksAndNeedsPageSection.Section12AttitudesTab:
        return 'Section 12 - Attitudes - Risks and needs'
      case RisksAndNeedsPageSection.Section13HealthTab:
        return 'Section 13 - Health - Risks and needs'
      case RisksAndNeedsPageSection.SectionR6ROSHAnalysisTab:
        return 'Section R6 - ROSH analysis - Risks and needs'
      default:
        return 'Risks and alerts - Risks and needs'
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
          href: `/referral/${this.referral.id}/risks-and-needs/risks-and-alerts`,
          active: this.subNavValue === RisksAndNeedsPageSection.RisksAndAlertsTab,
          attributes: {
            id: 'risks-and-alerts',
          },
        },
        {
          text: 'Learning needs',
          href: `/referral/${this.referral.id}/risks-and-needs/learning-needs`,
          active: this.subNavValue === RisksAndNeedsPageSection.LearningNeedsTab,
          attributes: {
            id: 'learning-needs',
          },
        },
        {
          text: 'Section 2 - Offence analysis',
          href: `/referral/${this.referral.id}/risks-and-needs/section-2-offence-analysis`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section2OffenceAnalysisTab,
          attributes: {
            id: 'section-2-offence-analysis',
          },
        },
        {
          text: 'Section 6 - Relationships',
          href: `/referral/${this.referral.id}/risks-and-needs/section-6-relationships`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section6RelationshipsTab,
          attributes: {
            id: 'section-6-relationships',
          },
        },
        {
          text: 'Section 7 - Lifestyle and associates',
          href: `/referral/${this.referral.id}/risks-and-needs/section-7-lifestyle-and-associates`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section7LifestyleAndAssociatesTab,
          attributes: {
            id: 'section-7-lifestyle-and-associates',
          },
        },
        {
          text: 'Section 8 - Drug misuse',
          href: `/referral/${this.referral.id}/risks-and-needs/section-8-drug-misuse`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section8DrugMisuseTab,
          attributes: {
            id: 'section-8-drug-misuse',
          },
        },
        {
          text: 'Section 9 - Alcohol misuse',
          href: `/referral/${this.referral.id}/risks-and-needs/section-9-alcohol-misuse`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section9AlcoholMisuseTab,
          attributes: {
            id: 'section-9-alcohol-misuse',
          },
        },
        {
          text: 'Section 10 - Emotional wellbeing',
          href: `/referral/${this.referral.id}/risks-and-needs/section-10-emotional-wellbeing`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section10EmotionalWellbeingTab,
          attributes: {
            id: 'section-10-emotional-wellbeing',
          },
        },
        {
          text: 'Section 11 - Thinking and behaving',
          href: `/referral/${this.referral.id}/risks-and-needs/section-11-thinking-and-behaving`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section11ThinkingAndBehaviourTab,
          attributes: {
            id: 'section-11-thinking-and-behaving',
          },
        },
        {
          text: 'Section 12 - Attitudes',
          href: `/referral/${this.referral.id}/risks-and-needs/section-12-attitudes`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section12AttitudesTab,
          attributes: {
            id: 'section-12-attitudes',
          },
        },
        {
          text: 'Section 13 - Health',
          href: `/referral/${this.referral.id}/risks-and-needs/section-13-health`,
          active: this.subNavValue === RisksAndNeedsPageSection.Section13HealthTab,
          attributes: {
            id: 'section-13-health',
          },
        },
        {
          text: 'Section R6 - ROSH analysis',
          href: `/referral/${this.referral.id}/risks-and-needs/section-r6-rosh-analysis`,
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

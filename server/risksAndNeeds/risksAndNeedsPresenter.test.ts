import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import RisksAndNeedsPresenter, { RisksAndNeedsPageSection } from './risksAndNeedsPresenter'

describe('RisksAndNeedsPresenter', () => {
  describe('pageTitle', () => {
    it('returns the correct title for Risks and alerts tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.RisksAndAlertsTab, referral)

      expect(presenter.pageTitle).toBe('Risks and alerts - Risks and needs')
    })

    it('returns the correct title for Learning needs tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.LearningNeedsTab, referral)

      expect(presenter.pageTitle).toBe('Learning needs - Risks and needs')
    })

    it('returns the correct title for Section 2 - Offence analysis tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section2OffenceAnalysisTab, referral)

      expect(presenter.pageTitle).toBe('Section 2 - Offence analysis - Risks and needs')
    })

    it('returns the correct title for Section 6 - Relationships tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section6RelationshipsTab, referral)

      expect(presenter.pageTitle).toBe('Section 6 - Relationships - Risks and needs')
    })

    it('returns the correct title for Section 7 - Lifestyle and associates tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section7LifestyleAndAssociatesTab, referral)

      expect(presenter.pageTitle).toBe('Section 7 - Lifestyle and associates - Risks and needs')
    })

    it('returns the correct title for Section 8 - Drug misuse tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section8DrugMisuseTab, referral)

      expect(presenter.pageTitle).toBe('Section 8 - Drug misuse - Risks and needs')
    })

    it('returns the correct title for Section 9 - Alcohol misuse tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section9AlcoholMisuseTab, referral)

      expect(presenter.pageTitle).toBe('Section 9 - Alcohol misuse - Risks and needs')
    })

    it('returns the correct title for Section 10 - Emotional wellbeing tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section10EmotionalWellbeingTab, referral)

      expect(presenter.pageTitle).toBe('Section 10 - Emotional wellbeing - Risks and needs')
    })

    it('returns the correct title for Section 11 - Thinking and behaving tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section11ThinkingAndBehaviourTab, referral)

      expect(presenter.pageTitle).toBe('Section 11 - Thinking and behaving - Risks and needs')
    })

    it('returns the correct title for Section 12 - Attitudes tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section12AttitudesTab, referral)

      expect(presenter.pageTitle).toBe('Section 12 - Attitudes - Risks and needs')
    })

    it('returns the correct title for Section 13 - Health tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.Section13HealthTab, referral)

      expect(presenter.pageTitle).toBe('Section 13 - Health - Risks and needs')
    })

    it('returns the correct title for Section R6 - ROSH analysis tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new RisksAndNeedsPresenter(RisksAndNeedsPageSection.SectionR6ROSHAnalysisTab, referral)

      expect(presenter.pageTitle).toBe('Section R6 - ROSH analysis - Risks and needs')
    })
  })
})

import { SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import OffenceAnalysisPresenter from './offenceAnalysisPresenter'

export default class OffenceAnalysisView {
  constructor(private readonly presenter: OffenceAnalysisPresenter) {}

  get briefOffenceDetailsSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.briefOffenceDetailsSummaryList(),
        '2.1 - Brief Offence details',
        { showBorders: true, showTitle: true, hideKey: true },
      ),
    }
  }

  get victimsAndPartnersSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.victimsAndPartnersSummaryList(),
        '2.3 - Victims and partners',
      ),
    }
  }

  get impactAndConsequencesSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.impactAndConsequencesSummaryList(),
        '2.6 - Impact and consequences',
      ),
    }
  }

  get otherOffendersAndInfluencesSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.otherOffendersAndInfluencesSummaryList(),
        '2.7 - Other offenders and influences',
      ),
    }
  }

  get motivationAndTriggersSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.motivationAndTriggersSummaryList(),
        '2.8 - Motivation and triggers',
        { showBorders: true, showTitle: true, hideKey: true },
      ),
    }
  }

  get responsibilitySummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.responsibilitySummaryList(), '2.11 - Responsibility'),
    }
  }

  get patternOfOffendingSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.patternOfOffendingSummaryList(),
        '2.12 - Pattern of offending',
        { showBorders: true, showTitle: true, hideKey: true },
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        assessmentCompletedText: this.presenter.assessmentCompletedText,
        briefOffenceDetailsSummary: this.briefOffenceDetailsSummaryList,
        victimsAndPartnersSummary: this.victimsAndPartnersSummaryList,
        impactAndConsequencesSummary: this.impactAndConsequencesSummaryList,
        otherOffendersAndInfluences: this.otherOffendersAndInfluencesSummaryList,
        motivationAndTriggersSummary: this.motivationAndTriggersSummaryList,
        responsibilitySummary: this.responsibilitySummaryList,
        patternOfOffendingSummary: this.patternOfOffendingSummaryList,
      },
    ]
  }
}

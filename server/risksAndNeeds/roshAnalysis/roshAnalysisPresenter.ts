import { ReferralDetails, RoshAnalysis } from '@manage-and-deliver-api'
import { InsetTextArgs } from '../../utils/govukFrontendTypes'
import { SummaryListItem } from '../../utils/summaryList'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class RoshAnalysisPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly roshAnalysis: RoshAnalysis,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.roshAnalysis.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  roshAnalsysisSummaryList(): SummaryListItem[] {
    return [
      { key: 'What exactly did they do', lines: [this.roshAnalysis.offenceDetails] },
      { key: 'Where and when did they do it?', lines: [this.roshAnalysis.whereAndWhen] },
      {
        key: 'How did they do it (was there any pre planning, use of weapon, tool etc)',
        lines: [this.roshAnalysis.howDone],
      },
      {
        key: 'Who were the victims (were there concerns about targeting, type, age, race or vulnerability of victim)?',
        lines: [this.roshAnalysis.whoVictims],
      },
      {
        key: 'Was anyone else present / involved?',
        lines: [this.roshAnalysis.anyoneElsePresent],
      },
      {
        key: 'Why did they do it (motivation and triggers)?',
        lines: [this.roshAnalysis.whyDone],
      },
      {
        key: 'Source of information',
        lines: [this.roshAnalysis.sources],
      },
      {
        key: "Identify behaviours / incidents that evidence the individual's ability to cause serious harm and when they happened",
        lines: [this.roshAnalysis.identifyBehavioursIncidents],
      },
      {
        key: 'Provide an analysis of any patterns related to these behaviours / incidents, for example: victims, triggers, locations, impact',
        lines: [this.roshAnalysis.analysisBehaviourIncidents],
      },
    ].filter(item => item.lines.every(line => line !== null))
  }
}

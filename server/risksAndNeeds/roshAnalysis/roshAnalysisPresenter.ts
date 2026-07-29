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
      {
        key: 'Identify behaviours or incidents that evidence the individuals’s ability to cause serious harm, and when they happened',
        lines: this.roshAnalysis.identifyBehavioursIncidents
          ? [this.roshAnalysis.identifyBehavioursIncidents]
          : ['No information available'],
      },
      {
        key: 'Provide an analysis of any patterns related to these behaviours or incidents, for example victims, triggers, locations, impact',
        lines: this.roshAnalysis.analysisBehaviourIncidents
          ? [this.roshAnalysis.analysisBehaviourIncidents]
          : ['No information available'],
      },
    ].filter(item => item.lines.every(line => line !== null))
  }
}

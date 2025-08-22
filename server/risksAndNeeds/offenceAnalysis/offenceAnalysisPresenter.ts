import { OffenceAnalysis } from '@manage-and-deliver-api'
import { InsetTextArgs } from '../../utils/govukFrontendTypes'
import { SummaryListItem } from '../../utils/summaryList'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class OffenceAnalysisPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly offenceAnalysis: OffenceAnalysis,
  ) {
    super(subNavValue, referralId)
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.offenceAnalysis.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  briefOffenceDetailsSummaryList(): SummaryListItem[] {
    return [
      {
        lines: [this.offenceAnalysis.briefOffenceDetails],
      },
    ]
  }

  victimsAndPartnersSummarylist(): SummaryListItem[] {
    return [
      {
        key: 'Were there any direct victim(s) e.g. contact targeting?',
        lines: [this.offenceAnalysis.victimsAndPartners.contactTargeting],
      },
      {
        key: 'Were any of the victim(s) targeted because of racial motivation or hatred of others identifiable group?',
        lines: [this.offenceAnalysis.victimsAndPartners.raciallyMotivated],
      },
      {
        key: 'Response to a specific victim (e.g. revenge, settling grudges)',
        lines: [this.offenceAnalysis.victimsAndPartners.revenge],
      },
      {
        key: 'Physical violence towards partner',
        lines: [this.offenceAnalysis.victimsAndPartners.physicalViolenceTowardsPartner],
      },
      {
        key: 'Repeat victimisation of the same person',
        lines: [this.offenceAnalysis.victimsAndPartners.repeatVictimisation],
      },
      {
        key: 'Stalking',
        lines: [this.offenceAnalysis.victimsAndPartners.stalking],
      },
    ].filter(item => item.lines.every(line => line !== null))
  }
}

import { OffenceAnalysis, ReferralDetails } from '@manage-and-deliver-api'
import { InsetTextArgs } from '../../utils/govukFrontendTypes'
import { SummaryListItem } from '../../utils/summaryList'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class OffenceAnalysisPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly offenceAnalysis: OffenceAnalysis,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
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

  victimsAndPartnersSummaryList(): SummaryListItem[] {
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
        key: 'Were the victim(s) stranger(s) to the offender?',
        lines: [this.offenceAnalysis.victimsAndPartners.victimWasStranger],
      },
      {
        key: 'Stalking',
        lines: [this.offenceAnalysis.victimsAndPartners.stalking],
      },
    ].filter(item => item.lines.every(line => line !== null))
  }

  impactAndConsequencesSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Does the offender recognise the impact and consequences of offending on victim / community / wider society?',
        lines: [this.offenceAnalysis.recognisesImpact],
      },
    ]
  }

  otherOffendersAndInfluencesSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Were there other offenders involved?',
        lines: [this.offenceAnalysis.otherOffendersAndInfluences.wereOtherOffendersInvolved],
      },
      {
        key: 'Number of others involved',
        lines: [this.offenceAnalysis.otherOffendersAndInfluences.numberOfOthersInvolved],
      },
      {
        key: 'Was the offender the leader?',
        lines: [this.offenceAnalysis.otherOffendersAndInfluences.wasTheOffenderLeader],
      },
      {
        key: 'Peer group influences (eg offender easily led, gang member)',
        lines: [this.offenceAnalysis.otherOffendersAndInfluences.peerGroupInfluences],
      },
    ]
  }

  motivationAndTriggersSummaryList(): SummaryListItem[] {
    return [
      {
        lines: [this.offenceAnalysis.motivationAndTriggers],
      },
    ]
  }

  responsibilitySummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Does the offender accept responsibility for the current offence(s)?',
        lines: [this.offenceAnalysis.responsibility.acceptsResponsibility],
      },
      {
        key: 'How much responsibility does s/he acknowledge for the offence(s). Does s/he blame others, minimise the extent of his/her offending?',
        lines: [this.offenceAnalysis.responsibility.acceptsResponsibilityDetail],
      },
    ]
  }

  patternOfOffendingSummaryList(): SummaryListItem[] {
    return [
      {
        lines: [this.offenceAnalysis.patternOfOffending],
      },
    ]
  }
}

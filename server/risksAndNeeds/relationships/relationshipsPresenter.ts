import { Relationships } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'
import PresenterUtils from '../../utils/presenterUtils'

export default class RelationshipsPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly relationships: Relationships,
    readonly referralStatus: string,
  ) {
    super(subNavValue, referralId, referralStatus)
  }

  relationshipsSummaryList(): SummaryListItem[] {
    return [
      {
        key: '6.7 - Evidence of domestic violence / partner abuse',
        lines: [`${PresenterUtils.yesOrNo(this.relationships.dvEvidence)}`],
      },
      {
        key: '6.7.1.1 - Is the victim a current or former partner?',
        lines: [`${PresenterUtils.yesOrNo(this.relationships.victimFormerPartner)}`],
      },
      {
        key: '6.7.1.2 - Is the victim a family member?',
        lines: [`${PresenterUtils.yesOrNo(this.relationships.victimFamilyMember)}`],
      },
      {
        key: '6.7.2.1 - Is the perpetrator a victim of partner or family abuse?',
        lines: [`${PresenterUtils.yesOrNo(this.relationships.victimOfPartnerFamily)}`],
      },
      {
        key: '6.7.2.2 - Are they the perpetrator of partner or family abuse?',
        lines: [`${PresenterUtils.yesOrNo(this.relationships.perpOfPartnerOrFamily)}`],
      },
    ]
  }

  relationshipsIssuesSummaryList(): SummaryListItem[] {
    return [
      {
        key: '',
        lines: [this.relationships.relIssuesDetails],
      },
    ]
  }
}

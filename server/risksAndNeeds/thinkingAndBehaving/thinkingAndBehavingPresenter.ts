import { ThinkingAndBehaviour } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class ThinkingAndBehavingPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly thinkingAndBehaviour?: ThinkingAndBehaviour,
  ) {
    super(subNavValue, referralId)
  }

  thinkingAndBehavingSummaryList(): SummaryListItem[] {
    const { temperControl } = this.thinkingAndBehaviour
    const { problemSolvingSkills } = this.thinkingAndBehaviour
    const { awarenessOfConsequences } = this.thinkingAndBehaviour
    const { understandsViewsOfOthers } = this.thinkingAndBehaviour
    const { achieveGoals } = this.thinkingAndBehaviour
    const { concreteAbstractThinking } = this.thinkingAndBehaviour
    return [
      {
        key: '11.4 - Temper control',
        lines: [`${temperControl ? `${temperControl}` : ''}`],
      },
      {
        key: '11.6 - Problem solving skills',
        lines: [`${problemSolvingSkills ? `${problemSolvingSkills}` : ''}`],
      },
      {
        key: '11.7 - Awareness of consequences',
        lines: [`${awarenessOfConsequences ? `${awarenessOfConsequences}` : ''}`],
      },
      {
        key: '11.8 - Achieves goals (optional)',
        lines: [`${achieveGoals ? `${achieveGoals}` : ''}`],
      },
      {
        key: '11.9 - Understands other people`s views',
        lines: [`${understandsViewsOfOthers ? `${understandsViewsOfOthers}` : ''}`],
      },
      {
        key: '11.10 - Concrete / abstract thinking (optional)',
        lines: [`${concreteAbstractThinking ? `${concreteAbstractThinking}` : ''}`],
      },
    ]
  }
}

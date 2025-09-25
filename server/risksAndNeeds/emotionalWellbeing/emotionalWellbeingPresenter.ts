import { EmotionalWellbeing } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class EmotionalWellbeingPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly referralStatus: string,
    readonly emotionalWellbeing?: EmotionalWellbeing,
  ) {
    super(subNavValue, referralId, referralStatus)
  }

  emotionalWellbeingSummaryList(): SummaryListItem[] {
    const { currentPsychologicalProblems } = this.emotionalWellbeing
    const { selfHarmSuicidal } = this.emotionalWellbeing
    const { currentPsychiatricProblems } = this.emotionalWellbeing
    return [
      {
        key: '10.2 - Current psychological problems or depression',
        lines: [`${currentPsychologicalProblems ? `${currentPsychologicalProblems}` : ''}`],
      },
      {
        key: '10.5 - Self-harm, attempted suicide, suicidal thoughts or feelings',
        lines: [`${selfHarmSuicidal ? `${selfHarmSuicidal}` : ''}`],
      },
      {
        key: '10.6 - Current psychiatric problems',
        lines: [`${currentPsychiatricProblems ? `${currentPsychiatricProblems}` : ''}`],
      },
    ]
  }
}

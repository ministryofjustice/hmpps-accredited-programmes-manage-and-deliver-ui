import { LearningNeeds } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'
import { InsetTextArgs } from '../../utils/govukFrontendTypes'

export default class LearningNeedsPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly learningNeeds: LearningNeeds,
  ) {
    super(subNavValue, referralId)
  }

  // get assessmentCompletedText(): InsetTextArgs {
  //   return {
  //     text: `Assessment completed ${this.learningNeeds.assessmentCompleted}`,
  //     classes: 'govuk-!-margin-top-0',
  //   }
  // }

  learningNeedsSummaryList(): SummaryListItem[] {
    const { problemAreas } = this.learningNeeds

    return [
      {
        key: '3.3 - Currently of no fixed abode or in transient accommodation',
        lines: [`${LearningNeedsPresenter.yesOrNo(this.learningNeeds.noFixedAbodeOrTransient)}`],
      },
      {
        key: '4.4 - Work related skills',
        lines: [`${this.learningNeeds.workRelatedSkills}`],
      },
      {
        key: '4.7 - Has problems with reading, writing or numeracy',
        lines: [`${this.learningNeeds.problemsReadWriteNum}`],
      },
      ...this.getProblemAreasSummaryItems(problemAreas),
      {
        key: '4.8 - Has learning difficulties (optional)',
        lines: [`${this.learningNeeds.learningDifficulties}`],
      },
      {
        key: '4.9 - Educational or formal professional / vocational qualifications (optional)',
        lines: [`${this.learningNeeds.qualifications}`],
      },
    ]
  }

  static yesOrNo(value?: boolean): 'No' | 'Yes' {
    return value ? 'Yes' : 'No'
  }

  learningNeedsScoreSummaryList(): SummaryListItem[] {
    const score = this.learningNeeds.basicSkillsScore
    const scoreDescription = this.learningNeeds.basicSkillsScoreDescription
    const scoreAndDescription = [score, scoreDescription].filter(text => text).join('\n\n')
    return [
      {
        key: 'Calculated score',
        lines: [scoreAndDescription],
      },
    ]
  }

  private getProblemAreasSummaryItems(problemAreas: string[]): SummaryListItem[] {
    if (!problemAreas || !problemAreas.length) {
      return []
    }

    return [
      {
        key: 'Selected problem areas',
        lines: [this.generateProblemAreas(problemAreas)],
      },
    ]
  }

  private generateProblemAreas(problemAreas: string[]): string {
    const listItems = problemAreas.map(area => `${area}`).join('\n')
    return `${listItems}`
  }
}

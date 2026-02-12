import { ReferralDetails, Risks } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { RiskLevel, RiskLevelOrUnknown } from './risksAndAlertsPresenter'

export default class RisksAndAlertsOgrs4Presenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly risks: Risks,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
  }

  levelOrUnknown(level?: string): string {
    return level ? level.toUpperCase().replace(/\s/g, '_') : 'UNKNOWN'
  }

  getLevelClass(scoreLevel: string): string {
    return this.levelClass('risk-box', this.levelOrUnknown(scoreLevel))
  }

  getLevelText(scoreLevel: string, casing: 'proper' | 'upper' = 'upper'): string {
    let text = this.levelOrUnknown(scoreLevel).split('_').join(' ')

    if (casing === 'proper') {
      text = this.properCase(text)
    }

    return text
  }

  private levelClass(baseClass: string, level: string): string {
    return `${baseClass}--${level.split('_').join('-').toLowerCase()}`
  }

  private properCase(word: string): string {
    return word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
  }
}

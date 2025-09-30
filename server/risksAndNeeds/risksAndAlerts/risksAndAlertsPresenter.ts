import { ReferralDetails, Risks } from '@manage-and-deliver-api'
import { GovukFrontendTableCell } from '../../@types/govukFrontend'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export type RiskBox = {
  category: 'OGRS Year 1' | 'OGRS Year 2' | 'OVP Year 1' | 'OVP Year 2' | 'RoSH' | 'RSR' | 'SARA'
  dataTestId: string
  levelClass: string
  levelText: string
  bodyHtml?: string
  figure?: string
  lastUpdated?: string
}

export type OspBox = {
  dataTestId: string
  levelClass: string
  levelText: string
  type: 'OSP/C' | 'OSP/I'
}

export type RiskLevel = 'HIGH' | 'LOW' | 'MEDIUM' | 'VERY_HIGH' | 'Not Applicable'

export type RiskLevelOrUnknown = RiskLevel | 'UNKNOWN'

export type ActiveAlerts = {
  flags: { description: string }[]
  lastUpdated?: string
}

export default class RisksAndAlertsPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly risks: Risks,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
  }

  getLevelClass(scoreLevel: RiskLevel): string {
    return this.levelClass('risk-box', this.levelOrUnknown(scoreLevel))
  }

  getLevelText(scoreLevel: RiskLevel, casing: 'proper' | 'upper' = 'upper'): string {
    let text = this.levelOrUnknown(scoreLevel).split('_').join(' ')

    if (casing === 'proper') {
      text = this.properCase(text)
    }

    return text
  }

  formatFigure(figure?: number): string {
    return figure ? `${figure}%` : undefined
  }

  getBodyHtmlStringWithClass(bodyText: string): string {
    return `<p class="govuk-body-m govuk-!-margin-bottom-0">${bodyText}</p>`
  }

  getLastUpdatedStringWithClass(lastUpdated: string): string {
    return `<p class="risk-box__body-text govuk-!-margin-bottom-0">Last updated: ${lastUpdated}</p>`
  }

  roshTableCellForLevel(level?: RiskLevel): GovukFrontendTableCell {
    const levelOrUnknown = this.levelOrUnknown(level)

    return {
      classes: `rosh-table__cell ${this.levelClass('rosh-table__cell', levelOrUnknown)}`,
      text: this.getLevelText(level, 'proper'),
    }
  }

  private levelClass(baseClass: string, level: RiskLevelOrUnknown): string {
    return `${baseClass}--${level.split('_').join('-').toLowerCase()}`
  }

  private levelOrUnknown(level?: RiskLevel): RiskLevelOrUnknown {
    return level || 'UNKNOWN'
  }

  private properCase(word: string): string {
    return word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
  }
}

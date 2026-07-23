import RisksAndAlertsPresenter, { ActiveAlerts, OspBox, RiskBox, RiskLevel } from './risksAndAlertsPresenter'
import { GovukFrontendTable } from '../../@types/govukFrontend'
import { InsetTextArgs } from '../../utils/govukFrontendTypes'

export default class RisksAndAlertsView {
  constructor(private readonly presenter: RisksAndAlertsPresenter) {}

  get showTopDataUnavailableMessage(): boolean {
    const ogrsUnavailable =
      this.ogrsYear1Box.levelText === 'UNKNOWN' &&
      this.ogrsYear2Box.levelText === 'UNKNOWN' &&
      !this.ogrsYear1Box.figure &&
      !this.ogrsYear2Box.figure

    const ovpUnavailable =
      this.ovpYear1Box.levelText === 'UNKNOWN' &&
      this.ovpYear2Box.levelText === 'UNKNOWN' &&
      !this.ovpYear1Box.figure &&
      !this.ovpYear2Box.figure

    const saraUnavailable =
      this.riskTowardsPartnerBox.levelText === 'UNKNOWN' && this.riskTowardsOthersBox.levelText === 'UNKNOWN'

    const rsrUnavailable =
      this.riskOfSeriousRecidivismBox.levelText === 'UNKNOWN' &&
      !this.riskOfSeriousRecidivismBox.figure &&
      this.ospcBox.levelText === 'UNKNOWN' &&
      this.ospiBox.levelText === 'UNKNOWN'

    const roshUnavailable = this.roshRiskBox.levelText === 'UNKNOWN'
    const alertsUnavailable = this.presenter.risks.alerts == null

    return (
      ogrsUnavailable || ovpUnavailable || saraUnavailable || rsrUnavailable || roshUnavailable || alertsUnavailable
    )
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: this.presenter.updatedText,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get importedFromNdeliusText(): InsetTextArgs {
    return {
      text: `Imported from NDelius on ${this.presenter.risks.dateRetrieved}.`,
      classes: 'govuk-!-margin-top-8',
    }
  }

  get ogrsYear1Box(): RiskBox {
    return {
      category: 'OGRS Year 1',
      dataTestId: `OGRS-Year-1-risk-box`,
      figure: this.presenter.formatFigure(this.presenter.risks.offenderGroupReconviction.oneYear),
      levelClass: this.presenter.getLevelClass(this.presenter.risks.offenderGroupReconviction.scoreLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.offenderGroupReconviction.scoreLevel),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get ogrsYear2Box(): RiskBox {
    return {
      category: 'OGRS Year 2',
      dataTestId: `OGRS-Year-2-risk-box`,
      figure: this.presenter.formatFigure(this.presenter.risks.offenderGroupReconviction.twoYears),
      levelClass: this.presenter.getLevelClass(this.presenter.risks.offenderGroupReconviction.scoreLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.offenderGroupReconviction.scoreLevel),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get ovpYear1Box(): RiskBox {
    return {
      category: 'OVP Year 1',
      dataTestId: `OVP-Year-1-risk-box`,
      figure: this.presenter.formatFigure(this.presenter.risks.offenderViolencePredictor.oneYear),
      levelClass: this.presenter.getLevelClass(this.presenter.risks.offenderViolencePredictor.scoreLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.offenderViolencePredictor.scoreLevel),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get ovpYear2Box(): RiskBox {
    return {
      category: 'OVP Year 2',
      dataTestId: `OVP-Year-2-risk-box`,
      figure: this.presenter.formatFigure(this.presenter.risks.offenderViolencePredictor.twoYears),
      levelClass: this.presenter.getLevelClass(this.presenter.risks.offenderViolencePredictor.scoreLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.offenderViolencePredictor.scoreLevel),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get riskTowardsPartnerBox(): RiskBox {
    return {
      category: 'SARA',
      dataTestId: `SARA-partner-risk-box`,
      levelClass: this.presenter.getLevelClass(
        this.presenter.risks.sara.imminentRiskOfViolenceTowardsPartner as RiskLevel,
      ),
      levelText: this.presenter.getLevelText(
        this.presenter.risks.sara.imminentRiskOfViolenceTowardsPartner as RiskLevel,
      ),
      bodyHtml: this.presenter.getBodyHtmlStringWithClass('Risk of violence towards partner'),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get riskTowardsOthersBox(): RiskBox {
    return {
      category: 'SARA',
      dataTestId: `SARA-others-risk-box`,
      levelClass: this.presenter.getLevelClass(
        this.presenter.risks.sara.imminentRiskOfViolenceTowardsOthers as RiskLevel,
      ),
      levelText: this.presenter.getLevelText(
        this.presenter.risks.sara.imminentRiskOfViolenceTowardsOthers as RiskLevel,
      ),
      bodyHtml: this.presenter.getBodyHtmlStringWithClass('Risk of violence towards others'),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get riskOfSeriousRecidivismBox(): RiskBox {
    return {
      category: 'RSR',
      dataTestId: `rsr-risk-box`,
      figure: this.presenter.risks.riskOfSeriousRecidivism.percentageScore,
      levelClass: this.presenter.getLevelClass(this.presenter.risks.riskOfSeriousRecidivism.scoreLevel as RiskLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.riskOfSeriousRecidivism.scoreLevel as RiskLevel),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get ospcBox(): OspBox {
    return {
      dataTestId: `ospc-risk-box`,
      levelClass: this.presenter.getLevelClass(this.presenter.risks.riskOfSeriousRecidivism.ospcScore as RiskLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.riskOfSeriousRecidivism.ospcScore as RiskLevel),
      type: 'OSP/C',
    }
  }

  get ospiBox(): OspBox {
    return {
      dataTestId: `ospi-risk-box`,
      levelClass: this.presenter.getLevelClass(this.presenter.risks.riskOfSeriousRecidivism.ospiScore as RiskLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.riskOfSeriousRecidivism.ospiScore as RiskLevel),
      type: 'OSP/I',
    }
  }

  get roshRiskBox(): RiskBox {
    return {
      category: 'RoSH',
      dataTestId: `Rosh-risk-box`,
      levelClass: this.presenter.getLevelClass(this.presenter.risks.riskOfSeriousHarm.overallRoshLevel as RiskLevel),
      levelText: this.presenter.getLevelText(this.presenter.risks.riskOfSeriousHarm.overallRoshLevel as RiskLevel),
    }
  }

  get roshTable(): GovukFrontendTable {
    return {
      classes: 'rosh-table govuk-!-margin-top-2',
      head: [{ text: 'Risk to' }, { text: 'Custody' }, { text: 'Community' }],
      rows: [
        [
          { text: 'Children' },
          this.presenter.roshTableCellForLevel(this.presenter.risks.riskOfSeriousHarm.riskChildrenCustody as RiskLevel),
          this.presenter.roshTableCellForLevel(
            this.presenter.risks.riskOfSeriousHarm.riskChildrenCommunity as RiskLevel,
          ),
        ],
        [
          { text: 'Public' },
          this.presenter.roshTableCellForLevel(this.presenter.risks.riskOfSeriousHarm.riskPublicCustody as RiskLevel),
          this.presenter.roshTableCellForLevel(this.presenter.risks.riskOfSeriousHarm.riskPublicCommunity as RiskLevel),
        ],
        [
          { text: 'Known adult' },
          this.presenter.roshTableCellForLevel(
            this.presenter.risks.riskOfSeriousHarm.riskKnownAdultCustody as RiskLevel,
          ),
          this.presenter.roshTableCellForLevel(
            this.presenter.risks.riskOfSeriousHarm.riskKnownAdultCommunity as RiskLevel,
          ),
        ],
        [
          { text: 'Staff' },
          this.presenter.roshTableCellForLevel(this.presenter.risks.riskOfSeriousHarm.riskStaffCustody as RiskLevel),
          this.presenter.roshTableCellForLevel(this.presenter.risks.riskOfSeriousHarm.riskStaffCommunity as RiskLevel),
        ],
        [
          { text: 'Prisoners' },
          this.presenter.roshTableCellForLevel(
            this.presenter.risks.riskOfSeriousHarm.riskPrisonersCustody as RiskLevel,
          ),
          { classes: 'rosh-table__cell', text: 'Not applicable' },
        ],
      ],
    }
  }

  get activeAlerts(): ActiveAlerts {
    const { alerts } = this.presenter.risks

    return {
      flags: alerts == null ? null : alerts.map(alert => ({ description: alert })),
      lastUpdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        ogrsYear1Box: this.ogrsYear1Box,
        ogrsYear2Box: this.ogrsYear2Box,
        ovpYear1Box: this.ovpYear1Box,
        ovpYear2Box: this.ovpYear2Box,
        riskTowardsPartnerBox: this.riskTowardsPartnerBox,
        riskTowardsOthersBox: this.riskTowardsOthersBox,
        riskOfSeriousRecidivismBox: this.riskOfSeriousRecidivismBox,
        ospcBox: this.ospcBox,
        ospiBox: this.ospiBox,
        roshRiskBox: this.roshRiskBox,
        roshTable: this.roshTable,
        activeAlerts: this.activeAlerts,
        assessmentCompletedText: this.assessmentCompletedText,
        roshLastupdated: this.presenter.getLastUpdatedStringWithClass(this.presenter.risks.lastUpdated),
        importedFromNdeliusText: this.importedFromNdeliusText,
        headingText: this.presenter.headingText,
        showTopDataUnavailableMessage: this.showTopDataUnavailableMessage,
      },
    ]
  }
}

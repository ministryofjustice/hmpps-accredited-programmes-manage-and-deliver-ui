import RisksAndAlertsOgrs4Presenter from './risksAndAlertsOgrs4Presenter'
import { DetailsArgs, InsetTextArgs, WarningTextArgs } from '../../utils/govukFrontendTypes'
import { ActiveAlerts } from './risksAndAlertsPresenter'

export default class RisksAndAlertsOgrs4View {
  constructor(private readonly presenter: RisksAndAlertsOgrs4Presenter) {}

  get updateWarning(): WarningTextArgs {
    return {
      text: 'Risk predictor tools updated',
      iconFallbackText: 'Warning',
    }
  }

  get updateDetails(): DetailsArgs {
    return {
      summaryText: 'How the risk predictor tools have changed',
      html:
        '<h2>All reoffending</h2>' +
        '<p class="govuk-!-margin-bottom-0"><span class="govuk-!-font-weight-bold">Old version: </span>Offender group reconviction scale (OGRS)</p>' +
        '<p><span class="govuk-!-font-weight-bold">Updated version: </span>All reoffending predictor</p>' +
        '<p>The All reoffending predictor has static and dynamic versions.</p>' +
        '<h2>Sexual reoffending </h2>' +
        '<h3>Direct contact </h3>' +
        '<p class="govuk-!-margin-bottom-0"><span class="govuk-!-font-weight-bold">Old version: </span>OASys sexual predictor: Direct contact (OSP-DC)</p>' +
        '<p><span class="govuk-!-font-weight-bold">Updated version: </span>Direct contact: Sexual reoffending predictor</p>' +
        '<p>The Direct contact: Sexual reoffending predictor only has a static score. </p>' +
        '<h3>Indirect contact </h3>' +
        '<p class="govuk-!-margin-bottom-0"><span class="govuk-!-font-weight-bold">Old version: </span>OASys sexual predictor: Images and indirect contact with children (OSP-IIC)</p>' +
        '<p><span class="govuk-!-font-weight-bold">Updated version: </span>Images and indirect contact: Sexual reoffending predictor</p>' +
        '<p>The Images and indirect contact: Sexual reoffending predictor only has a static score.</p>' +
        '<h2>Serious non-sexual violent reoffending</h2>' +
        '<p class="govuk-!-margin-bottom-0"><span class="govuk-!-font-weight-bold">Old version: </span>Previously part of RSR but not displayed</p>' +
        '<p><span class="govuk-!-font-weight-bold">Updated version: </span>Serious violent reoffending predictor</p>' +
        '<p>The Serious violent reoffending predictor has static and dynamic versions.</p>' +
        '<h2>Serious reoffending</h2>' +
        '<p>This predictor is a combination of the Direct contact: Sexual reoffending predictor, Images and indirect contact: Sexual reoffending predictor and Serious violent reoffending predictor scores.</p>' +
        '<p class="govuk-!-margin-bottom-0"><span class="govuk-!-font-weight-bold">Old version: </span>Risk of serious recidivism (RSR)</p>' +
        '<p><span class="govuk-!-font-weight-bold">Updated version: </span>Combined serious reoffending predictor</p>' +
        '<p>The Combined serious reoffending predictor has static and dynamic versions.</p>',
    }
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.risks.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get allReoffendingPredictor() {
    return {
      type: 'All reoffending predictor',
      level: this.presenter.levelOrUnknown(this.presenter.risks.ogrS4Risks.allReoffendingBand),
      score: this.presenter.risks.ogrS4Risks.allReoffendingScore,
      staticOrDynamic: this.presenter.risks.ogrS4Risks.allReoffendingScoreType.toUpperCase(),
      lastUpdated: this.presenter.risks.lastUpdated,
      bandPercentages: ['0%', '49%', '74%', '90%', '100%'],
    }
  }

  get violentReoffendingPredictor() {
    return {
      level: this.presenter.levelOrUnknown(this.presenter.risks.ogrS4Risks.violentReoffendingBand),
      score: this.presenter.risks.ogrS4Risks.violentReoffendingScore,
      type: 'Violent reoffending predictor',
      staticOrDynamic: this.presenter.risks.ogrS4Risks.violentReoffendingScoreType.toUpperCase(),
      completedDate: this.presenter.risks.lastUpdated,
    }
  }

  get saraReoffendingPartnerPredictor() {
    return {
      level: this.presenter.levelOrUnknown(this.presenter.risks.sara.imminentRiskOfViolenceTowardsPartner),
      type: 'SARA Risk of violence towards partner',
      completedDate: this.presenter.risks.lastUpdated,
    }
  }

  get saraReoffendingOthersPredictor() {
    return {
      level: this.presenter.levelOrUnknown(this.presenter.risks.sara.imminentRiskOfViolenceTowardsOthers),
      type: 'SARA Risk of violence towards others',
      completedDate: this.presenter.risks.lastUpdated,
    }
  }

  get combinedSeriousReoffendingPredictor() {
    return {
      level: this.presenter.levelOrUnknown(this.presenter.risks.ogrS4Risks.combinedSeriousReoffendingBand),
      score: this.presenter.risks.ogrS4Risks.combinedSeriousReoffendingScore,
      type: 'Combined serious reoffending predictor',
      staticOrDynamic: this.presenter.risks.ogrS4Risks.combinedSeriousReoffendingScoreType.toUpperCase(),
      completedDate: this.presenter.risks.lastUpdated,
    }
  }

  get directContactSexualReoffendingPredictor() {
    return {
      level: this.presenter.levelOrUnknown(this.presenter.risks.ogrS4Risks.directContactSexualReoffendingBand),
      score: this.presenter.risks.ogrS4Risks.directContactSexualReoffendingScore,
      type: 'Direct contact: Sexual reoffending predictor',
      completedDate: this.presenter.risks.lastUpdated,
    }
  }

  get imagesAndIndirectContactSexualReoffendingPredictor() {
    return {
      level: this.presenter.levelOrUnknown(this.presenter.risks.ogrS4Risks.indirectImageContactSexualReoffendingBand),
      score: this.presenter.risks.ogrS4Risks.indirectImageContactSexualReoffendingScore,
      type: 'Images and indirect contact: Sexual reoffending predictor',
      completedDate: this.presenter.risks.lastUpdated,
    }
  }

  get roshRiskSummary() {
    return {
      hasBeenCompleted: true,
      overallRisk: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.overallRoshLevel),
      risks: [
        {
          riskTo: 'Children',
          community: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskChildrenCommunity),
          custody: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskChildrenCustody),
        },
        {
          riskTo: 'Public',
          community: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskPublicCommunity),
          custody: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskPublicCustody),
        },
        {
          riskTo: 'Known Adult',
          community: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskKnownAdultCommunity),
          custody: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskKnownAdultCustody),
        },
        {
          riskTo: 'Staff',
          community: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskStaffCommunity),
          custody: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskStaffCustody),
        },
        {
          riskTo: 'Prisoners',
          community: 'N/A',
          custody: this.presenter.levelOrUnknown(this.presenter.risks.riskOfSeriousHarm.riskPrisonersCustody),
        },
      ],
      lastUpdated: this.presenter.risks.lastUpdated,
    }
  }

  get importedFromNdeliusText(): InsetTextArgs {
    return {
      text: `Imported from Nomis on ${this.presenter.risks.dateRetrieved}, last updated on ${this.presenter.risks.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-8',
    }
  }

  get activeAlerts(): ActiveAlerts {
    return {
      flags: this.presenter.risks.alerts.map(alert => ({ description: alert })),
      lastUpdated: `<p class="risk-box__body-text govuk-!-margin-bottom-0">Last updated: ${this.presenter.risks.lastUpdated}</p>`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        updateWarning: this.updateWarning,
        updateDetails: this.updateDetails,
        assessmentCompletedText: this.assessmentCompletedText,
        allReoffendingPredictor: this.allReoffendingPredictor,
        violentReoffendingPredictor: this.violentReoffendingPredictor,
        saraReoffendingPartnerPredictor: this.saraReoffendingPartnerPredictor,
        saraReoffendingOthersPredictor: this.saraReoffendingOthersPredictor,
        combinedSeriousReoffendingPredictor: this.combinedSeriousReoffendingPredictor,
        directContactSexualReoffendingPredictor: this.directContactSexualReoffendingPredictor,
        imagesAndIndirectContactSexualReoffendingPredictor: this.imagesAndIndirectContactSexualReoffendingPredictor,
        roshRiskSummary: this.roshRiskSummary,
        importedFromNdeliusText: this.importedFromNdeliusText,
        activeAlerts: this.activeAlerts,
      },
    ]
  }
}

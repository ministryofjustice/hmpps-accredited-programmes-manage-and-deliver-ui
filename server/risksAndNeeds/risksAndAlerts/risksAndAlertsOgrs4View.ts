import RisksAndAlertsOgrs4Presenter from './risksAndAlertsOgrs4Presenter'
import { DetailsArgs, WarningTextArgs } from '../../utils/govukFrontendTypes'

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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        updateWarning: this.updateWarning,
        updateDetails: this.updateDetails,
      },
    ]
  }
}

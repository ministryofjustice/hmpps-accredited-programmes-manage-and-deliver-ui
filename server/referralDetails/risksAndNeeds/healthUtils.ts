import ShowRisksAndNeedsUtils from '../referrals/showRisksAndNeedsUtils'

import {Health} from "@manage-and-deliver-api";
import {GovukFrontendSummaryListRowWithKeyAndValue} from "./index";

export default class HealthUtils {
  static healthSummaryListRows(health: Health): Array<GovukFrontendSummaryListRowWithKeyAndValue> {
    let generalHealthText = ShowRisksAndNeedsUtils.yesOrNo(health.anyHealthConditions)

    if (health.anyHealthConditions) {
      generalHealthText += `<br><br>${ShowRisksAndNeedsUtils.htmlTextValue(health.description)}`
    }

    return [
      {
        key: { text: 'General health - any physical or mental health conditions? (optional)' },
        value: { html: generalHealthText },
      },
    ]
  }
}

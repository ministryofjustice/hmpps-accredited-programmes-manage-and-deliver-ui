export default class CaselistUtils {
  static cohorts = [
    { value: 'general-offence', text: 'General Offence' },
    { value: 'sexual-offence', text: 'Sexual Offence' },
  ]

  static referralStatus = [
    {
      value: 'REFERRAL_SUBMITTED',
      text: 'Referral submitted',
    },
    {
      value: 'ON_HOLD_REFERRAL_SUBMITTED',
      text: 'On hold - referral submitted',
    },
    {
      value: 'COURT_ORDER',
      text: 'Court order',
    },
    {
      value: 'RETURNED_TO_COURT',
      text: 'Returned to court',
    },
    {
      value: 'AWAITING_ASSESSMENT',
      text: 'Awaiting assessment',
    },
    {
      value: 'ON_HOLD_AWAITING_ASSESSMENT',
      text: 'On hold - awaiting assessment',
    },
    {
      value: 'ASSESSMENT_STARTED',
      text: 'Assessment started',
    },
    {
      value: 'ON_HOLD_ASSESSMENT_STARTED',
      text: 'On hold - assessment started',
    },
    {
      value: 'ASSESSED_SUITABLE',
      text: 'Assessed as suitable',
    },
    {
      value: 'SUITABLE_NOT_READY',
      text: 'Suitable but not ready',
    },
    {
      value: 'ON_PROGRAMME',
      text: 'On programme',
    },
    {
      value: 'NOT_ELIGIBLE',
      text: 'Not eligible',
    },
    {
      value: 'NOT_SUITABLE',
      text: 'Not suitable',
    },
    {
      value: 'WITHDRAWN',
      text: 'Withdrawn',
    },
    {
      value: 'DESELECTED',
      text: 'Deselected',
    },
    {
      value: 'PROGRAMME_COMPLETE',
      text: 'Programme complete',
    },
  ]
}

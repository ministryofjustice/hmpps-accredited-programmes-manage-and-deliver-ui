export default class CaselistUtils {
  static cohorts = [
    { value: 'general-offence', text: 'General Offence' },
    { value: 'sexual-offence', text: 'Sexual Offence' },
  ]

  static referralStatus = [
    {
      value: 'referral-submitted',
      text: 'Referral submitted',
    },
    {
      value: 'referral-submitted-hold',
      text: 'On hold - referral submitted',
    },
    {
      value: 'court-order',
      text: 'Court order',
    },
    {
      value: 'returned-court',
      text: 'Returned to court',
    },
    {
      value: 'awaiting-assessment',
      text: 'Awaiting assessment',
    },
    {
      value: 'awaiting-assessment-hold',
      text: 'On hold - awaiting assessment',
    },
    {
      value: 'assessment-started',
      text: 'Assessment started',
    },
    {
      value: 'assessment-started-hold',
      text: 'On hold - assessment started',
    },
    {
      value: 'assessed-suitable',
      text: 'Assessed as suitable',
    },
    {
      value: 'suitable-not-ready',
      text: 'Suitable but not ready',
    },
    {
      value: 'on-programme',
      text: 'On programme',
    },
    {
      value: 'not-eligible',
      text: 'Not eligible',
    },
    {
      value: 'not-suitable',
      text: 'Not suitable',
    },
    {
      value: 'withdrawn',
      text: 'Withdrawn',
    },
    {
      value: 'deselected',
      text: 'Deselected',
    },
    {
      value: 'programme-complete',
      text: 'Programme complete',
    },
  ]
}

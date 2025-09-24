import { ReferralDetails } from '@manage-and-deliver-api'

export default class UpdateReferralStatusPresenter {
  constructor(readonly details: ReferralDetails) {}

  get statusUpdateRadioButtonsOptions() {
    return {
      name: 'signIn',
      fieldset: {
        legend: {
          text: 'Select the new referral status',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: [
        {
          value: 'awaiting-allocation',
          text: 'Awaiting allocation',
          hint: {
            text: 'This person has been assessed as suitable and can be allocated to a group',
          },
        },
        {
          value: 'govuk-one-login',
          text: 'Suitable but not ready',
          hint: {
            text: 'This person meets the suitability criteria but is not ready to start the programme. The referral will be paused until they are ready.',
          },
        },
      ],
    }
  }

  get addDetailsTextboxOptions() {
    return {
      name: 'moreDetail',
      id: 'more-detail',
      label: {
        text: 'Add details (optional)',
        classes: 'govuk-label--m',
        isPageHeading: false,
      },
      maxlength: '500',
      hint: {
        text: 'You can add more information about this update, such as the reason for an assessment decision or for deprioritising someone.',
      },
    }
  }

  get currentStatusTagOptions() {
    return {
      text: 'Awaiting assessment',
      class: '',
    }
  }

  getCurrentStatusTimelineOptions(htmlContent: string) {
    return {
      items: [
        {
          label: {
            text: 'Current status',
          },
          html: htmlContent,
          datetime: {
            timestamp: '2025-07-10T11:15:00.000Z',
            type: 'datetime',
          },
          byline: {
            text: 'Accredited Programmes automated update',
          },
        },
      ],
    }
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: '',
    }
  }
}

import { ReferralDetails } from '@manage-and-deliver-api'
import { SummaryListArgs } from '../utils/govukFrontendTypes'
import { SummaryListItem } from '../utils/summaryList'
import ViewUtils from '../utils/viewUtils'

export enum ReferralDetailsPageSection {
  PersonalDetailsTab = 'personalDetails',
  ProgrammeHistoryTab = 'programmeHistory',
  OffenceHistoryTab = 'offenceHistory',
  SentenceInformationTab = 'sentenceInformation',
  AvailabilityTab = 'availability',
  LocationTab = 'location',
  AdditionalInformationTab = 'additionalInformation',
}

export default class ReferralDetailsPresenter {
  protected constructor(
    readonly referralDetails: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
  ) {}

  get referralSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.referralSummaryList(), { showBorders: false }, 'govuk-!-margin-bottom-0'),
    }
  }

  getSubHeaderArgs(): {
    heading: { text: string; classes: string }
    items: { text: string; classes: string; href?: string }[]
  } {
    return {
      heading: {
        text: 'Referral to Building Choices: moderate intensity',
        classes: 'govuk-heading-l',
      },
      items: [
        {
          text: 'Back to referrals',
          classes: 'govuk-button--secondary',
          href: '/pdu/open-referrals',
        },
      ],
    }
  }

  getHorizontalSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: 'Referral details',
          href: `/personalDetails/${this.id}`,
          active: true,
        },
        {
          text: 'Risks and needs',
          href: '#2',
          active: false,
        },
        {
          text: 'Programme needs identifier',
          href: '#3',
          active: false,
        },
        {
          text: 'Status history',
          href: '#4',
          active: false,
        },
      ],
    }
  }

  getVerticalSubNavArgs(): {
    items: { text: string; href: string; active: boolean; attributes: object | null }[]
    classes: string
  } {
    return {
      items: [
        {
          text: 'Personal Details',
          href: `/referral-details/${this.id}/personal-details/#personal-details`,
          active: this.subNavValue === ReferralDetailsPageSection.PersonalDetailsTab,
          attributes: {
            id: 'personal-details',
          },
        },
        {
          text: 'Programme History',
          href: `/referral-details/${this.id}/programme-history/#programme-history`,
          active: this.subNavValue === ReferralDetailsPageSection.ProgrammeHistoryTab,
          attributes: {
            id: 'programme-history',
          },
        },
        {
          text: 'Offence History',
          href: `/referral-details/${this.id}/offence-history/#offence-history`,
          active: this.subNavValue === ReferralDetailsPageSection.OffenceHistoryTab,
          attributes: {
            id: 'offence-history',
          },
        },
        {
          text: 'Sentence Information',
          href: `/referral-details/${this.id}/sentence-information/#sentence-information`,
          active: this.subNavValue === ReferralDetailsPageSection.SentenceInformationTab,
          attributes: {
            id: 'sentence-information',
          },
        },
        {
          text: 'Availability',
          href: `/referral-details/${this.id}/availability/#availability`,
          active: this.subNavValue === ReferralDetailsPageSection.AvailabilityTab,
          attributes: {
            id: 'availability',
          },
        },
        {
          text: 'Location',
          href: `/referral-details/${this.id}/location/#location`,
          active: this.subNavValue === ReferralDetailsPageSection.LocationTab,
          attributes: {
            id: 'location',
          },
        },
        {
          text: 'Additional Information',
          href: `/referral-details/${this.id}/additional-information/#additional-information`,
          active: this.subNavValue === ReferralDetailsPageSection.AdditionalInformationTab,
          attributes: {
            id: 'additional-information',
          },
        },
      ],
      classes: 'govuk-!-padding-top-0',
    }
  }

  referralSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Applicant Name',
        lines: [`${this.referralDetails.personName}`],
      },
      {
        key: 'Programme Name',
        lines: [`${this.referralDetails.interventionName}`],
      },
      {
        key: 'Programme strand',
        lines: ['PLACEHOLDER'],
      },
      {
        key: 'Date referred',
        lines: [`${this.referralDetails.createdAt}`],
      },
      {
        key: 'Probation practitioner',
        lines: [`${this.referralDetails.probationPractitionerName}`],
      },
      {
        key: 'Probation practitioner email address',
        lines: [`${this.referralDetails.probationPractitionerEmail}`],
        valueLink: `<a href="mailto:${this.referralDetails.probationPractitionerEmail}">tom.saunders@justice.gov.uk</a>`,
      },
    ]
  }
}

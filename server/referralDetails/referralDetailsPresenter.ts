import { PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import DateUtils from '../utils/dateUtils'
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
    private referralDetails: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
    private personalDetails: PersonalDetails,
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

  getVerticalSubNavArgs(): { items: { text: string; href: string; active: boolean }[]; classes: string } {
    return {
      items: [
        {
          text: 'Personal Details',
          href: `/referral-details/${this.id}/personal-details`,
          active: this.subNavValue === ReferralDetailsPageSection.PersonalDetailsTab,
        },
        {
          text: 'Programme History',
          href: `/referral-details/${this.id}/programme-history`,
          active: this.subNavValue === ReferralDetailsPageSection.ProgrammeHistoryTab,
        },
        {
          text: 'Offence History',
          href: `/referral-details/${this.id}/offence-history`,
          active: this.subNavValue === ReferralDetailsPageSection.OffenceHistoryTab,
        },
        {
          text: 'Sentence Information',
          href: `/referral-details/${this.id}/sentence-information`,
          active: this.subNavValue === ReferralDetailsPageSection.SentenceInformationTab,
        },
        {
          text: 'Availability',
          href: `/referral-details/${this.id}/availability`,
          active: this.subNavValue === ReferralDetailsPageSection.AvailabilityTab,
        },
        {
          text: 'Location',
          href: `/referral-details/${this.id}/location`,
          active: this.subNavValue === ReferralDetailsPageSection.LocationTab,
        },
        {
          text: 'Additional Information',
          href: `/referral-details/${this.id}/additional-information`,
          active: this.subNavValue === ReferralDetailsPageSection.AdditionalInformationTab,
        },
      ],
      classes: 'govuk-!-padding-top-0',
    }
  }

  personalDetailsSummaryList(): SummaryListItem[] {
    const ageYears = DateUtils.age(this.personalDetails.dateOfBirth)
    const ageMonths = DateUtils.ageMonths(this.personalDetails.dateOfBirth)
    const ageMonthsStr = ageMonths === 1 ? `, ${ageMonths} month` : `, ${ageMonths} months`
    return [
      {
        key: 'Name',
        lines: [`${this.personalDetails.name}`],
      },
      {
        key: 'crn',
        lines: [this.personalDetails.crn],
      },
      {
        key: 'Date of birth',
        lines: [
          `${DateUtils.formattedDate(this.personalDetails.dateOfBirth)} (${ageYears} years${ageMonths === 0 ? '' : ageMonthsStr} old)`,
        ],
      },
      {
        key: 'Ethnicity',
        lines: [this.personalDetails.ethnicity],
      },
      {
        key: 'Gender',
        lines: [this.personalDetails.gender],
      },
      {
        key: 'Setting',
        lines: [this.personalDetails.setting],
      },
      {
        key: 'Probation delivery unit',
        lines: [this.personalDetails.probationDeliveryUnit],
      },
    ]
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

import PersonalDetails from '../models/PersonalDetails'
import { SummaryListItem } from '../utils/summaryList'
import DateUtils from '../utils/dateUtils'

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
    private personalDetails: PersonalDetails,
    readonly subNavValue: string,
    readonly id: string,
  ) {}

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
        lines: [`${this.personalDetails.name.forename} ${this.personalDetails.name.surname}`],
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
        lines: [this.personalDetails.probationDeliveryUnit.description],
      },
    ]
  }

  referralSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Applicant Name',
        lines: [`${this.personalDetails.name.forename} ${this.personalDetails.name.surname}`],
      },
      {
        key: 'Programme Name',
        lines: ['Building Choices: moderate intensity'],
      },
      {
        key: 'Programme strand',
        lines: ['Sexual Offence'],
      },
      {
        key: 'Date referred',
        lines: ['11 June 2023'],
      },
      {
        key: 'Probation practitioner',
        lines: ['Tom Saunders'],
      },
      {
        key: 'Probation practitioner email address',
        lines: ['text'],
        valueLink: '<a href="mailto:tom.saunders@justice.gov.uk">tom.saunders@justice.gov.uk</a>',
      },
    ]
  }

  offenceHistorySummaryLists(): { title: string; summary: SummaryListItem[] }[] {
    const summaries = []
    summaries.push({
      title: 'Index Offence',
      summary: [
        {
          key: 'Offence',
          lines: ['Publishing or causing to be published a tobacco advertisement - 09144'],
        },
        {
          key: 'Category',
          lines: ['Public Health Offences'],
        },
        {
          key: 'Offence date',
          lines: ['11 June 2020'],
        },
      ],
    })
    summaries.push({
      title: 'Additional offence (08000)',
      summary: [
        {
          key: 'Offence',
          lines: ['Absconding from lawful custody - 08000'],
        },
        {
          key: 'Category',
          lines: ['Absconding from lawful custody'],
        },
        {
          key: 'Offence date',
          lines: ['18 January 2013'],
        },
      ],
    })
    summaries.push({
      title: 'Additional offence (08000)',
      summary: [
        {
          key: 'Offence',
          lines: ['\tClass unspecified - permitting premises to be used - 09329'],
        },
        {
          key: 'Category',
          lines: ['Permitting premises to be used for unlawful (drug-related) purposes'],
        },
        {
          key: 'Offence date',
          lines: ['23 September 2000'],
        },
      ],
    })
    return summaries
  }
}

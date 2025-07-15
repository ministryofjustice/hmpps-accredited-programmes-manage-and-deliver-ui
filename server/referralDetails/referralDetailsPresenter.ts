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
  constructor(
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
          href: `/personalDetails/${this.id}?section=personalDetails`,
          active: this.subNavValue === ReferralDetailsPageSection.PersonalDetailsTab,
        },
        {
          text: 'Programme History',
          href: `/personalDetails/${this.id}?section=programmeHistory`,
          active: this.subNavValue === ReferralDetailsPageSection.ProgrammeHistoryTab,
        },
        {
          text: 'Offence History',
          href: `/personalDetails/${this.id}?section=offenceHistory`,
          active: this.subNavValue === ReferralDetailsPageSection.OffenceHistoryTab,
        },
        {
          text: 'Sentence Information',
          href: `/personalDetails/${this.id}?section=sentenceInformation`,
          active: this.subNavValue === ReferralDetailsPageSection.SentenceInformationTab,
        },
        {
          text: 'Availability',
          href: `/personalDetails/${this.id}?section=availability`,
          active: this.subNavValue === ReferralDetailsPageSection.AvailabilityTab,
        },
        {
          text: 'Location',
          href: `/personalDetails/${this.id}?section=location`,
          active: this.subNavValue === ReferralDetailsPageSection.LocationTab,
        },
        {
          text: 'Additional Information',
          href: `/personalDetails/${this.id}?section=additionalInformation`,
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
}

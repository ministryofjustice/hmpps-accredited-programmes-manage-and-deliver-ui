import PersonalDetails from '../models/PersonalDetails'

export enum PersonalDetailsPageSection {
  PersonalDetailsTab = 'personalDetails',
  ProgrammeHistoryTab = 'programmeHistory',
  OffenceHistoryTab = 'offenceHistory',
  SentenceInformationTab = 'sentenceInformation',
  AvailabilityTab = 'availability',
  LocationTab = 'location',
  AdditionalInformationTab = 'additionalInformation',
}

export default class PersonalDetailsPresenter {
  constructor(
    private personalDetails: PersonalDetails,
    readonly subNavValue: string,
    readonly id: string,
  ) {
    this.personalDetails = personalDetails
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
          href: `/personalDetails/${this.id}?section=personalDetails`,
          active: this.subNavValue === PersonalDetailsPageSection.PersonalDetailsTab,
        },
        {
          text: 'Programme History',
          href: `/personalDetails/${this.id}?section=programmeHistory`,
          active: this.subNavValue === PersonalDetailsPageSection.ProgrammeHistoryTab,
        },
        {
          text: 'Offence History',
          href: `/personalDetails/${this.id}?section=offenceHistory`,
          active: this.subNavValue === PersonalDetailsPageSection.OffenceHistoryTab,
        },
        {
          text: 'Sentence Information',
          href: `/personalDetails/${this.id}?section=sentenceInformation`,
          active: this.subNavValue === PersonalDetailsPageSection.SentenceInformationTab,
        },
        {
          text: 'Availability',
          href: `/personalDetails/${this.id}?section=availability`,
          active: this.subNavValue === PersonalDetailsPageSection.AvailabilityTab,
        },
        {
          text: 'Location',
          href: `/personalDetails/${this.id}?section=location`,
          active: this.subNavValue === PersonalDetailsPageSection.LocationTab,
        },
        {
          text: 'Additional Information',
          href: `/personalDetails/${this.id}?section=additionalInformation`,
          active: this.subNavValue === PersonalDetailsPageSection.AdditionalInformationTab,
        },
      ],
      classes: 'govuk-!-padding-top-0',
    }
  }
}

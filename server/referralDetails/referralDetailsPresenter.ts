import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'
import { SummaryListArgs } from '../utils/govukFrontendTypes'
import { SummaryListItem } from '../utils/summaryList'
import { formatCohort } from '../utils/utils'
import ViewUtils from '../utils/viewUtils'
import { MojAlertComponentArgs } from '../interfaces/alertComponentArgs'

export enum ReferralDetailsPageSection {
  PersonalDetailsTab = 'personalDetails',
  ProgrammeHistoryTab = 'programmeHistory',
  OffenceHistoryTab = 'offenceHistory',
  SentenceInformationTab = 'sentenceInformation',
  AvailabilityTab = 'availability',
  LocationTab = 'location',
  AdditionalInformationTab = 'additionalInformation',
}

export default class ReferralDetailsPresenter extends ReferralLayoutPresenter {
  protected constructor(
    readonly referralDetails: ReferralDetails,
    readonly subNavValue: string,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(HorizontalNavValues.referralDetailsTab, referralDetails, isLdcUpdated, isCohortUpdated)
  }

  get referralSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.referralSummaryList(), { showBorders: false }, 'govuk-!-margin-bottom-0'),
    }
  }

  get ldcUpdatedSuccessMessageArgs(): MojAlertComponentArgs {
    return {
      variant: 'success',
      title: 'LDC status changed',
      showTitleAsHeading: true,
      dismissible: true,
      text: `${this.referralDetails.personName} ${firstToLowerCase(this.referralDetails.hasLdcDisplayText)}`,
    }
  }

  get cohortUpdatedSuccessMessageArgs(): MojAlertComponentArgs {
    return {
      variant: 'success',
      title: 'Cohort changed',
      showTitleAsHeading: true,
      dismissible: true,
      text: `${this.referralDetails.personName} is in the ${formatCohort(this.referralDetails.cohort)} cohort`,
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
          href: `/referral-details/${this.referralDetails.id}/personal-details/#personal-details`,
          active: this.subNavValue === ReferralDetailsPageSection.PersonalDetailsTab,
          attributes: {
            id: 'personal-details',
          },
        },
        {
          text: 'Programme History',
          href: `/referral-details/${this.referralDetails.id}/programme-history/#programme-history`,
          active: this.subNavValue === ReferralDetailsPageSection.ProgrammeHistoryTab,
          attributes: {
            id: 'programme-history',
          },
        },
        {
          text: 'Offence History',
          href: `/referral-details/${this.referralDetails.id}/offence-history/#offence-history`,
          active: this.subNavValue === ReferralDetailsPageSection.OffenceHistoryTab,
          attributes: {
            id: 'offence-history',
          },
        },
        {
          text: 'Sentence Information',
          href: `/referral-details/${this.referralDetails.id}/sentence-information/#sentence-information`,
          active: this.subNavValue === ReferralDetailsPageSection.SentenceInformationTab,
          attributes: {
            id: 'sentence-information',
          },
        },
        {
          text: 'Availability',
          href: `/referral-details/${this.referralDetails.id}/availability/#availability`,
          active: this.subNavValue === ReferralDetailsPageSection.AvailabilityTab,
          attributes: {
            id: 'availability',
          },
        },
        {
          text: 'Location',
          href: `/referral-details/${this.referralDetails.id}/location/#location`,
          active: this.subNavValue === ReferralDetailsPageSection.LocationTab,
          attributes: {
            id: 'location',
          },
        },
        {
          text: 'Additional Information',
          href: `/referral-details/${this.referralDetails.id}/additional-information/#additional-information`,
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
        key: 'Cohort',
        lines: [{ item: `${formatCohort(this.referralDetails.cohort)}`, hasLdc: this.referralDetails.hasLdc }],
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
        valueLink: `<a href="mailto:${this.referralDetails.probationPractitionerEmail}">${this.referralDetails.probationPractitionerEmail}</a>`,
      },
    ].filter(item => item.lines.every(line => line !== null))
  }
}

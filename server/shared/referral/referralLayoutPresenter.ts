export enum HorizontalNavValues {
  referralDetailsTab = 'referralDetails',
  risksAndNeedsTab = 'risksAndNeeds',
  programmeNeedsIdentifierTab = 'programmeNeedsIdentifier',
  statusHistoryTab = 'statusHistory',
}

export default class ReferralLayoutPresenter {
  protected constructor(
    readonly horizontalNavValue: HorizontalNavValues,
    readonly referralId: string,
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

        {
          text: 'Update cohort',
          classes: 'govuk-button--secondary',
          href: `/referral/${this.referralId}/change-cohort`,
        },
      ],
    }
  }

  getHorizontalSubNavArgs(): { items: { text: string; href: string; active: boolean }[] } {
    return {
      items: [
        {
          text: 'Referral details',
          href: `/referral-details/${this.referralId}/personal-details`,
          active: this.horizontalNavValue === HorizontalNavValues.referralDetailsTab,
        },
        {
          text: 'Risks and needs',
          href: `/referral/${this.referralId}/risks-and-alerts`,
          active: this.horizontalNavValue === HorizontalNavValues.risksAndNeedsTab,
        },
        {
          text: 'Programme needs identifier',
          href: `/referral/${this.referralId}/programme-needs-identifier`,
          active: this.horizontalNavValue === HorizontalNavValues.programmeNeedsIdentifierTab,
        },
        {
          text: 'Status history',
          href: '#4',
          active: this.horizontalNavValue === HorizontalNavValues.statusHistoryTab,
        },
      ],
    }
  }
}

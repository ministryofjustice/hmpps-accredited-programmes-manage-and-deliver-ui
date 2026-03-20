import { ReferralDetails } from '@manage-and-deliver-api'
import { MojAlertComponentArgs } from '../../interfaces/alertComponentArgs'
import { firstToLowerCase, formatCohort } from '../../utils/utils'

export enum HorizontalNavValues {
  referralDetailsTab = 'referralDetails',
  risksAndNeedsTab = 'risksAndNeeds',
  programmeNeedsIdentifierTab = 'programmeNeedsIdentifier',
  availabilityAndMotivationTab = 'availabilityAndMotivation',
  attendanceHistoryTab = 'attendanceHistory',
  statusHistoryTab = 'statusHistory',
}

export default class ReferralLayoutPresenter {
  protected constructor(
    readonly horizontalNavValue: HorizontalNavValues,
    readonly referral: ReferralDetails,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {}

  showButtonMenu() {
    return (
      this.referral.currentStatusDescription.toLowerCase() !== 'withdrawn' &&
      this.referral.currentStatusDescription.toLowerCase() !== 'programme complete'
    )
  }

  getButtonMenu(): {
    button: { text: string; classes: string }
    items: { text: string; href?: string }[]
  } {
    let updateStatusHref = `/referral/${this.referral.id}/update-status`
    if (this.referral.currentStatusDescription === 'Scheduled') {
      updateStatusHref = `/referral/${this.referral.id}/update-status-scheduled`
    }
    if (this.referral.currentStatusDescription === 'On programme') {
      updateStatusHref = `/referral/${this.referral.id}/update-status-on-programme`
    }
    return {
      button: {
        text: 'Update referral',
        classes: 'govuk-button--secondary',
      },
      items: [
        {
          text: 'Update status',
          href: updateStatusHref,
        },
        {
          text: 'Change LDC status',
          href: `/referral/${this.referral.id}/update-ldc`,
        },
        {
          text: 'Change cohort',
          href: `/referral/${this.referral.id}/change-cohort`,
        },
      ],
    }
  }

  get ldcUpdatedSuccessMessageArgs(): MojAlertComponentArgs | null {
    return this.isLdcUpdated
      ? {
          variant: 'success',
          title: 'LDC status changed',
          showTitleAsHeading: true,
          dismissible: true,
          text: `${this.referral.personName} ${firstToLowerCase(this.referral.hasLdcDisplayText)}`,
        }
      : null
  }

  get cohortUpdatedSuccessMessageArgs(): MojAlertComponentArgs | null {
    return this.isCohortUpdated
      ? {
          variant: 'success',
          title: 'Cohort changed',
          showTitleAsHeading: true,
          dismissible: true,
          text: `${this.referral.personName} is in the ${formatCohort(this.referral.cohort)} cohort`,
        }
      : null
  }

  getHorizontalSubNavArgs(): { classes: string; items: { text: string; href: string; active: boolean }[] } {
    return {
      classes: 'govuk-!-margin-bottom-0',
      items: [
        {
          text: 'Referral details',
          href: `/referral-details/${this.referral.id}/personal-details`,
          active: this.horizontalNavValue === HorizontalNavValues.referralDetailsTab,
        },
        {
          text: 'Risks and needs',
          href: `/referral/${this.referral.id}/risks-and-alerts`,
          active: this.horizontalNavValue === HorizontalNavValues.risksAndNeedsTab,
        },
        {
          text: 'Programme needs identifier',
          href: `/referral/${this.referral.id}/programme-needs-identifier`,
          active: this.horizontalNavValue === HorizontalNavValues.programmeNeedsIdentifierTab,
        },
        {
          text: 'Availability and motivation',
          href: `/referral/${this.referral.id}/group-allocation-notes/motivation-background-and-non-associations`,
          active: this.horizontalNavValue === HorizontalNavValues.availabilityAndMotivationTab,
        },
        {
          text: 'Attendance history',
          href: `/referral/${this.referral.id}/attendance-history`,
          active: this.horizontalNavValue === HorizontalNavValues.attendanceHistoryTab,
        },
        {
          text: 'Status history',
          href: `/referral/${this.referral.id}/status-history`,
          active: this.horizontalNavValue === HorizontalNavValues.statusHistoryTab,
        },
      ],
    }
  }

  get headingText(): string {
    switch (this.horizontalNavValue) {
      case HorizontalNavValues.referralDetailsTab:
        return `Referral details: ${this.referral.personName}`
      case HorizontalNavValues.risksAndNeedsTab:
        return `Risks and needs: ${this.referral.personName}`
      case HorizontalNavValues.programmeNeedsIdentifierTab:
        return `Programme needs identifier: ${this.referral.personName}`
      case HorizontalNavValues.availabilityAndMotivationTab:
        return `Availability and motivation: ${this.referral.personName}`
      case HorizontalNavValues.attendanceHistoryTab:
        return `Attendance history: ${this.referral.personName}`
      case HorizontalNavValues.statusHistoryTab:
        return `Status history: ${this.referral.personName}`
      default:
        return this.referral.personName
    }
  }
}

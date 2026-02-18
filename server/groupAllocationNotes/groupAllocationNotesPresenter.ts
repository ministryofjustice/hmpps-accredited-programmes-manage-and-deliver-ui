import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'
import { InsetTextArgs } from '../utils/govukFrontendTypes'

export enum GroupAllocationNotesPageSection {
  AvailabilityTab = 'availability',
  LocationTab = 'location',
  MotivationBackgroundAndNonAssociationsTab = 'motivationBackgroundAndNonAssociations',
}

export default class GroupAllocationNotesPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly referral: ReferralDetails,
    readonly subNavValue: string,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(HorizontalNavValues.groupAllocationNotesTab, referral, isLdcUpdated, isCohortUpdated)
  }

  get groupAllocationTextArgs(): InsetTextArgs {
    return {
      html: `<p> ${this.referral.personName} is allocated to <a href="/group/${this.referral.currentlyAllocatedGroupId}/waitlist">
            ${this.referral.currentlyAllocatedGroupCode}</a>.</p>`,
      classes: 'govuk-!-margin-top-0 govuk-!-margin-bottom-0',
    }
  }

  get homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  getVerticalSubNavArgs(): {
    items: { text: string; href: string; active: boolean; attributes: object | null }[]
    classes: string
  } {
    return {
      items: [
        // {
        //   text: 'Availability',
        //   href: `/referral/${this.referral.id}/group-allocation-notes/availability`,
        //   active: this.subNavValue === GroupAllocationNotesPageSection.AvailabilityTab,
        //   attributes: {
        //     id: 'availability',
        //   },
        // },
        // {
        //   text: 'Location',
        //   href: `/referral/${this.referral.id}/group-allocation-notes/location`,
        //   active: this.subNavValue === GroupAllocationNotesPageSection.LocationTab,
        //   attributes: {
        //     id: 'location',
        //   },
        // },
        {
          text: 'Motivation, background and non-associations',
          href: `/referral/${this.referral.id}/group-allocation-notes/motivation-background-and-non-associations`,
          active: this.subNavValue === GroupAllocationNotesPageSection.MotivationBackgroundAndNonAssociationsTab,
          attributes: {
            id: 'motivation-background-and-non-associations',
          },
        },
      ],
      classes: 'govuk-!-padding-top-0',
    }
  }
}

import PersonalDetails from '../../models/PersonalDetails'

export default class AddAvailabilityPresenter {
  constructor(private readonly personalDetails: PersonalDetails) {}

  get text() {
    return {
      checkboxes: {
        pageTitle: `When is ${this.personalDetails.name.forename} ${this.personalDetails.name.surname} available to attend a programme?`,
      },
      otherDetailsTextArea: {
        label: 'Other availability details (optional)',
      }
    }
  }

  readonly checkboxItems = [
    {
      divider: 'Mondays',
    },
    {
      value: 'monday-daytime',
      text: `daytime`,
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'monday-evening',
      text: 'evening',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
    {
      divider: 'Tuesdays',
    },
    {
      value: 'tuesday-daytime',
      text: 'daytime',
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'tuesday-evening',
      text: 'evening',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
    {
      divider: 'Wednesdays',
    },
    {
      value: 'wednesday-daytime',
      text: 'daytime',
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'wednesday-evening',
      text: 'evening',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
    {
      divider: 'Thursdays',
    },
    {
      value: 'thursday-daytime',
      text: 'daytime',
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'thursday-evening',
      text: 'evening',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
    {
      divider: 'Fridays',
    },
    {
      value: 'friday-daytime',
      text: 'daytime',
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'friday-evening',
      text: 'evening',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
    {
      divider: 'Saturdays',
    },
    {
      value: 'saturday-daytime',
      text: 'daytime',
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'saturday-evening',
      text: 'evening',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
    {
      divider: 'Sunday',
    },
    {
      value: 'sunday-daytime',
      text: 'daytime',
      // checked: this.presenter.filter.gender?.includes('Male') ?? false,
    },
    {
      value: 'sunday-evening',
      text: 'evening',
      // checked: this.presenter.filter.gender?.includes('Female') ?? false,
    },
  ]

  // readonly fields = {
  //   accessibilityNeeds: this.utils.stringValue(this.referral.referral.accessibilityNeeds, 'accessibility-needs'),
  //   reasonForChange: this.utils.stringValue(null, AccessibilityNeedsForm.amendAccessibilityNeedsReasonForChangeId),
  // }
}

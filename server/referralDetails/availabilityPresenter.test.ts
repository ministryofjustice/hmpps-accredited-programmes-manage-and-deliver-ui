import { Availability, ReferralDetails } from '@manage-and-deliver-api'
import AvailabilityPresenter from './availabilityPresenter'

describe(`getAvailabilityTableArgs.`, () => {
  it('should generate the table correctly from the values supplied', () => {
    const referralDetails: ReferralDetails = {
      id: '1234',
      crn: '1234',
      personName: 'Steve Sticks',
      interventionName: 'An Intervention',
      createdAt: '2025-01-01',
      dateOfBirth: '1990-02-02',
      probationPractitionerName: 'Dave Davies',
      probationPractitionerEmail: 'dave.davies@moj.com',
      cohort: 'GENERAL_OFFENCE',
      hasLdc: true,
      hasLdcDisplayText: 'May need an LDC-adapted programme',
    }
    const availability: Availability = {
      id: '533f391d-a4dd-4a3f-b53d-e8ff2ab5db86',
      referralId: '39fde7e8-d2e3-472b-8364-5848bf673aa6',
      startDate: '2025-07-30',
      endDate: '2025-07-31',
      otherDetails: 'some stuff',
      lastModifiedBy: 'REFER_MONITOR_PP',
      lastModifiedAt: '2025-07-30T07:50:40.581763',
      availabilities: [
        {
          label: 'Mondays',
          slots: [
            { label: 'daytime', value: true },
            { label: 'evening', value: true },
            { label: 'nighttime', value: true },
          ],
        },
        {
          label: 'Tuesdays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
            { label: 'nighttime', value: false },
          ],
        },
        {
          label: 'Wednesdays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
            { label: 'nighttime', value: false },
          ],
        },
        {
          label: 'Thursdays',
          slots: [
            { label: 'daytime', value: true },
            { label: 'evening', value: true },
            { label: 'nighttime', value: false },
          ],
        },
        {
          label: 'Fridays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
            { label: 'nighttime', value: false },
          ],
        },
        {
          label: 'Saturdays',
          slots: [
            { label: 'daytime', value: true },
            { label: 'evening', value: false },
            { label: 'nighttime', value: false },
          ],
        },
        {
          label: 'Sundays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: true },
            { label: 'nighttime', value: false },
          ],
        },
      ],
    }
    const presenter = new AvailabilityPresenter(referralDetails, 'availability', '12345', availability)
    expect(presenter.getAvailabilityTableArgs()).toEqual({
      firstCellIsHeader: true,
      head: [{ text: 'Day' }, { text: 'Daytime' }, { text: 'Evening' }, { text: 'Nighttime' }],
      rows: [
        [
          { text: 'Mondays' },
          { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' },
        ],
        [
          { text: 'Tuesdays' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
        ],
        [
          { text: 'Wednesdays' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
        ],
        [
          { text: 'Thursdays' },
          { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
        ],
        [
          { text: 'Fridays' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
        ],
        [
          { text: 'Saturdays' },
          { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
        ],
        [
          { text: 'Sundays' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' },
          { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>' },
        ],
      ],
    })
  })
})

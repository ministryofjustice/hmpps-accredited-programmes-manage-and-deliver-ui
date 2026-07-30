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
      isLAO: false,
      hasLdc: true,
      hasLdcDisplayText: 'May need an LDC-adapted programme',
      hasLdcSuccessMessageText: 'may need an LDC-adapted programme (Building Choices Plus).',
      currentStatusDescription: 'Awaiting assessment',
      pdu: 'London',
      reportingTeam: 'team A',
      isLAO: true,
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
    const presenter = new AvailabilityPresenter(referralDetails, 'availability', availability)
    const args = presenter.getAvailabilityTableArgs()

    expect(args.caption).toBe('Availability schedule')
    expect(args.captionClasses).toBe('govuk-visually-hidden')
    expect(args.firstCellIsHeader).toBe(true)
    expect(args.head).toEqual([{ text: 'Day' }, { text: 'Daytime' }, { text: 'Evening' }, { text: 'Nighttime' }])

    expect(args.rows).toHaveLength(7)
    expect(args.rows[0]).toEqual([
      { text: 'Mondays' },
      {
        html: '<span class="govuk-visually-hidden">daytime available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--green">available</strong>',
      },
      {
        html: '<span class="govuk-visually-hidden">evening available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--green">available</strong>',
      },
      {
        html: '<span class="govuk-visually-hidden">nighttime available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--green">available</strong>',
      },
    ])

    expect(args.rows[1]).toEqual([
      { text: 'Tuesdays' },
      {
        html: '<span class="govuk-visually-hidden">daytime not available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--red">not available</strong>',
      },
      {
        html: '<span class="govuk-visually-hidden">evening not available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--red">not available</strong>',
      },
      {
        html: '<span class="govuk-visually-hidden">nighttime not available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--red">not available</strong>',
      },
    ])

    expect(args.rows[6]).toEqual([
      { text: 'Sundays' },
      {
        html: '<span class="govuk-visually-hidden">daytime not available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--red">not available</strong>',
      },
      {
        html: '<span class="govuk-visually-hidden">evening available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--green">available</strong>',
      },
      {
        html: '<span class="govuk-visually-hidden">nighttime not available</span><strong aria-hidden="true" class="govuk-tag govuk-tag--red">not available</strong>',
      },
    ])
  })
})

describe('availabilityTableHeading', () => {
  it('should return the heading with correct text and classes', () => {
    const referralDetails: ReferralDetails = {
      id: '1234',
      crn: '1234',
      personName: 'Emma Smith',
      interventionName: 'An Intervention',
      createdAt: '2025-01-01',
      dateOfBirth: '1990-02-02',
      probationPractitionerName: 'Alex River',
      probationPractitionerEmail: 'alex.river@justice.gov.uk',
      cohort: 'GENERAL_OFFENCE',
      isLAO: false,
      hasLdc: true,
      hasLdcDisplayText: 'May need an LDC-adapted programme',
      hasLdcSuccessMessageText: 'may need an LDC-adapted programme (Building Choices Plus).',
      currentStatusDescription: 'Awaiting assessment',
      pdu: 'London',
      reportingTeam: 'team A',
      isLAO: true,
    }
    const availability: Availability = {
      id: '533f391d-a4dd-4a3f-b53d-e8ff2ab5db86',
      referralId: '39fde7e8-d2e3-472b-8364-5848bf673aa6',
      startDate: '2025-07-30',
      endDate: '2025-07-31',
      otherDetails: 'some stuff',
      lastModifiedBy: 'REFER_MONITOR_PP',
      lastModifiedAt: '2025-07-30T07:50:40.581763',
      availabilities: [],
    }
    const presenter = new AvailabilityPresenter(referralDetails, 'availability', availability)
    expect(presenter.availabilityTableHeading).toEqual({
      text: 'Availability schedule',
      classes: 'govuk-heading-s',
    })
  })
})

describe('pageTitle', () => {
  it('returns the correct title for Availability', () => {
    const referralDetails: ReferralDetails = {
      id: '1234',
      crn: '1234',
      personName: 'Alex River',
      interventionName: 'An Intervention',
      createdAt: '2025-01-01',
      dateOfBirth: '1990-02-02',
      probationPractitionerName: 'Emma Smith',
      probationPractitionerEmail: 'emma.smith@moj.com',
      cohort: 'GENERAL_OFFENCE',
      isLAO: false,
      hasLdc: true,
      hasLdcDisplayText: 'May need an LDC-adapted programme',
      hasLdcSuccessMessageText: 'may need an LDC-adapted programme (Building Choices Plus).',
      currentStatusDescription: 'Awaiting assessment',
      pdu: 'London',
      reportingTeam: 'team A',
      isLAO: true,
    }
    const availability: Availability = {
      id: '533f391d-a4dd-4a3f-b53d-e8ff2ab5db86',
      referralId: '39fde7e8-d2e3-472b-8364-5848bf673aa6',
      startDate: '2025-07-30',
      endDate: '2025-07-31',
      otherDetails: 'some stuff',
      lastModifiedBy: 'REFER_MONITOR_PP',
      lastModifiedAt: '2025-07-30T07:50:40.581763',
      availabilities: [],
    }
    const presenter = new AvailabilityPresenter(referralDetails, 'availability', availability)
    expect(presenter.pageTitle).toBe('Availability - Availability and motivation')
  })
})

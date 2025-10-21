import { DailyAvailabilityModel } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import AddAvailabilityPresenter from './addAvailabilityPresenter'
import personalDetailsFactory from '../../testutils/factories/personalDetailsFactory'
import availabilityFactory from '../../testutils/factories/availabilityFactory'

afterEach(() => {
  jest.restoreAllMocks()
})

describe(`generateCheckboxItems.`, () => {
  it('if no availability id is present, the url should be for adding a new availability', () => {
    const personalDetails = personalDetailsFactory.build()
    const availability = availabilityFactory.defaultAvailability().build()
    const referralId = randomUUID()

    const presenter = new AddAvailabilityPresenter(
      personalDetails,
      null, // backlinkUri
      availability, // availability
      undefined, // validationError (defaults to null)
      undefined, // userInputData (defaults to null)
      referralId, // referralId
    )

    expect(presenter.locationButtonFormAction).toEqual(`/referral/${referralId}/add-availability`)
  })

  it('if availability id is present, the url should be for updating a new availability', () => {
    const personalDetails = personalDetailsFactory.build()
    const availability = availabilityFactory.build()
    const referralId = randomUUID()

    const presenter = new AddAvailabilityPresenter(
      personalDetails,
      null, // backlinkUri
      availability, // availability
      undefined, // validationError (defaults to null)
      undefined, // userInputData (defaults to null)
      referralId, // referralId
    )

    expect(presenter.locationButtonFormAction).toEqual(`/referral/${referralId}/update-availability/${availability.id}`)
  })
})

describe(`generateCheckboxItems.`, () => {
  it('should generate the checkboxes correctly from the values supplied', () => {
    const availabilities = [
      {
        label: 'Mondays' as DailyAvailabilityModel['label'],
        slots: [
          { label: 'daytime', value: true },
          { label: 'evening', value: false },
        ],
      },
    ]
    const personalDetails = personalDetailsFactory.build()
    const availability = availabilityFactory.defaultAvailability().build({ availabilities })

    const presenter = new AddAvailabilityPresenter(
      personalDetails,
      null, // backlinkUri
      availability, // availability
    )

    expect(presenter.generateCheckboxItems()).toEqual([
      {
        divider: 'Mondays',
      },
      {
        value: 'Mondays-daytime',
        text: 'daytime',
        checked: true,
      },
      {
        value: 'Mondays-evening',
        text: 'evening',
        checked: false,
      },
    ])
  })

  it('should generate the checkboxes correctly when re-rendering the page after an error', () => {
    const availabilities = [
      {
        label: 'Mondays' as DailyAvailabilityModel['label'],
        slots: [
          { label: 'daytime', value: false },
          { label: 'evening', value: false },
        ],
      },
      {
        label: 'Tuesdays' as DailyAvailabilityModel['label'],
        slots: [
          { label: 'daytime', value: false },
          { label: 'evening', value: false },
        ],
      },
      {
        label: 'Wednesdays' as DailyAvailabilityModel['label'],
        slots: [
          { label: 'daytime', value: false },
          { label: 'evening', value: false },
        ],
      },
    ]
    const personalDetails = personalDetailsFactory.build()
    const availability = availabilityFactory.defaultAvailability().build({ availabilities })

    const presenter = new AddAvailabilityPresenter(
      personalDetails,
      null, // backlinkUri
      availability, // availability
    )

    const mockFields = jest.spyOn(presenter, 'fields', 'get')
    mockFields.mockReturnValue({
      availabilityCheckboxes: {
        value: 'Mondays-daytime,Tuesdays-evening,Wednesdays-daytime,Wednesdays-evening',
        errorMessage: null,
      },
      otherDetailsTextArea: { value: '', errorMessage: null },
      endDateRequired: { value: '', errorMessage: 'This is required' },
      endDate: { value: '', errorMessage: null },
    })

    expect(presenter.generateCheckboxItems()).toEqual([
      {
        divider: 'Mondays',
      },
      {
        value: 'Mondays-daytime',
        text: 'daytime',
        checked: true,
      },
      {
        value: 'Mondays-evening',
        text: 'evening',
        checked: false,
      },
      {
        divider: 'Tuesdays',
      },
      {
        value: 'Tuesdays-daytime',
        text: 'daytime',
        checked: false,
      },
      {
        value: 'Tuesdays-evening',
        text: 'evening',
        checked: true,
      },
      {
        divider: 'Wednesdays',
      },
      {
        value: 'Wednesdays-daytime',
        text: 'daytime',
        checked: true,
      },
      {
        value: 'Wednesdays-evening',
        text: 'evening',
        checked: true,
      },
    ])
  })
})

import { DailyAvailabilityModel } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import AddAvailabilityPresenter from './addAvailabilityPresenter'
import personalDetailsFactory from '../../testutils/factories/personalDetailsFactory'
import availabilityFactory from '../../testutils/factories/availabilityFactory'

describe(`generateCheckboxItems.`, () => {
  it('if no availability id is present, the url should be for adding a new availability', () => {
    const personalDetails = personalDetailsFactory.build()
    const availability = availabilityFactory.defaultAvailability().build()
    const referralId = randomUUID()

    const presenter = new AddAvailabilityPresenter(personalDetails, null, null, null, availability, referralId)

    expect(presenter.locationButtonFormAction).toEqual(`/referral/${referralId}/add-availability`)
  })

  it('if availability id is present, the url should be for updating a new availability', () => {
    const personalDetails = personalDetailsFactory.build()
    const availability = availabilityFactory.build()
    const referralId = randomUUID()

    const presenter = new AddAvailabilityPresenter(personalDetails, null, null, null, availability, referralId)

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

    const presenter = new AddAvailabilityPresenter(personalDetails, null, null, null, availability, null)

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
})

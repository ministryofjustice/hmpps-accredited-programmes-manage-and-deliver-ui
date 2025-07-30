import { faker } from '@faker-js/faker/locale/en_GB'
import { Availability, DailyAvailabilityModel } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class AvailabilityFactory extends Factory<Availability> {
  defaultAvailability() {
    return this.params({
      id: null,
      referralId: null,
      startDate: null,
      endDate: null,
      otherDetails: null,
      lastModifiedBy: null,
      lastModifiedAt: null,
      availabilities: [
        {
          label: 'Mondays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
          ],
        },
        {
          label: 'Tuesdays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
          ],
        },
        {
          label: 'Wednesdays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
          ],
        },
        {
          label: 'Thursdays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
          ],
        },
        {
          label: 'Fridays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
          ],
        },
        {
          label: 'Saturdays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
          ],
        },
        {
          label: 'Sundays',
          slots: [
            { label: 'daytime', value: false },
            { label: 'evening', value: false },
          ],
        },
      ],
    })
  }
}

export default AvailabilityFactory.define(({ sequence }) => ({
  id: sequence.toString(),
  referralId: sequence.toString(),
  startDate: faker.date.recent().toString(),
  endDate: faker.date.future().toString(),
  otherDetails: faker.lorem.sentence(),
  lastModifiedBy: faker.string.alphanumeric(),
  lastModifiedAt: faker.date.recent().toString(),
  availabilities: [
    {
      label: 'Mondays' as DailyAvailabilityModel['label'],
      slots: [{ label: 'a', value: false }],
    },
  ],
}))

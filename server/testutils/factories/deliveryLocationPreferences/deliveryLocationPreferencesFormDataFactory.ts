import { fakerEN_GB as faker } from '@faker-js/faker'
import { DeliveryLocationPreferencesFormData } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

export class DeliveryLocationPreferencesFormDataFactory extends Factory<DeliveryLocationPreferencesFormData> {}

export default DeliveryLocationPreferencesFormDataFactory.define(() => ({
  personOnProbation: {
    name: faker.person.fullName(),
    crn: `X${faker.string.numeric({ length: 6 })}`,
    dateOfBirth: faker.date.birthdate().toISOString(),
    tier: '',
  },
  otherPdusInSameRegion: [
    {
      code: 'PDU-999',
      deliveryLocations: [{ label: 'OFF-999', value: 'Office Nearyby' }],
      name: 'Other PDU in same region',
    },
  ],
  primaryPdu: {
    code: faker.string.alpha({ length: 5 }),
    name: faker.location.city(),
    deliveryLocations: [{ label: 'Primary PDU Office Locaiton', value: 'OFF-001' }],
  },
  // @ts-ignore
  existingDeliveryLocationPreferences: null,
}))

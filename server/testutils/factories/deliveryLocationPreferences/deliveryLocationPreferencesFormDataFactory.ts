import { fakerEN_GB as faker } from '@faker-js/faker'
import { DeliveryLocationPreferencesFormData } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

export class DeliveryLocationPreferencesFormDataFactory extends Factory<DeliveryLocationPreferencesFormData> {}

export default DeliveryLocationPreferencesFormDataFactory.define(({ sequence }) => ({
  personOnProbation: {
    name: faker.person.fullName(),
    crn: `X${faker.string.numeric({ length: 6 })}`,
    dateOfBirth: faker.date.birthdate().toISOString(),
    tier: '',
  },
  otherPdusInSameRegion: [],
  primaryPdu: {
    code: faker.string.alpha({ length: 5 }),
    name: faker.location.city(),
    deliveryLocations: [],
  },
  existingDeliveryLocationPreferences: null,
}))

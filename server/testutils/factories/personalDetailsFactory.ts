import { PersonalDetails } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class PersonalDetailsFactory extends Factory<PersonalDetails> {}

export default PersonalDetailsFactory.define(() => ({
  crn: 'X933590',
  personName: { forename: 'Alex', surname: 'River' },
  dateOfBirth: '15 March 1985',
  ethnicity: 'White',
  age: '40',
  gender: 'Male',
  setting: 'COMMUNITY',
  probationDeliveryUnit: 'East Sussex',
  dateRetrieved: '15 March 2025',
}))

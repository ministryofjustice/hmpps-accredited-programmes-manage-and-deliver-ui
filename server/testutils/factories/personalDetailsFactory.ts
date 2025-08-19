import { PersonalDetails } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class PersonalDetailsFactory extends Factory<PersonalDetails> {}

export default PersonalDetailsFactory.define(() => ({
  crn: 'X933590',
  name: 'Alex River',
  dateOfBirth: '15 March 1985',
  ethnicity: 'White',
  gender: 'Male',
  setting: 'Community',
  probationDeliveryUnit: 'East Sussex',
}))

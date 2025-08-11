import { ReferralDetails } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import { now } from 'moment'

class ReferralDetailsFactory extends Factory<ReferralDetails> {}

export default ReferralDetailsFactory.define(({ sequence }) => ({
  id: sequence.toString(),
  crn: 'X933590',
  personName: 'ALex River',
  interventionName: 'Building Choices',
  createdAt: now().toString(),
  dateOfBirth: '15 March 1985',
  probationPractitionerName: 'Prob Officer',
  probationPractitionerEmail: 'prob.officer@example.com',
  cohort: 'GENERAL_OFFENCE' as 'SEXUAL_OFFENCE' | 'GENERAL_OFFENCE',
}))

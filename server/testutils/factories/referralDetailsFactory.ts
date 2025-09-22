import { CohortEnum, ReferralDetails } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import { now } from 'moment'

class ReferralDetailsFactory extends Factory<ReferralDetails> {}

export default ReferralDetailsFactory.define(({ sequence }) => ({
  id: sequence.toString(),
  crn: 'X933590',
  personName: 'Alex River',
  interventionName: 'Building Choices',
  createdAt: now().toString(),
  dateOfBirth: '15 March 1985',
  probationPractitionerName: 'Prob Officer',
  probationPractitionerEmail: 'prob.officer@example.com',
  cohort: 'SEXUAL_OFFENCE' as CohortEnum,
  hasLdc: false,
  hasLdcDisplayText: 'Does not need an LDC-adapted programme',
}))

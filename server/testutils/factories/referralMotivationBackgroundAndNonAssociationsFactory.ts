import { ReferralMotivationBackgroundAndNonAssociations } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import { fakerEN_GB as faker } from '@faker-js/faker'

class ReferralMotivationBackgroundAndNonAssociationsFactory extends Factory<ReferralMotivationBackgroundAndNonAssociations> {}

export default ReferralMotivationBackgroundAndNonAssociationsFactory.define(({ sequence }) => ({
  id: sequence.toString(),
  referralId: sequence.toString(),
  maintainsInnocence: true,
  motivations: faker.lorem.sentence(),
  nonAssociations: faker.lorem.sentence(),
  otherConsiderations: faker.lorem.sentence(),
  createdAt: faker.date.recent().toString(),
  createdBy: faker.person.fullName(),
  lastUpdatedAt: null as string | null,
  lastUpdatedBy: null as string | null,
}))

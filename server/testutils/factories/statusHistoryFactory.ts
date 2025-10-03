import { fakerEN_GB as faker } from '@faker-js/faker'
import { ReferralStatusHistory } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class StatusHistoryFactory extends Factory<ReferralStatusHistory> {
  awaitingAssessment(): this {
    return this.params({
      referralStatusDescriptionName: 'Awaiting assessment',
      tagColour: 'yellow',
    })
  }

  awaitingAllocation(): this {
    return this.params({
      referralStatusDescriptionName: 'Awaiting allocation',
      tagColour: 'green',
    })
  }

  onWaitlist(): this {
    return this.params({
      referralStatusDescriptionName: 'On waitlist',
      tagColour: 'blue',
    })
  }

  withAdditionalDetails(additionalDetails: string): this {
    return this.params({ ...this.params, additionalDetails })
  }
}

export default StatusHistoryFactory.define(() => ({
  id: faker.string.uuid(),
  referralStatusDescriptionId: faker.string.uuid(),
  referralStatusDescriptionName: faker.helpers.arrayElement([
    'Awaiting assessment',
    'Awaiting allocation',
    'On waitlist',
    'Programme complete',
    'Withdrawn',
  ]),
  additionalDetails: faker.lorem.sentence(),
  updatedBy: faker.person.fullName(),
  updatedAt: faker.date.recent().toISOString(),
  tagColour: faker.helpers.arrayElement(['yellow', 'green', 'blue', 'purple', 'red']),
}))

import { SentenceInformation } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import { fakerEN_GB as faker } from '@faker-js/faker'

class SentenceInformationFactory extends Factory<SentenceInformation> {
  licence() {
    return this.params({
      // sentenceType: faker.string.alpha(),
      sentenceType: faker.string.alphanumeric({ length: 8 }),
      // releaseType: faker.string.alpha(),
      releaseType: faker.string.alphanumeric({ length: 8 }),
      // licenceConditions: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
      licenceConditions: [
        { code: faker.string.alphanumeric({ length: 8 }), description: faker.string.alphanumeric({ length: 8 }) },
      ],
      licenceEndDate: faker.date.future().toISOString(),
      postSentenceSupervisionStartDate: faker.date.future().toISOString(),
      postSentenceSupervisionEndDate: faker.date.future().toISOString(),
      twoThirdsPoint: faker.date.future().toISOString(),
      orderRequirements: [],
      orderEndDate: null,
      dateRetrieved: faker.date.recent().toISOString(),
    })
  }

  order() {
    return this.params({
      // sentenceType: faker.string.alpha(),
      sentenceType: faker.string.alphanumeric({ length: 8 }),
      // releaseType: faker.string.alpha(),
      releaseType: faker.string.alphanumeric({ length: 8 }),
      licenceConditions: [],
      licenceEndDate: null,
      postSentenceSupervisionStartDate: faker.date.future().toISOString(),
      postSentenceSupervisionEndDate: faker.date.future().toISOString(),
      twoThirdsPoint: faker.date.future().toISOString(),
      // orderRequirements: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
      orderRequirements: [
        { code: faker.string.alphanumeric({ length: 8 }), description: faker.string.alphanumeric({ length: 8 }) },
      ],
      orderEndDate: faker.date.future().toISOString(),
      dateRetrieved: faker.date.recent().toISOString(),
    })
  }
}

export default SentenceInformationFactory.define(() => ({
  // sentenceType: faker.string.alpha(),
  sentenceType: faker.string.alphanumeric({ length: 8 }),
  // releaseType: faker.string.alpha(),
  releaseType: faker.string.alphanumeric({ length: 8 }),
  // licenceConditions: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
  licenceConditions: [
    { code: faker.string.alphanumeric({ length: 8 }), description: faker.string.alphanumeric({ length: 8 }) },
  ],
  licenceEndDate: faker.date.future().toISOString(),
  postSentenceSupervisionStartDate: faker.date.future().toISOString(),
  postSentenceSupervisionEndDate: faker.date.future().toISOString(),
  twoThirdsPoint: faker.date.future().toISOString(),
  orderRequirements: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
  // orderRequirements: [{ code: faker.string.alphanumeric({ length: 8 }), description: faker.string.alphanumeric({ length: 8 }), }],
  orderEndDate: faker.date.future().toISOString(),
  dateRetrieved: faker.date.recent().toISOString(),
}))

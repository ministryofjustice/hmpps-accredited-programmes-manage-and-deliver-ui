import { SentenceInformation } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker/locale/en_GB'

class SentenceInformationFactory extends Factory<SentenceInformation> {
  licence() {
    return this.params({
      sentenceType: faker.string.alpha(),
      releaseType: faker.string.alpha(),
      licenceConditions: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
      licenceEndDate: faker.date.future().toString(),
      postSentenceSupervisionStartDate: faker.date.future().toString(),
      postSentenceSupervisionEndDate: faker.date.future().toString(),
      twoThirdsPoint: faker.date.future().toString(),
      orderRequirements: [],
      orderEndDate: null,
      dateRetrieved: faker.date.recent().toString(),
    })
  }

  order() {
    return this.params({
      sentenceType: faker.string.alpha(),
      releaseType: faker.string.alpha(),
      licenceConditions: [],
      licenceEndDate: null,
      postSentenceSupervisionStartDate: faker.date.future().toString(),
      postSentenceSupervisionEndDate: faker.date.future().toString(),
      twoThirdsPoint: faker.date.future().toString(),
      orderRequirements: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
      orderEndDate: faker.date.future().toString(),
      dateRetrieved: faker.date.recent().toString(),
    })
  }
}

export default SentenceInformationFactory.define(() => ({
  sentenceType: faker.string.alpha(),
  releaseType: faker.string.alpha(),
  licenceConditions: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
  licenceEndDate: faker.date.future().toString(),
  postSentenceSupervisionStartDate: faker.date.future().toString(),
  postSentenceSupervisionEndDate: faker.date.future().toString(),
  twoThirdsPoint: faker.date.future().toString(),
  orderRequirements: [{ code: faker.string.alpha(), description: faker.string.alpha() }],
  orderEndDate: faker.date.future().toString(),
  dateRetrieved: faker.date.recent().toString(),
}))

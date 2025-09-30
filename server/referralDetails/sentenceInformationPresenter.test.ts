import SentenceInformationPresenter from './sentenceInformationPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import sentenceInformationFactory from '../testutils/factories/sentenceInformationFactory'

describe(`sentenceInformationSummaryList.`, () => {
  it('a licence referral will show the correct rows', () => {
    const referralDetails = referralDetailsFactory.build()
    const sentenceInformation = sentenceInformationFactory.licence().build()

    const presenter = new SentenceInformationPresenter(referralDetails, 'sentence-information', sentenceInformation)

    const expectedResult = [
      {
        key: 'Sentence type',
        lines: [sentenceInformation.sentenceType],
      },
      {
        key: 'Release type',
        lines: [sentenceInformation.releaseType],
      },
      {
        key: 'License conditions',
        lines: [sentenceInformation.licenceConditions[0].description],
      },
      {
        key: 'License end date',
        lines: [sentenceInformation.licenceEndDate],
      },
      {
        key: 'Post-sentence supervision start date',
        lines: [sentenceInformation.postSentenceSupervisionStartDate],
      },
      {
        key: 'Post-sentence supervision end date',
        lines: [sentenceInformation.postSentenceSupervisionEndDate],
      },
      {
        key: 'Two-thirds point',
        lines: [sentenceInformation.twoThirdsPoint],
      },
    ]

    expect(presenter.sentenceInformationSummaryList()).toEqual(expectedResult)
  })

  it(`a licence referral will show 'Data not available' for null rows`, () => {
    const referralDetails = referralDetailsFactory.build()
    const sentenceInformation = sentenceInformationFactory.licence().build({
      sentenceType: null,
      releaseType: null,
      licenceConditions: [],
      licenceEndDate: null,
      postSentenceSupervisionStartDate: null,
      postSentenceSupervisionEndDate: null,
      twoThirdsPoint: null,
    })

    const presenter = new SentenceInformationPresenter(referralDetails, 'sentence-information', sentenceInformation)

    const expectedResult = [
      {
        key: 'Sentence type',
        lines: ['Data not available'],
      },
      {
        key: 'Release type',
        lines: ['Data not available'],
      },
      {
        key: 'License conditions',
        lines: ['Data not available'],
      },
      {
        key: 'License end date',
        lines: ['Data not available'],
      },
      {
        key: 'Post-sentence supervision start date',
        lines: ['Data not available'],
      },
      {
        key: 'Post-sentence supervision end date',
        lines: ['Data not available'],
      },
      {
        key: 'Two-thirds point',
        lines: ['Data not available'],
      },
    ]

    expect(presenter.sentenceInformationSummaryList()).toEqual(expectedResult)
  })

  it(`an order referral will show 'Data not available' for null rows`, () => {
    const referralDetails = referralDetailsFactory.build()
    const sentenceInformation = sentenceInformationFactory.order().build()

    const presenter = new SentenceInformationPresenter(referralDetails, 'sentence-information', sentenceInformation)

    const expectedResult = [
      {
        key: 'Sentence type',
        lines: [sentenceInformation.sentenceType],
      },
      {
        key: 'Order requirements',
        lines: [sentenceInformation.orderRequirements[0].description],
      },
      {
        key: 'Order end date',
        lines: [sentenceInformation.orderEndDate],
      },
    ]

    expect(presenter.sentenceInformationSummaryList()).toEqual(expectedResult)
  })

  it('an order referral will show the correct rows', () => {
    const referralDetails = referralDetailsFactory.build()
    const sentenceInformation = sentenceInformationFactory.order().build({ sentenceType: null, orderEndDate: null })

    const presenter = new SentenceInformationPresenter(referralDetails, 'sentence-information', sentenceInformation)

    const expectedResult = [
      {
        key: 'Sentence type',
        lines: ['Data not available'],
      },
      {
        key: 'Order requirements',
        lines: [sentenceInformation.orderRequirements[0].description],
      },
      {
        key: 'Order end date',
        lines: ['Data not available'],
      },
    ]

    expect(presenter.sentenceInformationSummaryList()).toEqual(expectedResult)
  })
})

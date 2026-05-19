import UpdateReferralStatusFixedPresenter from './updateReferralStatusToOnProgrammeOrCompletedPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import referralStatusTransitionsFactory from '../testutils/factories/referralStatusTransitionsFactory'
import { FormValidationError } from '../utils/formValidationError'

describe('UpdateReferralStatusFixedPresenter', () => {
  it('should return the correct page title', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build({
      suggestedStatus: { name: 'On programme', statusDescriptionId: '12345' },
    })

    const presenter = new UpdateReferralStatusFixedPresenter(details, statusDetails, '/back-link', '/cancel-link')

    expect(presenter.pageTitle).toEqual('Update status')
  })

  it('should return the correct text with person name and suggested status', () => {
    const personName = 'Alex River'
    const suggestedStatusName = 'On programme'
    const details = referralDetailsFactory.build({ personName })
    const statusDetails = referralStatusTransitionsFactory.build({
      suggestedStatus: { name: suggestedStatusName, statusDescriptionId: '12345' },
    })

    const presenter = new UpdateReferralStatusFixedPresenter(details, statusDetails, '/back-link', '/cancel-link')

    expect(presenter.text.title).toEqual(`${personName}'s referral status will change to ${suggestedStatusName}`)
  })

  it('should return null error summary when there is no validation error', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build({
      suggestedStatus: { name: 'On programme', statusDescriptionId: '12345' },
    })

    const presenter = new UpdateReferralStatusFixedPresenter(details, statusDetails, '/back-link', '/cancel-link')

    expect(presenter.errorSummary).toBeNull()
  })

  it('should return error summary when validation error exists', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build({
      suggestedStatus: { name: 'On programme', statusDescriptionId: '12345' },
    })
    const validationError: FormValidationError = {
      errors: [
        {
          formFields: ['more-details'],
          errorSummaryLinkedField: 'more-details',
          message: 'Please enter details',
        },
      ],
    }

    const presenter = new UpdateReferralStatusFixedPresenter(
      details,
      statusDetails,
      '/back-link',
      '/cancel-link',
      validationError,
    )

    expect(presenter.errorSummary).toEqual([{ field: 'more-details', message: 'Please enter details' }])
  })

  it('should return empty string value when there is no user input data', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build({
      suggestedStatus: { name: 'On programme', statusDescriptionId: '12345' },
    })

    const presenter = new UpdateReferralStatusFixedPresenter(details, statusDetails, '/back-link', '/cancel-link')

    expect(presenter.fields.moreDetailsTextArea).toEqual({ errorMessage: null, value: '' })
  })

  it('should return user input data value', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build({
      suggestedStatus: { name: 'On programme', statusDescriptionId: '12345' },
    })
    const userInputData = { 'more-details': 'Some additional details' }

    const presenter = new UpdateReferralStatusFixedPresenter(
      details,
      statusDetails,
      '/back-link',
      '/cancel-link',
      null,
      userInputData,
    )

    expect(presenter.fields.moreDetailsTextArea).toEqual({ errorMessage: null, value: 'Some additional details' })
  })

  it('should return error message when validation error exists', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build({
      suggestedStatus: { name: 'On programme', statusDescriptionId: '12345' },
    })
    const validationError: FormValidationError = {
      errors: [
        {
          formFields: ['more-details'],
          errorSummaryLinkedField: 'more-details',
          message: 'Details must be 500 characters or fewer',
        },
      ],
    }

    const presenter = new UpdateReferralStatusFixedPresenter(
      details,
      statusDetails,
      '/back-link',
      '/cancel-link',
      validationError,
    )

    expect(presenter.fields.moreDetailsTextArea).toEqual({
      errorMessage: 'Details must be 500 characters or fewer',
      value: '',
    })
  })
})

import UpdateReferralStatusStartedOrCompletedPresenter from './updateReferralStatusStartedOrCompletedPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import referralStatusTransitionsFactory from '../testutils/factories/referralStatusTransitionsFactory'
import { FormValidationError } from '../utils/formValidationError'

describe('UpdateReferralStatusStartedOrCompletedPresenter', () => {
  it('should return the correct page title', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build()

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(details, statusDetails, '/back-link')

    expect(presenter.pageTitle).toEqual('Update status')
  })

  it('should return allocated to a group text when current status is Scheduled', () => {
    const personName = 'Alex River'
    const details = referralDetailsFactory.build({ personName })
    const statusDetails = referralStatusTransitionsFactory.build({ currentStatus: { title: 'Scheduled' } })

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(details, statusDetails, '/back-link')

    expect(presenter.text.title).toEqual(`${personName} is allocated to a group`)
  })

  it('should return started Building Choices text when current status is not Scheduled', () => {
    const personName = 'Jane Smith'
    const details = referralDetailsFactory.build({ personName })
    const statusDetails = referralStatusTransitionsFactory.build({ currentStatus: { title: 'Started' } })

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(details, statusDetails, '/back-link')

    expect(presenter.text.title).toEqual(`${personName} has started Building Choices`)
  })

  it('should return null error summary when there is no validation error', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build()

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(details, statusDetails, '/back-link')

    expect(presenter.errorSummary).toBeNull()
  })

  it('should return error summary when validation error exists', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build()
    const validationError: FormValidationError = {
      errors: [
        {
          formFields: ['started-or-completed'],
          errorSummaryLinkedField: 'started-or-completed',
          message: 'Please select whether they have started or completed',
        },
      ],
    }

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(
      details,
      statusDetails,
      '/back-link',
      validationError,
    )

    expect(presenter.errorSummary).toEqual([
      { field: 'started-or-completed', message: 'Please select whether they have started or completed' },
    ])
  })

  it('should return empty string value when there is no user input data', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build()

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(details, statusDetails, '/back-link')

    expect(presenter.fields.currentStatus).toEqual({ errorMessage: null, value: '' })
  })

  it('should return user input data value when available', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build()
    const userInputData = { startedOrCompleted: 'completed' }

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(
      details,
      statusDetails,
      '/back-link',
      null,
      userInputData,
    )

    expect(presenter.fields.currentStatus).toEqual({ errorMessage: null, value: 'completed' })
  })

  it('should return error message when validation error exists', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusTransitionsFactory.build()
    const validationError: FormValidationError = {
      errors: [
        {
          formFields: ['started-or-completed'],
          errorSummaryLinkedField: 'started-or-completed',
          message: 'Select a status',
        },
      ],
    }

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(
      details,
      statusDetails,
      '/back-link',
      validationError,
    )

    expect(presenter.fields.currentStatus).toEqual({ errorMessage: 'Select a status', value: '' })
  })
})

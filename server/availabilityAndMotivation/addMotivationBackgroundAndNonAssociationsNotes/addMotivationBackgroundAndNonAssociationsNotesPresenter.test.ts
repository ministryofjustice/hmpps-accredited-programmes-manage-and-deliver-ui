import { randomUUID } from 'crypto'
import AddMotivationBackgroundAndNonAssociationsNotesPresenter from './addMotivationBackgroundAndNonAssociationsNotesPresenter'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'
import referralMotivationBackgroundAndNonAssociationsFactory from '../../testutils/factories/referralMotivationBackgroundAndNonAssociationsFactory'
import { FormValidationError } from '../../utils/formValidationError'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('AddMotivationBackgroundAndNonAssociationsNotesPresenter', () => {
  const referralId = randomUUID()
  const referral = referralDetailsFactory.build({ id: referralId })
  const motivationBackgroundAndNonAssociations = referralMotivationBackgroundAndNonAssociationsFactory.build()

  it('should return the correct cancel and backlink URI', () => {
    const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
      referral,
      motivationBackgroundAndNonAssociations,
    )

    expect(presenter.cancelAndBacklinkUri).toEqual(
      `/referral/${referralId}/availability-and-motivation/motivation-background-and-non-associations`,
    )
  })

  it('should return the correct page title', () => {
    const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
      referral,
      motivationBackgroundAndNonAssociations,
    )

    expect(presenter.pageTitle).toEqual('Motivation, background and non-associations - Availability and motivation')
  })

  it('should return the correct form action link', () => {
    const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
      referral,
      motivationBackgroundAndNonAssociations,
    )

    expect(presenter.formActionLink).toEqual(`/referral/${referralId}/add-motivation-background-and-non-associations`)
  })

  describe('text', () => {
    it('should return correct page heading', () => {
      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
      )

      expect(presenter.text.pageHeading).toEqual(
        'Provide information about motivation, background and non-associations',
      )
    })

    it('should return correct motivated character count field text', () => {
      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
      )

      expect(presenter.text.motivatedCharacterCount.label).toEqual(
        'Is the person motivated to participate in an Accredited Programme?',
      )
      expect(presenter.text.motivatedCharacterCount.hint).toEqual(
        'For example, are they motivated to address their thinking or behaviour, even if they maintain their innocence.',
      )
    })

    it('should return correct other people character count field text', () => {
      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
      )

      expect(presenter.text.otherPeopleCharacterCount.label).toEqual(
        'Are there other people on probation who the person should not attend a group with?',
      )
      expect(presenter.text.otherPeopleCharacterCount.hint).toEqual(
        'Include any non-associations and other relevant personal relationships, such as co-defendants or gang affiliations.',
      )
    })

    it('should return correct other considerations character count field text', () => {
      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
      )

      expect(presenter.text.otherConsiderationsCharacterCount.label).toEqual('Other considerations')
      expect(presenter.text.otherConsiderationsCharacterCount.hint).toEqual(
        'Include other information that could help with group composition, such as information to help create a diverse group.',
      )
    })
  })

  describe('errorSummary', () => {
    it('should return null when there is no validation error', () => {
      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
      )

      expect(presenter.errorSummary).toEqual(null)
    })

    it('should return formatted error summary when validation error exists', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['motivated-character-count'],
            errorSummaryLinkedField: 'motivated-character-count',
            message: 'Motivation must be 10,000 characters or fewer',
          },
          {
            formFields: ['non-associations-character-count'],
            errorSummaryLinkedField: 'non-associations-character-count',
            message: 'Non-associations must be 10,000 characters or fewer',
          },
        ],
      }

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
        validationError,
      )

      expect(presenter.errorSummary).toEqual([
        { field: 'motivated-character-count', message: 'Motivation must be 10,000 characters or fewer' },
        { field: 'non-associations-character-count', message: 'Non-associations must be 10,000 characters or fewer' },
      ])
    })
  })

  describe('fields', () => {
    it('should populate fields with data from motivationBackgroundAndNonAssociations', () => {
      const data = referralMotivationBackgroundAndNonAssociationsFactory.build({
        maintainsInnocence: true,
        motivations: 'Person is motivated to change',
        nonAssociations: 'Should not be with John Smith',
        otherConsiderations: 'Is a good communicator',
      })

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(referral, data)

      expect(presenter.fields.maintainInnocence.value).toEqual(true)
      expect(presenter.fields.motivated.value).toEqual('Person is motivated to change')
      expect(presenter.fields.nonAssociations.value).toEqual('Should not be with John Smith')
      expect(presenter.fields.otherConsiderations.value).toEqual('Is a good communicator')
    })

    it('should handle maintainsInnocence as false', () => {
      const data = referralMotivationBackgroundAndNonAssociationsFactory.build({
        maintainsInnocence: false,
      })

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(referral, data)

      expect(presenter.fields.maintainInnocence.value).toEqual(false)
    })

    it('should handle null and undefined values gracefully', () => {
      const data = referralMotivationBackgroundAndNonAssociationsFactory.build({
        motivations: null,
        nonAssociations: undefined,
        otherConsiderations: '',
      })

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(referral, data)

      expect(presenter.fields.motivated.value).toEqual('')
      expect(presenter.fields.nonAssociations.value).toEqual('')
      expect(presenter.fields.otherConsiderations.value).toEqual('')
    })

    it('should return null error messages when validation error is null', () => {
      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
      )

      expect(presenter.fields.maintainInnocence.errorMessage).toEqual(null)
      expect(presenter.fields.motivated.errorMessage).toEqual(null)
      expect(presenter.fields.nonAssociations.errorMessage).toEqual(null)
      expect(presenter.fields.otherConsiderations.errorMessage).toEqual(null)
    })

    it('should return error message for maintains-innocence field', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['maintains-innocence'],
            errorSummaryLinkedField: 'maintains-innocence',
            message: 'You must tell us if they maintain their innocence',
          },
        ],
      }

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
        validationError,
      )

      expect(presenter.fields.maintainInnocence.errorMessage).toEqual(
        'You must tell us if they maintain their innocence',
      )
    })

    it('should return error message for motivated-character-count field', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['motivated-character-count'],
            errorSummaryLinkedField: 'motivated-character-count',
            message: 'Motivation must be 10,000 characters or fewer',
          },
        ],
      }

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
        validationError,
      )

      expect(presenter.fields.motivated.errorMessage).toEqual('Motivation must be 10,000 characters or fewer')
    })

    it('should return error message for non-associations-character-count field', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['non-associations-character-count'],
            errorSummaryLinkedField: 'non-associations-character-count',
            message: 'Non-associations must be 10,000 characters or fewer',
          },
        ],
      }

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
        validationError,
      )

      expect(presenter.fields.nonAssociations.errorMessage).toEqual(
        'Non-associations must be 10,000 characters or fewer',
      )
    })

    it('should return error message for other-considerations-character-count field', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['other-considerations-character-count'],
            errorSummaryLinkedField: 'other-considerations-character-count',
            message: 'Other considerations must be 10,000 characters or fewer',
          },
        ],
      }

      const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
        referral,
        motivationBackgroundAndNonAssociations,
        validationError,
      )

      expect(presenter.fields.otherConsiderations.errorMessage).toEqual(
        'Other considerations must be 10,000 characters or fewer',
      )
    })
  })
})

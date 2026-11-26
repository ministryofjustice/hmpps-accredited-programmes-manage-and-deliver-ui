import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import PreGroupStatusChangePresenter from './preGroupStatusChangePresenter'
import PreGroupStatusChangeView from './preGroupStatusChangeView'

describe('PreGroupStatusChangeView', () => {
  const referralDetails = referralDetailsFactory.build()
  const backLinkUri = '/back-link'

  const buildView = ({
    isAddToGroupJourney = false,
    attendanceOutcomeCode = undefined,
  }: {
    isAddToGroupJourney?: boolean
    attendanceOutcomeCode?: string
  } = {}) => {
    const presenter = new PreGroupStatusChangePresenter(
      referralDetails,
      backLinkUri,
      isAddToGroupJourney,
      null,
      null,
      attendanceOutcomeCode,
    )
    return new PreGroupStatusChangeView(presenter)
  }

  describe('preGroupOneToOneInsetTextArgs', () => {
    describe('add-to-group journey', () => {
      it('shows add-to-group specific text', () => {
        const view = buildView({ isAddToGroupJourney: true })
        const insetText = view.preGroupOneToOneInsetTextArgs
        expect(insetText.text).toContain('previously started the programme')
        expect(insetText.text).toContain('return to')
        expect(insetText.text).toContain('On programme')
      })
    })

    describe('ATTC (Attended) attendance code', () => {
      it('shows ATTC-specific inset text', () => {
        const view = buildView({ attendanceOutcomeCode: 'ATTC' })
        const insetText = view.preGroupOneToOneInsetTextArgs
        expect(insetText.text).toContain('attended their pre-group one-to-one')
        expect(insetText.text).toContain('change to')
        expect(insetText.text).toContain('On programme')
      })
    })

    describe('AFTC (Attended - did not comply) attendance code', () => {
      it('shows AFTC-specific inset text', () => {
        const view = buildView({ attendanceOutcomeCode: 'AFTC' })
        const insetText = view.preGroupOneToOneInsetTextArgs
        expect(insetText.text).toContain('attended their pre-group one-to-one but did not comply')
        expect(insetText.text).toContain('change back to')
        expect(insetText.text).toContain('Scheduled')
      })
    })

    describe('UAAB (Did not attend) attendance code', () => {
      it('shows UAAB-specific inset text', () => {
        const view = buildView({ attendanceOutcomeCode: 'UAAB' })
        const insetText = view.preGroupOneToOneInsetTextArgs
        expect(insetText.text).toContain('did not attend their pre-group one-to-one')
        expect(insetText.text).toContain('change back to')
        expect(insetText.text).toContain('Scheduled')
      })
    })
  })

  describe('addDetailsTextboxArgs', () => {
    it('returns correct text box configuration', () => {
      const view = buildView()
      const textboxArgs = view.addDetailsTextboxArgs
      expect(textboxArgs.name).toBe('add-details')
      expect(textboxArgs.id).toBe('add-details')
      expect(textboxArgs.label.text).toBe('Add details (optional)')
      expect(textboxArgs.maxlength).toBe('500')
      expect(textboxArgs.hint.text).toBe('You can add more information about this update if you need to.')
    })

    it('shows error message when present', () => {
      const presenter = new PreGroupStatusChangePresenter(
        referralDetails,
        backLinkUri,
        false,
        {
          errors: [
            {
              formFields: ['add-details'],
              errorSummaryLinkedField: 'add-details',
              message: 'Details must be 500 characters or fewer',
            },
          ],
        },
        null,
        'AFTC',
      )
      const view = new PreGroupStatusChangeView(presenter)
      const textboxArgs = view.addDetailsTextboxArgs
      expect(textboxArgs.errorMessage?.text).toBe('Details must be 500 characters or fewer')
    })
  })

  describe('submitButtonArgs', () => {
    it('shows Save button for add-to-group journey', () => {
      const view = buildView({ isAddToGroupJourney: true })
      const buttonArgs = view.submitButtonArgs
      expect(buttonArgs.text).toBe('Save')
    })

    it('shows Submit attendance button for pre-group one-to-one attendance journey', () => {
      const view = buildView({ attendanceOutcomeCode: 'AFTC' })
      const buttonArgs = view.submitButtonArgs
      expect(buttonArgs.text).toBe('Submit attendance and update status')
    })

    it('has preventDoubleClick enabled', () => {
      const view = buildView()
      const buttonArgs = view.submitButtonArgs
      expect(buttonArgs.preventDoubleClick).toBe(true)
    })
  })

  describe('renderArgs', () => {
    it('includes all necessary render arguments', () => {
      const view = buildView({ attendanceOutcomeCode: 'AFTC' })
      const [templateName, locals] = view.renderArgs
      expect(templateName).toBe('updateReferralStatus/preGroupStatusChange')
      expect(locals.presenter).toBeDefined()
      expect(locals.pageTitle).toBe('Scheduled referral status change - Accredited Programmes')
      expect(locals.backLinkArgs).toBeDefined()
      expect(locals.errorSummary).toBeNull()
      expect(locals.preGroupOneToOneInsetTextArgs).toBeDefined()
      expect(locals.addDetailsTextboxArgs).toBeDefined()
      expect(locals.submitButtonArgs).toBeDefined()
    })
  })
})

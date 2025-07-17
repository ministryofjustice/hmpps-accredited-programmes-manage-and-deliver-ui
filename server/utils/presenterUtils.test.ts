import PresenterUtils from './presenterUtils'

describe(PresenterUtils, () => {
  describe('stringValue', () => {
    describe('when the model has a null value for the property', () => {
      describe('when there is no user input data', () => {
        it('returns an empty string', () => {
          const utils = new PresenterUtils(null)

          expect(utils.stringValue(null, 'additional-needs-information')).toBe('')
        })
      })

      describe('when there is user input data and the user input value for the property is null', () => {
        it('returns an empty string', () => {
          const userInputData: { 'additional-needs-information': string | null } = {
            'additional-needs-information': null,
          }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue(null, 'additional-needs-information')).toBe('')
        })
      })

      describe('when there is user input data and the property is absent from the user input data', () => {
        it('returns an empty string', () => {
          const userInputData = {}
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue(null, 'additional-needs-information')).toBe('')
        })
      })

      describe('when there is user input data and the user input value for the property is an empty string', () => {
        it('returns an empty string', () => {
          const userInputData = { 'additional-needs-information': '' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue(null, 'additional-needs-information')).toBe('')
        })
      })

      describe('when there is user input data and the user input value for the property is a non-empty string', () => {
        it('returns the user input value', () => {
          const userInputData = { 'additional-needs-information': 'bar' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue(null, 'additional-needs-information')).toBe('bar')
        })
      })

      describe('when there is user input data and the user input value for the property is present but neither a string nor null', () => {
        it('returns the stringified user input value', () => {
          const userInputData = { 'additional-needs-information': 100 }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue(null, 'additional-needs-information')).toBe('100')
        })
      })
    })

    describe('when the model has a non-null value for the property', () => {
      describe('when there is no user input data', () => {
        describe('when the model’s value is a string', () => {
          it('returns the value from the referral', () => {
            const utils = new PresenterUtils(null)

            expect(utils.stringValue('foo', 'additional-needs-information')).toBe('foo')
          })
        })

        describe('when the model’s value is a number', () => {
          it('returns the formatted value from the referral', () => {
            const utils = new PresenterUtils(null)

            expect(utils.stringValue(10, 'maximum-enforceable-days')).toBe('10')
          })
        })
      })

      describe('when there is user input data and the user input value for the property is null', () => {
        it('returns an empty string', () => {
          const userInputData: { 'additional-needs-information': string | null } = {
            'additional-needs-information': null,
          }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue('foo', 'additional-needs-information')).toBe('')
        })
      })

      describe('when there is user input data and the property is absent from the user input data', () => {
        it('returns an empty string', () => {
          const userInputData = {}
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue('foo', 'additional-needs-information')).toBe('')
        })
      })

      describe('when there is user input data and the user input value for the property is an empty string', () => {
        it('returns an empty string', () => {
          const userInputData = { 'additional-needs-information': '' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue('foo', 'additional-needs-information')).toBe('')
        })
      })

      describe('when there is user input data and the user input value for the property is a non-empty string', () => {
        it('returns the user input value', () => {
          const userInputData = { 'additional-needs-information': 'bar' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue('foo', 'additional-needs-information')).toBe('bar')
        })
      })

      describe('when there is user input data and the user input value for the property is present but neither a string nor null', () => {
        it('returns the stringified user input value', () => {
          const userInputData = { 'additional-needs-information': 100 }
          const utils = new PresenterUtils(userInputData)

          expect(utils.stringValue('foo', 'additional-needs-information')).toBe('100')
        })
      })
    })
  })

  describe('booleanValue', () => {
    describe('when the model has a null value for the property', () => {
      describe('when there is no user input data', () => {
        it('returns null', () => {
          const utils = new PresenterUtils(null)

          expect(utils.booleanValue(null, 'needs-interpreter')).toBeNull()
        })
      })

      describe('when there is user input data and the user input value for the property is null', () => {
        it('returns null', () => {
          const userInputData: { 'needs-interpreter': string | null } = {
            'needs-interpreter': null,
          }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(null, 'needs-interpreter')).toBeNull()
        })
      })

      describe('when there is user input data and the property is absent from the user input data', () => {
        it('returns null', () => {
          const userInputData = {}
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(null, 'needs-interpreter')).toBe(null)
        })
      })

      describe("when there is user input data and the user input value for the property is 'no'", () => {
        it('returns false', () => {
          const userInputData = { 'needs-interpreter': 'no' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(null, 'needs-interpreter')).toBe(false)
        })
      })

      describe("when there is user input data and the user input value for the property is 'yes'", () => {
        it('returns true', () => {
          const userInputData = { 'needs-interpreter': 'yes' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(null, 'needs-interpreter')).toBe(true)
        })
      })

      describe("when there is user input data and the user input value for the property is present but neither 'yes', 'no' nor null", () => {
        it('returns null', () => {
          const userInputData = { 'needs-interpreter': true }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(null, 'needs-interpreter')).toBeNull()
        })
      })
    })

    describe('when the model has a non-null value for the property', () => {
      describe('when there is no user input data', () => {
        it('returns the value from the referral', () => {
          const utils = new PresenterUtils(null)

          expect(utils.booleanValue(false, 'needs-interpreter')).toBe(false)
        })
      })

      describe('when there is user input data and the user input value for the property is null', () => {
        it('returns null', () => {
          const userInputData: { 'needs-interpreter': string | null } = {
            'needs-interpreter': null,
          }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(false, 'needs-interpreter')).toBeNull()
        })
      })

      describe('when there is user input data and the property is absent from the user input data', () => {
        it('returns null', () => {
          const userInputData = {}
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(false, 'needs-interpreter')).toBe(null)
        })
      })

      describe("when there is user input data and the user input value for the property is 'no'", () => {
        it('returns false', () => {
          const userInputData = { 'needs-interpreter': 'no' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(false, 'needs-interpreter')).toBe(false)
        })
      })

      describe("when there is user input data and the user input value for the property is 'yes'", () => {
        it('returns true', () => {
          const userInputData = { 'needs-interpreter': 'yes' }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(false, 'needs-interpreter')).toBe(true)
        })
      })

      describe("when there is user input data and the user input value for the property is present but neither 'yes', 'no' nor null", () => {
        it('returns null', () => {
          const userInputData = { 'needs-interpreter': true }
          const utils = new PresenterUtils(userInputData)

          expect(utils.booleanValue(false, 'needs-interpreter')).toBeNull()
        })
      })
    })
  })

  describe('.errorSummary', () => {
    describe('with null error', () => {
      it('returns null', () => {
        expect(PresenterUtils.errorSummary(null, { fieldOrder: ['first', 'second', 'third'] })).toBeNull()
      })
    })

    describe('with an empty errors array', () => {
      it('returns an empty array', () => {
        expect(PresenterUtils.errorSummary({ errors: [] }, { fieldOrder: ['first', 'second', 'third'] })).toEqual([])
      })
    })

    describe('when the errors array is non-empty', () => {
      it('returns an error summary ordered according to the errorSummaryLinkedFields’ positions in the fieldOrder array', () => {
        expect(
          PresenterUtils.errorSummary(
            {
              errors: [
                { errorSummaryLinkedField: 'second', message: 'second msg' },
                { errorSummaryLinkedField: 'first', message: 'first msg' },
                { errorSummaryLinkedField: 'third', message: 'third msg' },
              ],
            },
            { fieldOrder: ['first', 'second', 'third'] },
          ),
        ).toEqual([
          { field: 'first', message: 'first msg' },
          { field: 'second', message: 'second msg' },
          { field: 'third', message: 'third msg' },
        ])
      })

      it('does not modify the error', () => {
        const original = {
          errors: [
            { errorSummaryLinkedField: 'second', message: '' },
            { errorSummaryLinkedField: 'first', message: '' },
          ],
        }

        PresenterUtils.errorSummary(original, { fieldOrder: ['first', 'second'] })

        expect(original.errors).toEqual([
          { errorSummaryLinkedField: 'second', message: '' },
          { errorSummaryLinkedField: 'first', message: '' },
        ])
      })

      describe('when a field in the array of errors is missing from the fieldOrder array', () => {
        it('places that field at the end of the return value', () => {
          expect(
            PresenterUtils.errorSummary(
              {
                errors: [
                  { errorSummaryLinkedField: 'second', message: 'second msg' },
                  { errorSummaryLinkedField: 'first', message: 'first msg' },
                  { errorSummaryLinkedField: 'fourth', message: 'fourth msg' },
                  { errorSummaryLinkedField: 'third', message: 'third msg' },
                ],
              },
              { fieldOrder: ['first', 'second', 'third'] },
            ),
          ).toEqual([
            { field: 'first', message: 'first msg' },
            { field: 'second', message: 'second msg' },
            { field: 'third', message: 'third msg' },
            { field: 'fourth', message: 'fourth msg' },
          ])
        })
      })
    })
  })

  describe('.errorMessage', () => {
    describe('when error is null', () => {
      it('returns null', () => {
        expect(PresenterUtils.errorMessage(null, 'my-field')).toBeNull()
      })
    })

    describe('when error is non-null and contains an error for that field', () => {
      it('returns the message for that error', () => {
        const error = {
          errors: [
            { formFields: ['other-field'], message: 'other message' },
            { formFields: ['my-field', 'yet-another-field'], message: 'my message' },
          ],
        }
        expect(PresenterUtils.errorMessage(error, 'my-field')).toEqual('my message')
      })
    })

    describe('when error is non-null and doesn’t contain an error for that field', () => {
      it('returns null', () => {
        const error = {
          errors: [{ formFields: ['other-field'], message: 'other message' }],
        }
        expect(PresenterUtils.errorMessage(error, 'my-field')).toBeNull()
      })
    })
  })

  describe('.errorMessage', () => {
    describe('when error is null', () => {
      it('returns false', () => {
        expect(PresenterUtils.hasError(null, 'my-field')).toBe(false)
      })
    })

    describe('when error is non-null and contains an error for that field', () => {
      it('return true', () => {
        const error = {
          errors: [
            { formFields: ['other-field'], message: 'other message' },
            { formFields: ['my-field', 'yet-another-field'], message: 'my message' },
          ],
        }
        expect(PresenterUtils.hasError(error, 'my-field')).toBe(true)
      })
    })

    describe('when error is non-null and doesn’t contain an error for that field', () => {
      it('returns false', () => {
        const error = {
          errors: [{ formFields: ['other-field'], message: 'other message' }],
        }
        expect(PresenterUtils.hasError(error, 'my-field')).toBe(false)
      })
    })
  })
})

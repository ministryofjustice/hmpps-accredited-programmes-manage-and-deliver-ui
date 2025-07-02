import CaselistFilter from './caselistFilter'
import CaselistPresenter from './caselistPresenter'
import caselistItemFactory from '../testutils/factories/caselistItem'

describe(`filters.`, () => {
  describe(`generateFilterPane`, () => {
    it('should return the correct filter pane object for filters supplied', () => {
      const testObject = {
        filter: {
          referralStatus: 'awaiting-assessment',
          cohort: 'sexual-offence',
          nameOrCrn: 'Name',
        } as CaselistFilter,
        expectedResult: {
          heading: {
            text: 'Selected filters',
          },
          clearLink: {
            text: 'Clear filters',
            href: `/`,
          },
          categories: [
            {
              heading: {
                text: 'Referral Status',
              },
              items: [
                {
                  text: 'Awaiting assessment',
                },
              ],
            },
            {
              heading: {
                text: 'Cohort',
              },
              items: [
                {
                  text: 'Sexual Offence',
                },
              ],
            },
            {
              heading: {
                text: 'Name Or Crn',
              },
              items: [
                {
                  text: 'Name',
                },
              ],
            },
          ],
        },
      }

      const presenter = new CaselistPresenter(1, caselistItemFactory.build(), testObject.filter, '')
      expect(presenter.generateFilterPane()).toEqual(testObject.expectedResult)
    })

    it('should return the correct filter pane object when no filters supplied', () => {
      const testObject = {
        filter: { referralStatus: undefined, cohort: undefined, nameOrCrn: undefined } as CaselistFilter,
      }

      const presenter = new CaselistPresenter(1, caselistItemFactory.build(), testObject.filter, '')
      expect(presenter.generateFilterPane()).toEqual(null)
    })
  })

  describe('generateSelectValues', () => {
    it('should generate the correct select values', () => {
      const testObject = {
        filter: { referralStatus: undefined, cohort: undefined, nameOrCrn: undefined } as CaselistFilter,
      }
      const presenter = new CaselistPresenter(1, caselistItemFactory.build(), testObject.filter, '')

      const valuesToAddToSelect = [
        { value: 'general-offence', text: 'General Offence' },
        { value: 'sexual-offence', text: 'Sexual Offence' },
      ]
      expect(presenter.generateSelectValues(valuesToAddToSelect, testObject.filter.referralStatus)).toEqual([
        { disabled: true, selected: true, text: 'Select' },
        { selected: false, text: 'General Offence', value: 'general-offence' },
        { selected: false, text: 'Sexual Offence', value: 'sexual-offence' },
      ])
    })

    it('should generate just select value when no values provided', () => {
      const testObject = {
        filter: { referralStatus: undefined, cohort: undefined, nameOrCrn: undefined } as CaselistFilter,
      }
      const presenter = new CaselistPresenter(1, caselistItemFactory.build(), testObject.filter, '')

      const valuesToAddToSelect: { value: string; text: string }[] = []
      expect(presenter.generateSelectValues(valuesToAddToSelect, testObject.filter.referralStatus)).toEqual([
        { disabled: true, selected: true, text: 'Select' },
      ])
    })
  })

  describe('generateSelectedFilters', () => {
    it('should generate correct filters base on input params', () => {
      const testObject = {
        filter: { referralStatus: 'not-eligible', cohort: 'general-offence', nameOrCrn: 'Some Name' } as CaselistFilter,
      }
      const presenter = new CaselistPresenter(1, caselistItemFactory.build(), testObject.filter, '')

      expect(presenter.generateSelectedFilters()).toEqual([
        { heading: { text: 'Referral Status' }, items: [{ text: 'Not eligible' }] },
        { heading: { text: 'Cohort' }, items: [{ text: 'General Offence' }] },
        { heading: { text: 'Name Or Crn' }, items: [{ text: 'Some Name' }] },
      ])
    })

    it('should not generate selected filters when there are none on the params', () => {
      const testObject = {
        filter: { referralStatus: undefined, cohort: undefined, nameOrCrn: undefined } as CaselistFilter,
      }
      const presenter = new CaselistPresenter(1, caselistItemFactory.build(), testObject.filter, '')

      expect(presenter.generateSelectedFilters()).toEqual([])
    })
  })
})

import { ReferralCaseListItem } from '@manage-and-deliver-api'

import { Page } from '../shared/models/pagination'
import pageFactory from '../testutils/factories/pageFactory'
import referralCaseListItemFactory from '../testutils/factories/referralCaseListItem'
import TestUtils from '../testutils/testUtils'
import CaselistFilter from './caselistFilter'
import CaselistPresenter from './caselistPresenter'

describe(`filters`, () => {
  const caseListFilters = TestUtils.createCaseListFilters()
  describe(`generateFilterPane`, () => {
    it('should return the correct filter pane object for filters supplied', () => {
      const testObject = {
        filter: {
          status: 'AWAITING_ASSESSMENT',
          cohort: 'SEXUAL_OFFENCE',
          crnOrPersonName: 'Name',
        } as CaselistFilter,
        expectedResult: {
          heading: {
            text: 'Selected filters',
          },
          clearLink: {
            text: 'Clear filters',
            href: `/pdu/open-referrals`,
          },
          categories: [
            {
              heading: {
                text: 'Referral Status',
              },
              items: [
                {
                  href: '/pdu/open-referrals',
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
                  href: '/pdu/open-referrals',
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
                  href: '/pdu/open-referrals',
                  text: 'Name',
                },
              ],
            },
          ],
        },
      }

      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(1, referralCaseListItemPage, testObject.filter, '', true, caseListFilters)
      expect(presenter.generateFilterPane()).toEqual(testObject.expectedResult)
    })

    it('should return the correct filter pane object when no filters supplied', () => {
      const testObject = {
        filter: { status: undefined, cohort: undefined, crnOrPersonName: undefined } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(1, referralCaseListItemPage, testObject.filter, '', true, caseListFilters)
      expect(presenter.generateFilterPane()).toEqual(null)
    })
  })

  describe('generateSelectValues', () => {
    it('should generate the correct select values', () => {
      const testObject = {
        filter: { status: undefined, cohort: undefined, crnOrPersonName: undefined } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(1, referralCaseListItemPage, testObject.filter, '', true, caseListFilters)

      const valuesToAddToSelect = [
        { value: 'GENERAL_OFFENCE', text: 'General Offence' },
        { value: 'SEXUAL_OFFENCE', text: 'Sexual Offence' },
      ]
      expect(presenter.generateSelectValues(valuesToAddToSelect, testObject.filter.status)).toEqual([
        { text: 'Select', value: '' },
        { selected: false, text: 'General Offence', value: 'GENERAL_OFFENCE' },
        { selected: false, text: 'Sexual Offence', value: 'SEXUAL_OFFENCE' },
      ])
    })

    it('should generate just select value when no values provided', () => {
      const testObject = {
        filter: { status: undefined, cohort: undefined, crnOrPersonName: undefined } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(1, referralCaseListItemPage, testObject.filter, '', true, caseListFilters)

      const valuesToAddToSelect: { value: string; text: string }[] = []
      expect(presenter.generateSelectValues(valuesToAddToSelect, testObject.filter.status)).toEqual([
        { text: 'Select', value: '' },
      ])
    })
  })

  describe('generateSelectedFilters', () => {
    it('should generate correct filters base on input params', () => {
      const testObject = {
        filter: {
          status: 'NOT_ELIGIBLE',
          cohort: 'GENERAL_OFFENCE',
          crnOrPersonName: 'Some Name',
        } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(1, referralCaseListItemPage, testObject.filter, '', true, caseListFilters)

      expect(presenter.generateSelectedFilters()).toEqual([
        { heading: { text: 'Referral Status' }, items: [{ href: '/pdu/open-referrals', text: 'Not eligible' }] },
        { heading: { text: 'Cohort' }, items: [{ href: '/pdu/open-referrals', text: 'General Offence' }] },
        { heading: { text: 'Name Or Crn' }, items: [{ href: '/pdu/open-referrals', text: 'Some Name' }] },
      ])
    })

    it('should not generate selected filters when there are none on the params', () => {
      const testObject = {
        filter: { status: undefined, cohort: undefined, crnOrPersonName: undefined } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(1, referralCaseListItemPage, testObject.filter, '', true, caseListFilters)

      expect(presenter.generateSelectedFilters()).toEqual([])
    })
  })
})

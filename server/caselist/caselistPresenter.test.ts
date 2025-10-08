import { ReferralCaseListItem } from '@manage-and-deliver-api'

import { Page } from '../shared/models/pagination'
import pageFactory from '../testutils/factories/pageFactory'
import referralCaseListItemFactory from '../testutils/factories/referralCaseListItem'
import TestUtils from '../testutils/testUtils'
import CaselistFilter from './caselistFilter'
import CaselistPresenter from './caselistPresenter'

describe(`filters`, () => {
  const caseListFilters = TestUtils.createCaseListFilters()

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

  describe('generatePduSelect', () => {
    it('should generate correct select items based on API data and select the correct PDU', () => {
      const testObject = {
        filter: { pdu: 'PDU3' } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(
        1,
        referralCaseListItemPage,
        testObject.filter,
        '',
        true,
        TestUtils.createCaseListFilters(),
      )

      expect(presenter.generatePduSelectArgs()).toEqual([
        {
          text: 'Select PDU',
          value: '',
        },
        { text: 'PDU1', value: 'PDU1', selected: false },
        { text: 'PDU2', value: 'PDU2', selected: false },
        { text: 'PDU3', value: 'PDU3', selected: true },
      ])
    })
  })

  describe('generateReportingTeamCheckboxArgs', () => {
    it('should generate correct checkboxes based on API data and select the correct reporting team', () => {
      const testObject = {
        filter: { pdu: 'PDU1', reportingTeam: ['Team2'] } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(
        1,
        referralCaseListItemPage,
        testObject.filter,
        '',
        true,
        TestUtils.createCaseListFilters(),
      )

      expect(presenter.generateReportingTeamCheckboxArgs()).toEqual([
        {
          text: 'Team1',
          value: 'Team1',
          checked: false,
        },
        {
          text: 'Team2',
          value: 'Team2',
          checked: true,
        },
      ])
    })
  })
})

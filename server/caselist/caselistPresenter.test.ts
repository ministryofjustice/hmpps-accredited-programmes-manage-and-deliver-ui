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
      const presenter = new CaselistPresenter(
        1,
        referralCaseListItemPage,
        testObject.filter,
        '',
        true,
        caseListFilters,
        2,
      )

      const valuesToAddToSelect = [
        { value: 'GENERAL_OFFENCE', text: 'General offence' },
        { value: 'SEXUAL_OFFENCE', text: 'Sexual offence' },
      ]
      expect(presenter.generateSelectValues(valuesToAddToSelect, testObject.filter.status)).toEqual([
        { text: 'Select', value: '' },
        { selected: false, text: 'General offence', value: 'GENERAL_OFFENCE' },
        { selected: false, text: 'Sexual offence', value: 'SEXUAL_OFFENCE' },
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
      const presenter = new CaselistPresenter(
        1,
        referralCaseListItemPage,
        testObject.filter,
        '',
        true,
        caseListFilters,
        2,
      )

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
        2,
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

  describe('generateCohortSelectArgs', () => {
    it('should generate correct select items for cohorts based on API data', () => {
      const testObject = {
        filter: { cohort: undefined } as unknown as CaselistFilter,
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
        caseListFilters,
        2,
      )

      expect(presenter.generateCohortSelectArgs()).toEqual([
        { text: 'Select', value: '' },
        { value: 'General offence', text: 'General offence', selected: false },
        { value: 'General offence - LDC', text: 'General offence - LDC', selected: false },
        { value: 'Sexual offence', text: 'Sexual offence', selected: false },
        { value: 'Sexual offence - LDC', text: 'Sexual offence - LDC', selected: false },
      ])
    })

    it('should mark the selected cohort based on filter.cohort', () => {
      const testObject = {
        filter: { cohort: 'General offence' } as unknown as CaselistFilter,
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
        caseListFilters,
        2,
      )

      expect(presenter.generateCohortSelectArgs()).toEqual([
        { text: 'Select', value: '' },
        { value: 'General offence', text: 'General offence', selected: true },
        { value: 'General offence - LDC', text: 'General offence - LDC', selected: false },
        { value: 'Sexual offence', text: 'Sexual offence', selected: false },
        { value: 'Sexual offence - LDC', text: 'Sexual offence - LDC', selected: false },
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
        2,
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

  describe('getSubNavArgs', () => {
    it('should generate correct sub nav arguments when url params are present', () => {
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
        'crnOrPersonName=&pdu=London&cohort=GENERAL_OFFENCE&status=Awaiting+allocation',
        true,
        TestUtils.createCaseListFilters(),
        2,
      )

      expect(presenter.getSubNavArgs()).toEqual({
        items: [
          {
            text: `Open referrals (100)`,
            href: `/pdu/open-referrals?crnOrPersonName=&pdu=London&cohort=GENERAL_OFFENCE&status=Awaiting+allocation`,
            active: true,
          },
          {
            text: `Closed referrals (2)`,
            href: `/pdu/closed-referrals?crnOrPersonName=&pdu=London&cohort=GENERAL_OFFENCE&status=Awaiting+allocation`,
            active: false,
          },
        ],
      })
    })
    it('should generate correct sub nav arguments when url params undefined', () => {
      const testObject = {
        filter: { pdu: 'PDU1', reportingTeam: ['Team2'] } as CaselistFilter,
      }
      const referralCaseListItem = referralCaseListItemFactory.build()
      const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
        .pageContent([referralCaseListItem])
        .build() as Page<ReferralCaseListItem>
      const presenter = new CaselistPresenter(
        2,
        referralCaseListItemPage,
        testObject.filter,
        undefined,
        true,
        TestUtils.createCaseListFilters(),
        2,
      )

      expect(presenter.getSubNavArgs()).toEqual({
        items: [
          {
            text: `Open referrals (2)`,
            href: `/pdu/open-referrals`,
            active: false,
          },
          {
            text: `Closed referrals (100)`,
            href: `/pdu/closed-referrals`,
            active: true,
          },
        ],
      })
    })
  })
})

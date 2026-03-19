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
        'test location',
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
        'test location',
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
        'test location',
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
        'test location',
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
        'test location',
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
        'test location',
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
        'test location',
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
        'test location',
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

describe('resultsText', () => {
  it('should return blank when there are no results', () => {
    const filter = { status: undefined, cohort: undefined, crnOrPersonName: undefined } as CaselistFilter
    const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
      .pageContent([])
      .build({ totalElements: 0, number: 0, size: 10, numberOfElements: 0 }) as Page<ReferralCaseListItem>
    const presenter = new CaselistPresenter(
      1,
      referralCaseListItemPage,
      filter,
      '',
      true,
      TestUtils.createCaseListFilters(),
      0,
      'test location',
    )

    expect(presenter.resultsText).toBe('')
  })

  it('should show the current page range when results exist', () => {
    const filter = { status: undefined, cohort: undefined, crnOrPersonName: undefined } as CaselistFilter
    const referralCaseListItems = [
      referralCaseListItemFactory.build(),
      referralCaseListItemFactory.build(),
      referralCaseListItemFactory.build(),
    ]
    const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory.pageContent(referralCaseListItems).build({
      totalElements: 23,
      number: 2,
      size: 10,
      numberOfElements: referralCaseListItems.length,
    }) as Page<ReferralCaseListItem>
    const presenter = new CaselistPresenter(
      1,
      referralCaseListItemPage,
      filter,
      '',
      true,
      TestUtils.createCaseListFilters(),
      0,
      'test location',
    )

    expect(presenter.resultsText).toBe(
      'Showing <strong>21</strong> to <strong>23</strong> of <strong>23</strong> results',
    )
  })
})

describe('generateTableRows', () => {
  const caseListFilters = TestUtils.createCaseListFilters()

  it('should generate complete table rows with all columns for a single referral', () => {
    const referralCaseListItem = referralCaseListItemFactory.build({
      referralId: 'REF123',
      personName: 'Jane Doe',
      crn: 'X987654',
      pdu: 'Manchester PDU',
      reportingTeam: 'Team Bravo',
      sentenceEndDate: '2024-06-15',
      sentenceEndDateSource: 'REQUIREMENT',
      cohort: 'GENERAL_OFFENCE',
      hasLdc: false,
      referralStatus: 'Awaiting allocation',
    })
    const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
      .pageContent([referralCaseListItem])
      .build() as Page<ReferralCaseListItem>
    const presenter = new CaselistPresenter(
      1,
      referralCaseListItemPage,
      {} as CaselistFilter,
      '',
      true,
      caseListFilters,
      0,
      'test location',
    )

    const rows = presenter.generateTableRows()
    const sentenceEndDateTimestamp = new Date('15 June 2024').getTime()

    expect(rows).toHaveLength(1)
    expect(rows[0]).toHaveLength(6)
    expect(rows[0][0]).toEqual({
      html: `<a href='/referral-details/REF123/personal-details'>Jane Doe</a><span>X987654</span>`,
      attributes: { 'data-sort-value': 'Jane Doe' },
    })
    expect(rows[0][1]).toEqual({ text: 'Manchester PDU' })
    expect(rows[0][2]).toEqual({ text: 'Team Bravo' })
    expect(rows[0][3]).toEqual({
      html: `15 June 2024 <br> Order end date`,
      attributes: { 'data-sort-value': sentenceEndDateTimestamp },
    })
    expect(rows[0][4]).toEqual({ html: 'General offence' })
    expect(rows[0][5]).toEqual({ text: 'Awaiting allocation' })
  })

  it('should generate correct sentence end date with LICENCE_CONDITION source', () => {
    const referralCaseListItem = referralCaseListItemFactory.build({
      sentenceEndDate: '2024-09-20',
      sentenceEndDateSource: 'LICENCE_CONDITION',
    })
    const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
      .pageContent([referralCaseListItem])
      .build() as Page<ReferralCaseListItem>
    const presenter = new CaselistPresenter(
      1,
      referralCaseListItemPage,
      {} as CaselistFilter,
      '',
      true,
      caseListFilters,
      0,
      'test location',
    )

    const rows = presenter.generateTableRows()
    const sentenceEndDateTimestamp = new Date('20 September 2024').getTime()

    expect(rows[0][3]).toEqual({
      html: `20 September 2024 <br> Licence end date`,
      attributes: { 'data-sort-value': sentenceEndDateTimestamp },
    })
  })

  it('should display LDC badge for cohorts with LDC', () => {
    const generalLdc = referralCaseListItemFactory.build({
      cohort: 'GENERAL_OFFENCE',
      hasLdc: true,
      sentenceEndDate: '2024-06-15',
      sentenceEndDateSource: 'REQUIREMENT',
    })
    const sexualLdc = referralCaseListItemFactory.build({
      cohort: 'SEXUAL_OFFENCE',
      hasLdc: true,
      sentenceEndDate: '2024-06-15',
      sentenceEndDateSource: 'REQUIREMENT',
    })
    const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
      .pageContent([generalLdc, sexualLdc])
      .build() as Page<ReferralCaseListItem>
    const presenter = new CaselistPresenter(
      1,
      referralCaseListItemPage,
      {} as CaselistFilter,
      '',
      true,
      caseListFilters,
      0,
      'test location',
    )

    const rows = presenter.generateTableRows()

    expect(rows[0][4]).toEqual({
      html: 'General offence</br><span class="moj-badge moj-badge--bright-purple">LDC</span>',
    })
    expect(rows[1][4]).toEqual({
      html: 'Sexual offence</br><span class="moj-badge moj-badge--bright-purple">LDC</span>',
    })
  })

  it('should generate multiple rows with correct sort values', () => {
    const referralCaseListItems = [
      referralCaseListItemFactory.build({
        personName: 'Alice Johnson',
        sentenceEndDate: '2024-06-15',
        sentenceEndDateSource: 'REQUIREMENT',
      }),
      referralCaseListItemFactory.build({
        personName: 'Bob Williams',
        sentenceEndDate: '2024-07-20',
        sentenceEndDateSource: 'LICENCE_CONDITION',
      }),
    ]
    const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
      .pageContent(referralCaseListItems)
      .build() as Page<ReferralCaseListItem>
    const presenter = new CaselistPresenter(
      1,
      referralCaseListItemPage,
      {} as CaselistFilter,
      '',
      true,
      caseListFilters,
      0,
      'test location',
    )

    const rows = presenter.generateTableRows()

    expect(rows).toHaveLength(2)
    expect((rows[0][0] as { attributes?: Record<string, string | number> }).attributes?.['data-sort-value']).toBe(
      'Alice Johnson',
    )
    expect((rows[1][0] as { attributes?: Record<string, string | number> }).attributes?.['data-sort-value']).toBe(
      'Bob Williams',
    )
  })

  it('should return empty array when no referrals provided', () => {
    const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
      .pageContent([])
      .build() as Page<ReferralCaseListItem>
    const presenter = new CaselistPresenter(
      1,
      referralCaseListItemPage,
      {} as CaselistFilter,
      '',
      true,
      caseListFilters,
      0,
      'test location',
    )

    const rows = presenter.generateTableRows()

    expect(rows).toHaveLength(0)
  })
})

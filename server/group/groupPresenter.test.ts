import { Group } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import groupsByRegionFactory from '../testutils/factories/groupsByRegionFactory'
import pageFactory from '../testutils/factories/pageFactory'
import GroupFactory from '../testutils/factories/groupFactory'
import GroupPresenter, { GroupListPageSection } from './groupPresenter'
import GroupListFilter from '../groupOverview/groupListFilter'

describe('getSubNavArgs', () => {
  it('should generate correct sub nav arguments when url params are present', () => {
    const groupList = groupsByRegionFactory.build()

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
    )

    expect(presenter.getSubNavArgs()).toEqual({
      items: [
        {
          text: `Not started (100)`,
          href: `/groups/not-started`,
          active: true,
        },
        {
          text: `In progress or completed (10)`,
          href: `/groups/started`,
          active: false,
        },
      ],
    })
  })

  it('should persist groupCode query parameter in sub nav links', () => {
    const groupList = groupsByRegionFactory.build()
    const filter = GroupListFilter.empty()
    filter.groupCode = 'CODE'

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      filter,
      [],
    )

    expect(presenter.filter.groupCode).toBe('CODE')
    expect(presenter.getSubNavArgs()).toEqual({
      items: [
        {
          text: `Not started (100)`,
          href: `/groups/not-started?groupCode=CODE`,
          active: true,
        },
        {
          text: `In progress or completed (10)`,
          href: `/groups/started?groupCode=CODE`,
          active: false,
        },
      ],
    })
  })

  it('should persist groupCode query parameter in sub nav links when on started tab', () => {
    const groupList = groupsByRegionFactory.build()
    const filter = GroupListFilter.empty()
    filter.groupCode = 'CODE'

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.IN_PROGRESS_OR_COMPLETE,
      groupList.otherTabTotal,
      groupList.regionName,
      filter,
      [],
    )

    expect(presenter.getSubNavArgs()).toEqual({
      items: [
        {
          text: `Not started (10)`,
          href: `/groups/not-started?groupCode=CODE`,
          active: false,
        },
        {
          text: `In progress or completed (100)`,
          href: `/groups/started?groupCode=CODE`,
          active: true,
        },
      ],
    })
  })
})

describe(`filter and search query params`, () => {
  it('should show delivery locations when a PDU is selected', () => {
    const groupList = groupsByRegionFactory.build()
    const filter = GroupListFilter.empty()
    filter.pdu = 'Some PDU'

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      filter,
      ['Location 1', 'Location 2'],
    )

    expect(presenter.showDeliveryLocations).toBe(true)
  })

  it('should not show delivery locations when no PDU is selected', () => {
    const groupList = groupsByRegionFactory.build()
    const filter = GroupListFilter.empty()

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      filter,
      [],
    )

    expect(presenter.showDeliveryLocations).toBe(false)
  })
})

describe('groupTableArgs', () => {
  it('should generate correct table rows', () => {
    const groupList = groupsByRegionFactory.build()

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    expect(presenter.groupTableArgs).toEqual({
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      head: [
        {
          text: 'Group code',
          attributes: {
            'aria-sort': 'ascending',
          },
        },
        {
          text: 'Start date',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'PDU',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Delivery location',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Cohort',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Sex',
          attributes: {
            'aria-sort': 'none',
          },
        },
      ],
      rows: [
        [
          {
            html: `<a href='/group/${groupList.pagedGroupData.content[0].id}/waitlist'>ABC1234</a>`,
            attributes: { 'data-sort-value': 'ABC1234' },
          },
          { html: '<span data-sort-value="1704067200000">1 January 2024</span>' },
          { text: `${groupList.pagedGroupData.content[0].pduName}` },
          { text: `${groupList.pagedGroupData.content[0].deliveryLocation}` },
          {
            html: 'General offence',
          },
          { text: 'Male' },
        ],
      ],
    })
  })
})

describe('LDC cohort display', () => {
  it('should display General offence - LDC with badge for GENERAL_LDC cohort', () => {
    const groupList = groupsByRegionFactory.build()
    const ldcGroup = GroupFactory.build({ cohort: 'GENERAL_LDC' })
    groupList.pagedGroupData.content = [ldcGroup]

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    const tableArgs = presenter.groupTableArgs
    expect(tableArgs.rows[0][4]).toEqual({
      html: 'General offence - LDC</br><span class="moj-badge moj-badge--bright-purple">LDC</span>',
    })
  })

  it('should display Sexual offence - LDC with badge for SEXUAL_LDC cohort', () => {
    const groupList = groupsByRegionFactory.build()
    const ldcGroup = GroupFactory.build({ cohort: 'SEXUAL_LDC' })
    groupList.pagedGroupData.content = [ldcGroup]

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    const tableArgs = presenter.groupTableArgs
    expect(tableArgs.rows[0][4]).toEqual({
      html: 'Sexual offence - LDC</br><span class="moj-badge moj-badge--bright-purple">LDC</span>',
    })
  })

  it('should display Sexual offence without badge for SEXUAL cohort', () => {
    const groupList = groupsByRegionFactory.build()
    const sexualGroup = GroupFactory.build({ cohort: 'SEXUAL' })
    groupList.pagedGroupData.content = [sexualGroup]

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    const tableArgs = presenter.groupTableArgs
    expect(tableArgs.rows[0][4]).toEqual({
      html: 'Sexual offence',
    })
  })
})

describe('cohort filter select args', () => {
  it('should include all cohort options including LDC variants', () => {
    const groupList = groupsByRegionFactory.build()
    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    const cohortSelectArgs = presenter.generateCohortSelectArgs()

    expect(cohortSelectArgs).toEqual([
      { text: 'Select', value: '' },
      { value: 'General offence', text: 'General offence', selected: false },
      { value: 'General offence - LDC', text: 'General offence - LDC', selected: false },
      { value: 'Sexual offence', text: 'Sexual offence', selected: false },
      { value: 'Sexual offence - LDC', text: 'Sexual offence - LDC', selected: false },
    ])
  })

  it('should mark the selected cohort option as selected', () => {
    const groupList = groupsByRegionFactory.build()
    const filter = GroupListFilter.empty()
    filter.cohort = 'General offence - LDC'

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      filter,
      [],
      [],
    )

    const cohortSelectArgs = presenter.generateCohortSelectArgs()

    expect(cohortSelectArgs[2]).toEqual({
      value: 'General offence - LDC',
      text: 'General offence - LDC',
      selected: true,
    })
  })
})

describe('resultsText', () => {
  it('should return blank when there are no results', () => {
    const filter = GroupListFilter.empty()
    const pagedGroups: Page<Group> = pageFactory
      .pageContent([])
      .build({ totalElements: 0, number: 0, size: 10, numberOfElements: 0 }) as Page<Group>
    const presenter = new GroupPresenter(pagedGroups, GroupListPageSection.NOT_STARTED, 0, 'Region', filter, [], [])

    expect(presenter.resultsText).toBe('')
  })

  it('should show the current page range when results exist', () => {
    const filter = GroupListFilter.empty()
    const groups = [GroupFactory.build(), GroupFactory.build(), GroupFactory.build()]
    const pagedGroups: Page<Group> = pageFactory
      .pageContent(groups)
      .build({ totalElements: 23, number: 2, size: 10, numberOfElements: groups.length }) as Page<Group>
    const presenter = new GroupPresenter(pagedGroups, GroupListPageSection.NOT_STARTED, 0, 'Region', filter, [], [])

    expect(presenter.resultsText).toBe(
      'Showing <strong>21</strong> to <strong>23</strong> of <strong>23</strong> results',
    )
  })
})

describe('date formatting helpers', () => {
  describe('getGroupDate', () => {
    it('should prioritize earliestStartDate for NOT_STARTED groups', () => {
      const groupList = groupsByRegionFactory.build()
      const group = GroupFactory.build({
        earliestStartDate: '2024-01-15',
        startDate: '2024-02-01',
      })
      groupList.pagedGroupData.content = [group]

      const presenter = new GroupPresenter(
        groupList.pagedGroupData as Page<Group>,
        GroupListPageSection.NOT_STARTED,
        groupList.otherTabTotal,
        groupList.regionName,
        GroupListFilter.empty(),
        [],
        [],
      )

      expect(presenter.getGroupDate(group)).toBe('2024-01-15')
    })

    it('should prioritize startDate for IN_PROGRESS_OR_COMPLETE groups', () => {
      const groupList = groupsByRegionFactory.build()
      const group = GroupFactory.build({
        earliestStartDate: '2024-01-15',
        startDate: '2024-02-01',
      })
      groupList.pagedGroupData.content = [group]

      const presenter = new GroupPresenter(
        groupList.pagedGroupData as Page<Group>,
        GroupListPageSection.IN_PROGRESS_OR_COMPLETE,
        groupList.otherTabTotal,
        groupList.regionName,
        GroupListFilter.empty(),
        [],
        [],
      )

      expect(presenter.getGroupDate(group)).toBe('2024-02-01')
    })

    it('should fallback to startDate when earliestStartDate is null', () => {
      const groupList = groupsByRegionFactory.build()
      const group = GroupFactory.build({
        earliestStartDate: null,
        startDate: '2024-02-01',
      })
      groupList.pagedGroupData.content = [group]

      const presenter = new GroupPresenter(
        groupList.pagedGroupData as Page<Group>,
        GroupListPageSection.NOT_STARTED,
        groupList.otherTabTotal,
        groupList.regionName,
        GroupListFilter.empty(),
        [],
        [],
      )

      expect(presenter.getGroupDate(group)).toBe('2024-02-01')
    })

    it('should return empty string when both dates are null', () => {
      const groupList = groupsByRegionFactory.build()
      const group = GroupFactory.build({
        earliestStartDate: null,
        startDate: null,
      })
      groupList.pagedGroupData.content = [group]

      const presenter = new GroupPresenter(
        groupList.pagedGroupData as Page<Group>,
        GroupListPageSection.NOT_STARTED,
        groupList.otherTabTotal,
        groupList.regionName,
        GroupListFilter.empty(),
        [],
        [],
      )

      expect(presenter.getGroupDate(group)).toBe('')
    })
  })

  describe('getFormattedDateCell', () => {
    it('should return formatted date with sort value', () => {
      const groupList = groupsByRegionFactory.build()
      const group = GroupFactory.build({
        startDate: '2024-01-01',
      })
      groupList.pagedGroupData.content = [group]

      const presenter = new GroupPresenter(
        groupList.pagedGroupData as Page<Group>,
        GroupListPageSection.NOT_STARTED,
        groupList.otherTabTotal,
        groupList.regionName,
        GroupListFilter.empty(),
        [],
        [],
      )

      const dateCell = presenter.getFormattedDateCell(group)
      expect(dateCell).toEqual({
        html: '<span data-sort-value="1704067200000">1 January 2024</span>',
      })
    })

    it('should return empty span when no date is available', () => {
      const groupList = groupsByRegionFactory.build()
      const group = GroupFactory.build({
        startDate: null,
        earliestStartDate: null,
      })
      groupList.pagedGroupData.content = [group]

      const presenter = new GroupPresenter(
        groupList.pagedGroupData as Page<Group>,
        GroupListPageSection.NOT_STARTED,
        groupList.otherTabTotal,
        groupList.regionName,
        GroupListFilter.empty(),
        [],
        [],
      )

      const dateCell = presenter.getFormattedDateCell(group)
      expect(dateCell).toEqual({
        html: '<span data-sort-value=""></span>',
      })
    })
  })
})

describe('sex formatting', () => {
  it('should format MALE correctly', () => {
    const groupList = groupsByRegionFactory.build()
    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    expect(presenter.formatSex('MALE')).toBe('Male')
  })

  it('should format FEMALE correctly', () => {
    const groupList = groupsByRegionFactory.build()
    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    expect(presenter.formatSex('FEMALE')).toBe('Female')
  })

  it('should format MIXED correctly', () => {
    const groupList = groupsByRegionFactory.build()
    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    expect(presenter.formatSex('MIXED')).toBe('Mixed')
  })
})

describe('cohort cell generation', () => {
  it('should generate cohort cell for GENERAL without badge', () => {
    const groupList = groupsByRegionFactory.build()
    const group = GroupFactory.build({ cohort: 'GENERAL' })
    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    expect(presenter.getCohortCell(group)).toEqual({
      html: 'General offence',
    })
  })

  it('should generate cohort cell for GENERAL_LDC with badge', () => {
    const groupList = groupsByRegionFactory.build()
    const group = GroupFactory.build({ cohort: 'GENERAL_LDC' })
    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
      GroupListFilter.empty(),
      [],
      [],
    )

    expect(presenter.getCohortCell(group)).toEqual({
      html: 'General offence - LDC</br><span class="moj-badge moj-badge--bright-purple">LDC</span>',
    })
  })
})

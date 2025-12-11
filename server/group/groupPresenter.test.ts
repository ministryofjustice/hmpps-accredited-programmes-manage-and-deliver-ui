import { Group } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import groupsByRegionFactory from '../testutils/factories/groupsByRegionFactory'
import GroupPresenter, { GroupListPageSection } from './groupPresenter'
import GroupListFilter from '../groupDetails/groupListFilter'

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
          { html: `<a href='/groupDetails/${groupList.pagedGroupData.content[0].id}/waitlist'>ABC1234</a>` },
          { text: '2024-02-01' },
          { text: `${groupList.pagedGroupData.content[0].pduName}` },
          { text: `${groupList.pagedGroupData.content[0].deliveryLocation}` },
          {
            html: 'General offence',
          },
          { text: 'MALE' },
        ],
      ],
    })
  })
})

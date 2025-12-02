import { Group } from '@manage-and-deliver-api'
import { Page } from '../shared/models/pagination'
import groupsByRegionFactory from '../testutils/factories/groupsByRegionFactory'
import GroupPresenter, { GroupListPageSection } from './groupPresenter'

describe('getSubNavArgs', () => {
  it('should generate correct sub nav arguments when url params are present', () => {
    const groupList = groupsByRegionFactory.build()

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
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
})

describe('groupTableArgs', () => {
  it('should generate correct table rows', () => {
    const groupList = groupsByRegionFactory.build()

    const presenter = new GroupPresenter(
      groupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED,
      groupList.otherTabTotal,
      groupList.regionName,
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

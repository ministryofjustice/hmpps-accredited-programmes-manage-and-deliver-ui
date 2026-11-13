import { GroupsByRegion } from '@manage-and-deliver-api'
import { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupsByRegionFactory from '../testutils/factories/groupsByRegionFactory'
import sendAuditEvent from '../services/auditService'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
jest.mock('../services/auditService')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      accreditedProgrammesManageAndDeliverService,
    },
  })
  const groupList: GroupsByRegion = GroupsByRegionFactory.build()
  accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(groupList)
})

describe('GroupController', () => {
  describe.each([
    {
      path: 'not-started-and-in-progress',
      tab: 'NOT_STARTED_OR_IN_PROGRESS',
      dateField: 'earliestPossibleStartDate',
    },
    { path: 'completed', tab: 'COMPLETE', dateField: 'startedAtDate' },
  ])('sorting /groups/$path', ({ path, tab, dateField }) => {
    it.each(
      ['code', 'date', 'probationDeliveryUnitName', 'deliveryLocationName', 'cohort', 'sex'].flatMap(column =>
        ['asc', 'desc'].map(direction => ({ column, direction })),
      ),
    )('preserves $column,$direction sorting in API requests and pagination', async ({ column, direction }) => {
      const field = column === 'date' ? dateField : column
      accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(
        GroupsByRegionFactory.build({ pagedGroupData: { number: 1 } }),
      )
      const sort = `${field},${direction}`
      const response = await request(app).get(`/groups/${path}`).query({ sort, page: 2, pdu: 'PDU1' }).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenLastCalledWith(
        'user1',
        { page: 1, size: 50, sort: [sort] },
        { sort, pdu: ['PDU1'] },
        tab,
      )
      const $ = cheerio.load(response.text)
      const pages = $('.govuk-pagination a')
        .map((_, link) => {
          const params = new URLSearchParams(($(link).attr('href') ?? '').replace(/^\?/, ''))
          expect(params.getAll('sort')).toEqual([sort])
          expect(params.getAll('pdu')).toEqual(['PDU1'])
          return params.get('page')
        })
        .get()
      expect(pages).toEqual(expect.arrayContaining(['1', '3']))
    })

    it.each([
      ['startDate', 'date'],
      ['pdu', 'probationDeliveryUnitName'],
      ['deliveryLocation', 'deliveryLocationName'],
    ])('repairs retained sort links using %s before calling the API', async (oldField, column) => {
      const field = column === 'date' ? dateField : column
      const response = await request(app).get(`/groups/${path}?sort=${oldField},desc`).expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenCalledWith(
        'user1',
        { page: 0, size: 50, sort: [`${field},desc`] },
        { sort: `${field},desc` },
        tab,
      )
      expect(response.text).toContain(`?sort=${field}%2Cdesc&amp;page=2`)
    })

    it.each(['invalid,asc', 'code,invalid', 'code,asc&sort=sex,desc'])(
      'does not forward unsupported sort input %s',
      async sort => {
        await request(app).get(`/groups/${path}?sort=${sort}`).expect(200)

        expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenCalledWith(
          'user1',
          { page: 0, size: 50, sort: ['code,asc'] },
          { sort: 'code,asc' },
          tab,
        )
      },
    )
  })

  describe('GET /groups/not-started-and-in-progress', () => {
    it('should render the not started group list page', async () => {
      return request(app)
        .get('/groups/not-started-and-in-progress')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Building Choices: moderate intensity')
          expect(res.text).toContain('Groups')
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'SEARCH_NOT_STARTED_OR_IN_PROGRESS_GROUP_LIST',
            'user1',
            undefined,
            'NOT_APPLICABLE',
            { filter: {} },
          )
        })
    })

    it('refetches with reset delivery location filters when requested locations are invalid', async () => {
      const groupList: GroupsByRegion = GroupsByRegionFactory.build({ deliveryLocationNames: ['delivery-location-2'] })
      accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(groupList)

      await request(app)
        .get('/groups/not-started-and-in-progress?pdu=PDU3&deliveryLocations=delivery-location-1')
        .expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenCalledTimes(2)
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: ['PDU3'], deliveryLocations: ['delivery-location-1'] }),
        'NOT_STARTED_OR_IN_PROGRESS',
      )
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: ['PDU3'] }),
        'NOT_STARTED_OR_IN_PROGRESS',
      )
    })
    it('filters by multiple PDUs', async () => {
      return request(app)
        .get('/groups/not-started-and-in-progress?pdu=PDU1&pdu=PDU2')
        .expect(200)
        .then(() => {
          expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ page: 0, size: 50 }),
            expect.objectContaining({ pdu: ['PDU1', 'PDU2'] }),
            'NOT_STARTED_OR_IN_PROGRESS',
          )
        })
    })
  })

  describe('GET /groups/completed', () => {
    it('should render the completed group list page', async () => {
      return request(app)
        .get('/groups/completed')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Building Choices: moderate intensity')
          expect(res.text).toContain('Groups')
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'SEARCH_COMPLETED_GROUP_LIST',
            'user1',
            undefined,
            'NOT_APPLICABLE',
            { filter: {} },
          )
        })
    })

    it('refetches with reset delivery location filters when requested locations are invalid', async () => {
      const groupList: GroupsByRegion = GroupsByRegionFactory.build({ deliveryLocationNames: ['delivery-location-2'] })
      accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(groupList)

      await request(app).get('/groups/completed?pdu=PDU3&deliveryLocations=delivery-location-1').expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenCalledTimes(2)
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: ['PDU3'], deliveryLocations: ['delivery-location-1'] }),
        'COMPLETE',
      )
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: ['PDU3'] }),
        'COMPLETE',
      )
    })
  })
})

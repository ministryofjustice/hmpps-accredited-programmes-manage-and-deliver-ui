import { Request } from 'express'
import GroupListFilter from './groupListFilter'

describe(GroupListFilter, () => {
  describe('.fromRequest', () => {
    it('creates a filter from the request’s query params', () => {
      const query = {
        cohort: 'SEXUAL_OFFENCE',
        groupCode: 'CODE',
        pdu: 'PDU3',
        deliveryLocations: ['delivery-location-1'],
        sex: 'Male',
      }

      const filter = GroupListFilter.fromRequest({ query } as unknown as Request)

      expect(filter.cohort).toEqual('SEXUAL_OFFENCE')
      expect(filter.groupCode).toEqual('CODE')
      expect(filter.pdu).toEqual('PDU3')
      expect(filter.deliveryLocations).toEqual(['delivery-location-1'])
      expect(filter.sex).toEqual('Male')
    })
  })

  describe('params', () => {
    describe('No params', () => {
      it('correctly expects fields to be undefined if no type passed', () => {
        const filter = new GroupListFilter()
        expect(filter.cohort).toBeUndefined()
        expect(filter.groupCode).toBeUndefined()
        expect(filter.pdu).toBeUndefined()
        expect(filter.deliveryLocations).toBeUndefined()
        expect(filter.sex).toBeUndefined()
      })
    })

    describe('sex', () => {
      it('correctly sets sex if only one type is passed', () => {
        const filter = new GroupListFilter()
        filter.sex = 'Male'
        expect(filter.params.sex).toEqual('Male')
      })

      it('correctly sets cohort if only one type is passed', () => {
        const filter = new GroupListFilter()
        filter.sex = 'Female'
        expect(filter.params.sex).toEqual('Female')
      })
    })

    describe('pdu and reporting team', () => {
      it('correctly sets pdu and reporting team ', () => {
        const filter = new GroupListFilter()
        filter.pdu = 'PDU1'
        filter.deliveryLocations = ['location-1', 'location-2']

        expect(filter.params.pdu).toEqual('PDU1')
        expect(filter.params.deliveryLocations).toEqual(['location-1', 'location-2'])
      })
      it('correctly sets pdu', () => {
        const filter = new GroupListFilter()
        filter.pdu = 'PDU1'

        expect(filter.params.pdu).toEqual('PDU1')
        expect(filter.params.deliveryLocations).toEqual(undefined)
      })
    })
  })
})

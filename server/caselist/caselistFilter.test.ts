import { Request } from 'express'
import CaselistFilter from './caselistFilter'
import TestUtils from '../testutils/testUtils'

describe(CaselistFilter, () => {
  describe('.fromRequest', () => {
    it('creates a filter from the request’s query params', () => {
      const query = {
        status: 'REFERRAL_SUBMITTED',
        cohort: 'SEXUAL_OFFENCE',
        crnOrPersonName: 'Building',
        pdu: 'PDU3',
        reportingTeam: ['Team5'],
      }

      const filter = CaselistFilter.fromRequest(
        { query } as unknown as Request,
        TestUtils.createCaseListFilters().locationFilters,
      )

      expect(filter.status).toEqual('REFERRAL_SUBMITTED')
      expect(filter.cohort).toEqual('SEXUAL_OFFENCE')
      expect(filter.crnOrPersonName).toEqual('Building')
      expect(filter.pdu).toEqual('PDU3')
      expect(filter.reportingTeam).toEqual(['Team5'])
    })
  })

  describe('params', () => {
    describe('No params', () => {
      it('correctly expects fields to be undefined if no type passed', () => {
        const filter = new CaselistFilter()
        expect(filter.status).toBeUndefined()
        expect(filter.cohort).toBeUndefined()
        expect(filter.crnOrPersonName).toBeUndefined()
        expect(filter.pdu).toBeUndefined()
        expect(filter.reportingTeam).toBeUndefined()
      })
    })

    describe('referralStatus', () => {
      it('correctly sets referralStatus if only one type is passed', () => {
        const filter = new CaselistFilter()
        filter.status = 'ON_HOLD_REFERRAL_SUBMITTED'
        expect(filter.params.status).toEqual('ON_HOLD_REFERRAL_SUBMITTED')
      })

      it('correctly sets cohort if only one type is passed', () => {
        const filter = new CaselistFilter()
        filter.cohort = 'SEXUAL_OFFENCE'
        expect(filter.params.cohort).toEqual('SEXUAL_OFFENCE')
      })
    })

    describe('crnOrPersonName', () => {
      it('correctly sets crnOrPersonName ', () => {
        const filter = new CaselistFilter()
        filter.crnOrPersonName = 'Hello'

        expect(filter.params.crnOrPersonName).toEqual('Hello')
      })
    })

    describe('pdu and reporting team', () => {
      it('correctly sets pdu and reporting team ', () => {
        const filter = new CaselistFilter()
        filter.pdu = 'PDU1'
        filter.reportingTeam = ['Team1', 'Team2']

        expect(filter.params.pdu).toEqual('PDU1')
        expect(filter.params.reportingTeam).toEqual(['Team1', 'Team2'])
      })
      it('correctly sets pdu', () => {
        const filter = new CaselistFilter()
        filter.pdu = 'PDU1'

        expect(filter.params.pdu).toEqual('PDU1')
        expect(filter.params.reportingTeam).toEqual(undefined)
      })
    })
  })
})

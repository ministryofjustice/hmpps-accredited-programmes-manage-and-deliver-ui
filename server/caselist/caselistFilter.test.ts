import { Request } from 'express'
import CaselistFilter from './caselistFilter'

describe(CaselistFilter, () => {
  describe('.fromRequest', () => {
    it('creates a filter from the request’s query params', () => {
      const query = {
        status: 'REFERRAL_SUBMITTED',
        cohort: 'SEXUAL_OFFENCE',
        crnOrPersonName: 'Building',
      }

      const filter = CaselistFilter.fromRequest({ query } as unknown as Request)

      expect(filter.status).toEqual('REFERRAL_SUBMITTED')
      expect(filter.cohort).toEqual('SEXUAL_OFFENCE')
      expect(filter.crnOrPersonName).toEqual('Building')
    })
  })

  describe('params', () => {
    describe('No params', () => {
      it('correctly expects fields to be undefined if no type passed', () => {
        const filter = new CaselistFilter()
        expect(filter.status).toBeUndefined()
        expect(filter.cohort).toBeUndefined()
        expect(filter.crnOrPersonName).toBeUndefined()
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
  })
})

import { Request } from 'express'
import CaselistFilter from './caselistFilter'

describe(CaselistFilter, () => {
  describe('.fromRequest', () => {
    it('creates a filter from the request’s query params', () => {
      const query = {
        referralStatus: 'referral-submitted',
        cohort: 'sexual-offence',
        crnOrPersonName: 'Building',
      }

      const filter = CaselistFilter.fromRequest({ query } as unknown as Request)

      expect(filter.referralStatus).toEqual('referral-submitted')
      expect(filter.cohort).toEqual('sexual-offence')
      expect(filter.crnOrPersonName).toEqual('Building')
    })
  })

  describe('params', () => {
    describe('No params', () => {
      it('correctly expects fields to be undefined if no type passed', () => {
        const filter = new CaselistFilter()
        expect(filter.referralStatus).toBeUndefined()
        expect(filter.cohort).toBeUndefined()
        expect(filter.crnOrPersonName).toBeUndefined()
      })
    })

    describe('referralStatus', () => {
      it('correctly sets referralStatus if only one type is passed', () => {
        const filter = new CaselistFilter()
        filter.referralStatus = 'referral-submitted-hold'

        expect(filter.params.referralStatus).toEqual('referral-submitted-hold')
      })

      it('correctly sets cohort if only one type is passed', () => {
        const filter = new CaselistFilter()
        filter.cohort = 'sexual-offence'
        expect(filter.params.cohort).toEqual('sexual-offence')
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

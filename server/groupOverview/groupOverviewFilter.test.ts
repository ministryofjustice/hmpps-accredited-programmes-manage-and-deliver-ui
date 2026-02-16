import { Request } from 'express'
import GroupDetailFilter from './groupOverviewFilter'

describe('GroupDetailFilter', () => {
  describe('.fromRequest', () => {
    it("creates a filter from the request's query params", () => {
      const query = {
        cohort: 'SEXUAL_OFFENCE',
        nameOrCRN: 'John Doe',
        pdu: 'PDU3',
        reportingTeam: ['Team5'],
        sex: 'Male',
      }

      const filter = GroupDetailFilter.fromRequest({ query } as unknown as Request)

      expect(filter.cohort).toEqual('SEXUAL_OFFENCE')
      expect(filter.nameOrCRN).toEqual('John Doe')
      expect(filter.pdu).toEqual('PDU3')
      expect(filter.reportingTeam).toEqual(['Team5'])
      expect(filter.sex).toEqual('Male')
    })

    it('converts a single reportingTeam string to an array', () => {
      const query = {
        reportingTeam: 'Team1',
      }

      const filter = GroupDetailFilter.fromRequest({ query } as unknown as Request)

      expect(filter.reportingTeam).toEqual(['Team1'])
    })

    it('handles multiple reportingTeam values', () => {
      const query = {
        reportingTeam: ['Team1', 'Team2', 'Team3'],
      }

      const filter = GroupDetailFilter.fromRequest({ query } as unknown as Request)

      expect(filter.reportingTeam).toEqual(['Team1', 'Team2', 'Team3'])
    })
  })

  describe('params', () => {
    describe('No params', () => {
      it('correctly expects fields to be undefined if no values passed', () => {
        const filter = new GroupDetailFilter()
        expect(filter.cohort).toBeUndefined()
        expect(filter.nameOrCRN).toBeUndefined()
        expect(filter.pdu).toBeUndefined()
        expect(filter.reportingTeam).toBeUndefined()
        expect(filter.sex).toBeUndefined()
      })

      it('returns empty params object when no fields are set', () => {
        const filter = new GroupDetailFilter()
        expect(filter.params).toEqual({})
      })
    })

    describe('sex', () => {
      it('correctly sets sex if only one type is passed', () => {
        const filter = new GroupDetailFilter()
        filter.sex = 'Male'
        expect(filter.params.sex).toEqual('Male')
      })

      it('correctly sets sex to Female', () => {
        const filter = new GroupDetailFilter()
        filter.sex = 'Female'
        expect(filter.params.sex).toEqual('Female')
      })
    })

    describe('cohort', () => {
      it('correctly sets cohort', () => {
        const filter = new GroupDetailFilter()
        filter.cohort = 'Sexual offence'
        expect(filter.params.cohort).toEqual('Sexual offence')
      })
    })

    describe('nameOrCRN', () => {
      it('correctly sets nameOrCRN and trims whitespace', () => {
        const filter = new GroupDetailFilter()
        filter.nameOrCRN = '  John Doe  '
        expect(filter.params.nameOrCRN).toEqual('John Doe')
      })

      it('excludes nameOrCRN from params when empty string', () => {
        const filter = new GroupDetailFilter()
        filter.nameOrCRN = '   '
        expect(filter.params.nameOrCRN).toBeUndefined()
      })
    })

    describe('pdu and reporting team', () => {
      it('correctly sets pdu and reporting team', () => {
        const filter = new GroupDetailFilter()
        filter.pdu = 'PDU1'
        filter.reportingTeam = ['Team1', 'Team2']

        expect(filter.params.pdu).toEqual('PDU1')
        expect(filter.params.reportingTeam).toEqual(['Team1', 'Team2'])
      })

      it('correctly sets pdu without reporting team', () => {
        const filter = new GroupDetailFilter()
        filter.pdu = 'PDU1'

        expect(filter.params.pdu).toEqual('PDU1')
        expect(filter.params.reportingTeam).toEqual(undefined)
      })

      it('correctly sets reporting team without pdu', () => {
        const filter = new GroupDetailFilter()
        filter.reportingTeam = ['Team1']

        expect(filter.params.reportingTeam).toEqual(['Team1'])
        expect(filter.params.pdu).toEqual(undefined)
      })
    })

    describe('empty', () => {
      it('creates an empty filter', () => {
        const filter = GroupDetailFilter.empty()

        expect(filter.cohort).toBeUndefined()
        expect(filter.nameOrCRN).toBeUndefined()
        expect(filter.pdu).toBeUndefined()
        expect(filter.reportingTeam).toBeUndefined()
        expect(filter.sex).toBeUndefined()
      })
    })
  })
})

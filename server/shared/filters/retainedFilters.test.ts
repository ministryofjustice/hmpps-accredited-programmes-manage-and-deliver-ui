import { Request } from 'express'
import { SessionData } from 'express-session'
import RetainedFilters from './retainedFilters'

const buildRequest = (originalUrl: string, session: Partial<SessionData> = {}, method = 'GET'): Request => {
  const [, queryString = ''] = originalUrl.split('?')
  const query: Record<string, string> = {}
  if (originalUrl.includes('?')) {
    new URLSearchParams(queryString).forEach((value, key) => {
      query[key] = value
    })
  }
  return { originalUrl, method, query, session } as unknown as Request
}

describe('RetainedFilters', () => {
  const retainedFilters = new RetainedFilters('caselist')

  let dateSpy: jest.SpyInstance

  const setToday = (isoDate: string) => {
    dateSpy = jest.spyOn(Date, 'now').mockReturnValue(new Date(`${isoDate}T10:00:00`).getTime())
  }

  afterEach(() => {
    dateSpy?.mockRestore()
  })

  describe('persist', () => {
    it('stores the applied filter query string with the current day', () => {
      setToday('2026-01-15')
      const req = buildRequest('/region/open-referrals?status=Breach')

      retainedFilters.persist(req)

      expect(req.session.retainedFilters?.caselist).toEqual({ params: 'status=Breach', date: '2026-01-15' })
    })

    it('does not persist paginated requests', () => {
      setToday('2026-01-15')
      const req = buildRequest('/region/open-referrals?status=Breach&page=2')

      retainedFilters.persist(req)

      expect(req.session.retainedFilters).toBeUndefined()
    })

    it('does not persist requests without a query string', () => {
      setToday('2026-01-15')
      const req = buildRequest('/region/open-referrals')

      retainedFilters.persist(req)

      expect(req.session.retainedFilters).toBeUndefined()
    })

    it('does not persist non-GET requests', () => {
      setToday('2026-01-15')
      const req = buildRequest('/region/open-referrals?status=Breach', {}, 'POST')

      retainedFilters.persist(req)

      expect(req.session.retainedFilters).toBeUndefined()
    })

    it('only affects its own page key', () => {
      setToday('2026-01-15')
      const session: Partial<SessionData> = { retainedFilters: { groups: { params: 'cohort=X', date: '2026-01-15' } } }
      const req = buildRequest('/region/open-referrals?status=Breach', session)

      retainedFilters.persist(req)

      expect(req.session.retainedFilters?.groups).toEqual({ params: 'cohort=X', date: '2026-01-15' })
      expect(req.session.retainedFilters?.caselist).toEqual({ params: 'status=Breach', date: '2026-01-15' })
    })
  })

  describe('restoreRedirectUrl', () => {
    it('restores same-day filters on a fresh navigation', () => {
      setToday('2026-01-15')
      const session: Partial<SessionData> = {
        retainedFilters: { caselist: { params: 'status=Breach', date: '2026-01-15' } },
      }
      const req = buildRequest('/region/open-referrals', session)

      expect(retainedFilters.restoreRedirectUrl(req)).toBe('/region/open-referrals?status=Breach')
    })

    it('restores to the current path (so each tab/group keeps its own url)', () => {
      setToday('2026-01-15')
      const session: Partial<SessionData> = {
        retainedFilters: { caselist: { params: 'status=Breach', date: '2026-01-15' } },
      }
      const req = buildRequest('/region/closed-referrals', session)

      expect(retainedFilters.restoreRedirectUrl(req)).toBe('/region/closed-referrals?status=Breach')
    })

    it('does not restore when the request already has a query string', () => {
      setToday('2026-01-15')
      const session: Partial<SessionData> = {
        retainedFilters: { caselist: { params: 'status=Breach', date: '2026-01-15' } },
      }
      const req = buildRequest('/region/open-referrals?cohort=X', session)

      expect(retainedFilters.restoreRedirectUrl(req)).toBeNull()
    })

    it('discards and does not restore filters retained on a previous day', () => {
      setToday('2026-01-16')
      const session: Partial<SessionData> = {
        retainedFilters: { caselist: { params: 'status=Breach', date: '2026-01-15' } },
      }
      const req = buildRequest('/region/open-referrals', session)

      expect(retainedFilters.restoreRedirectUrl(req)).toBeNull()
      expect(req.session.retainedFilters?.caselist).toBeUndefined()
    })

    it('does not restore when nothing is retained', () => {
      setToday('2026-01-15')
      const req = buildRequest('/region/open-referrals')

      expect(retainedFilters.restoreRedirectUrl(req)).toBeNull()
    })

    it('does not restore when the retained filters are empty (cleared)', () => {
      setToday('2026-01-15')
      const session: Partial<SessionData> = {
        retainedFilters: { caselist: { params: '', date: '2026-01-15' } },
      }
      const req = buildRequest('/region/open-referrals', session)

      expect(retainedFilters.restoreRedirectUrl(req)).toBeNull()
    })
  })

  describe('clearRedirectPath', () => {
    it('clears the retained filters and redirects to the bare path', () => {
      const session: Partial<SessionData> = {
        retainedFilters: { caselist: { params: 'status=Breach', date: '2026-01-15' } },
      }
      const req = buildRequest('/region/open-referrals?clearFilters=true', session)

      expect(retainedFilters.clearRedirectPath(req)).toBe('/region/open-referrals')
      expect(req.session.retainedFilters?.caselist).toBeUndefined()
    })

    it('returns null when clearFilters is not requested', () => {
      const req = buildRequest('/region/open-referrals?status=Breach')

      expect(retainedFilters.clearRedirectPath(req)).toBeNull()
    })
  })
})

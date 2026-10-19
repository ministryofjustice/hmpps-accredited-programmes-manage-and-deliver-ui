import { Request } from 'express'

// Retained filter selections for a list page, scoped to a working day. `date` is the local calendar
// day (YYYY-MM-DD) the filters were applied; `params` is the query string to restore.
export interface RetainedFilterState {
  params?: string
  date?: string
}

// The list pages that retain their filter selections. Extend this union to add a new page.
export type RetainedFilterPage = 'caselist' | 'groups' | 'waitlist'

/**
 * Retains a list page's applied filter selections in the user's session for the rest of the
 * day (local calendar day). Filters are stored as the page's query string, so restoring them is a
 * redirect to the same page carrying that query string - reusing the page's existing query-driven
 * filtering, pagination and tab navigation.
 */
export default class RetainedFilters {
  constructor(private readonly page: RetainedFilterPage) {}

  // Local calendar day (YYYY-MM-DD) used to scope retained filters to the current working day.
  private static today(): string {
    const now = new Date(Date.now())
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  private static basePath(req: Request): string {
    return req.originalUrl.split('?')[0]
  }

  private static hasQueryString(req: Request): boolean {
    return req.originalUrl.includes('?')
  }

  private read(req: Request): RetainedFilterState | undefined {
    return req.session.retainedFilters?.[this.page]
  }

  private write(req: Request, value: RetainedFilterState | undefined): void {
    if (!req.session.retainedFilters) {
      req.session.retainedFilters = {}
    }
    req.session.retainedFilters[this.page] = value
  }

  /**
   * Handles the "Clear filters" link (?clearFilters=true) by discarding the retained selections for
   * the day. Returns the page path to redirect to, or null when clearing was not requested.
   */
  clearRedirectPath(req: Request): string | null {
    if (req.method !== 'GET' || req.query.clearFilters === undefined) {
      return null
    }
    this.write(req, undefined)
    return RetainedFilters.basePath(req)
  }

  /**
   * On a fresh navigation (no query string) restores the filters retained earlier in the same
   * working day. Returns the redirect url carrying the stored query string, or null when there is
   * nothing to restore. Filters retained on a previous day are discarded.
   */
  restoreRedirectUrl(req: Request): string | null {
    if (req.method !== 'GET' || RetainedFilters.hasQueryString(req)) {
      return null
    }
    const retained = this.read(req)
    if (!retained || retained.date !== RetainedFilters.today()) {
      if (retained) {
        this.write(req, undefined)
      }
      return null
    }
    return retained.params ? `${RetainedFilters.basePath(req)}?${retained.params}` : null
  }

  /**
   * Persists the applied filters for the rest of the working day. Only runs for non-paginated GET
   * requests that carry a query string, i.e. an explicit filter interaction.
   */
  persist(req: Request): void {
    if (req.method !== 'GET' || req.query.page !== undefined || !RetainedFilters.hasQueryString(req)) {
      return
    }
    this.write(req, { params: req.originalUrl.split('?').pop(), date: RetainedFilters.today() })
  }
}

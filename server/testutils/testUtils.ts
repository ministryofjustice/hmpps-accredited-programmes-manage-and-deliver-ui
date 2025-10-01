import { CaseListFilterValues } from '@manage-and-deliver-api'
import { Request } from 'express'
import { SessionData } from 'express-session'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import type { Services } from '../services'
import { SummaryListItem, SummaryListItemContent, SummaryListItemContentWithLdc } from '../utils/summaryList'

export default class TestUtils {
  static linesForKey(
    key: string,
    list: () => SummaryListItem[],
  ): SummaryListItemContent[] | SummaryListItemContentWithLdc[] | null {
    const items = list()
    const item = items.find(anItem => anItem.key === key)
    return item?.lines ?? null
  }

  static createRequest = (body: Record<string, unknown>): Request => {
    return { body } as Request
  }

  static createRequestWithSession = (body: Record<string, unknown>, sessionData: Partial<SessionData>): Request => {
    return { body, session: { ...sessionData } } as Request
  }

  static createTestAppWithSession(sessionData: Partial<SessionData>, services: Partial<Services>) {
    return appWithAllRoutes({
      services: {
        ...services,
      },
      sessionData: {
        ...sessionData,
      } as SessionData,
    })
  }

  static createCaseListFilters = (): CaseListFilterValues => ({
    statusFilters: {
      open: [
        'Awaiting allocation',
        'Awaiting assessment',
        'Breach (non-attendance)',
        'Deferred',
        'Deprioritised',
        'On programme',
        'Recall',
        'Return to court',
        'Scheduled',
        'Suitable but not ready',
      ],
      closed: ['Programme complete', 'Withdrawn'],
    },
    otherReferralsCount: 1,
  })
}

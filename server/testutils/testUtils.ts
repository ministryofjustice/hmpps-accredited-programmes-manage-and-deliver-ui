import { Request } from 'express'
import { SessionData } from 'express-session'
import { SummaryListItem, SummaryListItemContent } from '../utils/summaryList'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import type { Services } from '../services'

export default class TestUtils {
  static linesForKey(key: string, list: () => SummaryListItem[]): SummaryListItemContent[] | null {
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
}

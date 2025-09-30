import { CaseListFilters } from '@manage-and-deliver-api'
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

  static createCaseListFilters = (): CaseListFilters => ({
    statusFilters: {
      open: [
        {
          value: 'Awaiting allocation',
          text: 'Awaiting allocation',
        },
        {
          value: 'Awaiting assessment',
          text: 'Awaiting assessment',
        },
        {
          value: 'Breach (non-attendance)',
          text: 'Breach (non-attendance)',
        },
        {
          value: 'Deferred',
          text: 'Deferred',
        },
        {
          value: 'Deprioritised',
          text: 'Deprioritised',
        },
        {
          value: 'On programme',
          text: 'On programme',
        },
        {
          value: 'Recall',
          text: 'Recall',
        },
        {
          value: 'Return to court',
          text: 'Return to court',
        },
        {
          value: 'Scheduled',
          text: 'Scheduled',
        },
        {
          value: 'Suitable but not ready',
          text: 'Suitable but not ready',
        },
      ],
      closed: [
        {
          value: 'Programme complete',
          text: 'Programme complete',
        },
        {
          value: 'Withdrawn',
          text: 'Withdrawn',
        },
      ],
    },
  })
}

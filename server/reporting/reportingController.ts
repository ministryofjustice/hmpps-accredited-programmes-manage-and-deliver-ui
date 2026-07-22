import { Request, Response } from 'express'

import logger from '../../logger'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'

export default class ReportingController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  private static hasValidDateTimeString(value: unknown): value is string {
    if (typeof value !== 'string') {
      return false
    }

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
      return false
    }

    // Ensure the parsed value can be serialised as an ISO date string.
    parsedDate.toISOString()
    return true
  }

  private static hasValidDateString(value: unknown): value is string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false
    }

    const parsedDate = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(value)
  }

  private static readOptionalStringQueryParam(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined
  }

  private static logReportRequest(req: Request, reportName: string, query: Record<string, string | undefined>): void {
    logger.info(
      {
        username: req.user.username,
        requestId: req.id,
        reportName,
        query,
      },
      '[ReportingController] Report download requested',
    )
  }

  private static sendCsv(res: Response, csv: string, headers: { [key: string]: string }): void {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })
    res.send(csv)
  }

  async downloadGroupSizeReport(req: Request, res: Response): Promise<void> {
    const { groupStartedSince } = req.query

    if (!ReportingController.hasValidDateTimeString(groupStartedSince)) {
      res.status(400).send('groupStartedSince must be a valid date-time string')
      return
    }

    const { username } = req.user
    ReportingController.logReportRequest(req, 'group-size', { groupStartedSince })

    await sendAuditEvent('VIEW_GROUP_SIZE_REPORT', username, undefined, 'NOT_APPLICABLE', { groupStartedSince })

    const { csv, headers } = await this.accreditedProgrammesManageAndDeliverService.getGroupSizeReport(
      username,
      groupStartedSince,
    )

    ReportingController.sendCsv(res, csv, headers)
  }

  async downloadDosageReport(req: Request, res: Response): Promise<void> {
    const referralsCreatedSince = ReportingController.readOptionalStringQueryParam(req.query.referralsCreatedSince)
    const referralsCompletedAfter = ReportingController.readOptionalStringQueryParam(req.query.referralsCompletedAfter)
    const query: { referralsCreatedSince?: string; referralsCompletedAfter?: string } = {}

    if (referralsCreatedSince !== undefined) {
      if (!ReportingController.hasValidDateString(referralsCreatedSince)) {
        res.status(400).send('referralsCreatedSince must be a valid date string in YYYY-MM-DD format')
        return
      }
      query.referralsCreatedSince = referralsCreatedSince
    }

    if (referralsCompletedAfter !== undefined) {
      if (!ReportingController.hasValidDateString(referralsCompletedAfter)) {
        res.status(400).send('referralsCompletedAfter must be a valid date string in YYYY-MM-DD format')
        return
      }
      query.referralsCompletedAfter = referralsCompletedAfter
    }

    if (!query.referralsCreatedSince && !query.referralsCompletedAfter) {
      res.status(400).send('At least one of referralsCreatedSince or referralsCompletedAfter must be provided')
      return
    }

    const { username } = req.user
    ReportingController.logReportRequest(req, 'dosage', query)

    await sendAuditEvent('VIEW_DOSAGE_REPORT', username, undefined, 'NOT_APPLICABLE', {
      reportName: 'dosage',
      query,
    })

    const { csv, headers } = await this.accreditedProgrammesManageAndDeliverService.getDosageReport(username, query)

    ReportingController.sendCsv(res, csv, headers)
  }

  async downloadSessionRateReport(req: Request, res: Response): Promise<void> {
    const groupsFinishedAfter = ReportingController.readOptionalStringQueryParam(req.query.groupsFinishedAfter)
    const groupsStartedAfter = ReportingController.readOptionalStringQueryParam(req.query.groupsStartedAfter)
    const query: { groupsFinishedAfter?: string; groupsStartedAfter?: string } = {}

    if (groupsFinishedAfter !== undefined) {
      if (!ReportingController.hasValidDateString(groupsFinishedAfter)) {
        res.status(400).send('groupsFinishedAfter must be a valid date string in YYYY-MM-DD format')
        return
      }
      query.groupsFinishedAfter = groupsFinishedAfter
    }

    if (groupsStartedAfter !== undefined) {
      if (!ReportingController.hasValidDateString(groupsStartedAfter)) {
        res.status(400).send('groupsStartedAfter must be a valid date string in YYYY-MM-DD format')
        return
      }
      query.groupsStartedAfter = groupsStartedAfter
    }

    if (!query.groupsFinishedAfter && !query.groupsStartedAfter) {
      res.status(400).send('At least one of groupsFinishedAfter or groupsStartedAfter must be provided')
      return
    }

    const { username } = req.user
    ReportingController.logReportRequest(req, 'session-rate', query)

    await sendAuditEvent('VIEW_SESSION_RATE_REPORT', username, undefined, 'NOT_APPLICABLE', {
      reportName: 'session-rate',
      query,
    })

    const { csv, headers } = await this.accreditedProgrammesManageAndDeliverService.getSessionRateReport(
      username,
      query,
    )

    ReportingController.sendCsv(res, csv, headers)
  }

  async downloadFacilitatorContinuityReport(req: Request, res: Response): Promise<void> {
    const groupsCreatedSince = ReportingController.readOptionalStringQueryParam(req.query.groupsCreatedSince)
    const firstSessionAtOrAfter = ReportingController.readOptionalStringQueryParam(req.query.firstSessionAtOrAfter)
    const lastSessionAtOrBefore = ReportingController.readOptionalStringQueryParam(req.query.lastSessionAtOrBefore)
    const query: {
      groupsCreatedSince?: string
      firstSessionAtOrAfter?: string
      lastSessionAtOrBefore?: string
    } = {}

    if (groupsCreatedSince !== undefined) {
      if (!ReportingController.hasValidDateTimeString(groupsCreatedSince)) {
        res.status(400).send('groupsCreatedSince must be a valid date-time string')
        return
      }
      query.groupsCreatedSince = groupsCreatedSince
    }

    if (firstSessionAtOrAfter !== undefined) {
      if (!ReportingController.hasValidDateTimeString(firstSessionAtOrAfter)) {
        res.status(400).send('firstSessionAtOrAfter must be a valid date-time string')
        return
      }
      query.firstSessionAtOrAfter = firstSessionAtOrAfter
    }

    if (lastSessionAtOrBefore !== undefined) {
      if (!ReportingController.hasValidDateTimeString(lastSessionAtOrBefore)) {
        res.status(400).send('lastSessionAtOrBefore must be a valid date-time string')
        return
      }
      query.lastSessionAtOrBefore = lastSessionAtOrBefore
    }

    if (!query.groupsCreatedSince && !query.firstSessionAtOrAfter && !query.lastSessionAtOrBefore) {
      res.status(400).send('At least one facilitator continuity filter query parameter must be provided')
      return
    }

    const { username } = req.user
    ReportingController.logReportRequest(req, 'facilitator-continuity', query)

    await sendAuditEvent('VIEW_FACILITATOR_CONTINUITY_REPORT', username, undefined, 'NOT_APPLICABLE', {
      reportName: 'facilitator-continuity',
      query,
    })

    const { csv, headers } = await this.accreditedProgrammesManageAndDeliverService.getFacilitatorContinuityReport(
      username,
      query,
    )

    ReportingController.sendCsv(res, csv, headers)
  }
}

import { Request, Response } from 'express'

import logger from '../../logger'
import AccreditedProgrammesManageAndDeliverService, {
  CsvReport,
  ReportQuery,
} from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'

type GetReport = (username: Express.User['username'], query: ReportQuery) => Promise<CsvReport>

export default class ReportingController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async downloadGroupSizeReport(req: Request, res: Response): Promise<void> {
    await this.downloadReport(req, res, 'group-size', 'VIEW_GROUP_SIZE_REPORT', (username, query) =>
      this.accreditedProgrammesManageAndDeliverService.getGroupSizeReport(username, query),
    )
  }

  async downloadDosageReport(req: Request, res: Response): Promise<void> {
    await this.downloadReport(req, res, 'dosage', 'VIEW_DOSAGE_REPORT', (username, query) =>
      this.accreditedProgrammesManageAndDeliverService.getDosageReport(username, query),
    )
  }

  async downloadSessionRateReport(req: Request, res: Response): Promise<void> {
    await this.downloadReport(req, res, 'session-rate', 'VIEW_SESSION_RATE_REPORT', (username, query) =>
      this.accreditedProgrammesManageAndDeliverService.getSessionRateReport(username, query),
    )
  }

  async downloadFacilitatorContinuityReport(req: Request, res: Response): Promise<void> {
    await this.downloadReport(
      req,
      res,
      'facilitator-continuity',
      'VIEW_FACILITATOR_CONTINUITY_REPORT',
      (username, query) =>
        this.accreditedProgrammesManageAndDeliverService.getFacilitatorContinuityReport(username, query),
    )
  }

  private async downloadReport(
    req: Request,
    res: Response,
    reportName: string,
    auditAction: string,
    getReport: GetReport,
  ): Promise<void> {
    const { startDate, endDate, region = '' } = req.query

    if (!ReportingController.isDateString(startDate) || !ReportingController.isDateString(endDate)) {
      res
        .status(400)
        .send(
          'startDate and endDate must both be valid dates in YYYY-MM-DD format. If you used a saved link or an older version of the reporting URL generator, get a new link from the latest version.',
        )
      return
    }

    if (endDate < startDate) {
      res.status(400).send('endDate must be the same as or after startDate')
      return
    }

    // A repeated region would otherwise be dropped, returning national data in place of the regions asked for
    if (typeof region !== 'string') {
      res.status(400).send('Only one region can be provided')
      return
    }

    const query: ReportQuery = { startDate, endDate, ...(region ? { region } : {}) }
    const { username } = req.user

    logger.info({ username, requestId: req.id, reportName, query }, '[ReportingController] Report download requested')
    await sendAuditEvent(auditAction, username, undefined, 'NOT_APPLICABLE', { reportName, query })

    const { csv, headers } = await getReport(username, query)

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })
    res.send(csv)
  }

  private static isDateString(value: unknown): value is string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false
    }

    const parsedDate = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(value)
  }
}

import { Request, Response } from 'express'

import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'

export default class ReportingController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  private static hasValidDateString(value: unknown): value is string {
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

  async downloadGroupSizeReport(req: Request, res: Response): Promise<void> {
    const { groupStartedSince } = req.query

    if (!ReportingController.hasValidDateString(groupStartedSince)) {
      res.status(400).send('groupStartedSince must be a valid date-time string')
      return
    }

    const { username } = req.user
    const csv = await this.accreditedProgrammesManageAndDeliverService.getGroupSizeReport(username, groupStartedSince)

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.send(csv)
  }
}

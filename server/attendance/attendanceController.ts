import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import AttendancePresenter from './attendancePresenter'
import AttendanceView from './attendanceView'
import RecordAttendanceForm from './recordAttendanceForm'

export default class AttendanceController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showRecordAttendancePage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, sessionId } = req.params

    const recordAttendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      console.log(req.body)
      const data = await new RecordAttendanceForm(req).recordAttendanceData()
      // if (data.error) {
      //   res.status(400)
      //   formError = data.error
      // }
      // attendance-multi-select
      req.session.editSessionAttendance = { referralIds: req.body['multi-select-selected'] as string[] }
      return res.redirect(`/group/${groupId}/session/${sessionId}/record-attendance`)
    }

    const backLinkUri = `/group/${groupId}/session/${sessionId}/edit-session`

    const presenter = new AttendancePresenter(recordAttendanceBffData, backLinkUri)
    const view = new AttendanceView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

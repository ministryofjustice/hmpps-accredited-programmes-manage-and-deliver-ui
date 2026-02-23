import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import AttendancePresenter from './attendancePresenter'
import AttendanceView from './attendanceView'
import RecordAttendanceForm from './recordAttendanceForm'
import { FormValidationError } from '../utils/formValidationError'

export default class AttendanceController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showRecordAttendancePage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, sessionId } = req.params
    let formError: FormValidationError | null = null

    const recordAttendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
      username,
      sessionId,
      // req.session.editSessionAttendance.referralIds,
    )

    const data = await new RecordAttendanceForm(
      req,
      recordAttendanceBffData.people.map(it => ({ referralId: it.referralId, name: it.name })),
    ).recordAttendanceData()

    if (req.method === 'POST') {
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.editSessionAttendance.attendees = data.paramsForUpdate.attendees
        return res.redirect(`/group/${groupId}/session/${sessionId}/record-attendance`)
      }
    }

    const backLinkUri = `/group/${groupId}/session/${sessionId}/edit-session`

    const presenter = new AttendancePresenter(recordAttendanceBffData, backLinkUri, formError)
    const view = new AttendanceView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}

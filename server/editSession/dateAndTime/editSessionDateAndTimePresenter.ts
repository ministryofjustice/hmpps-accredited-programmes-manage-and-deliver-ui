import { EditSessionDetails, RescheduleSessionRequest } from '@manage-and-deliver-api'
import PresenterUtils from '../../utils/presenterUtils'
import { FormValidationError } from '../../utils/formValidationError'

export default class EditSessionDateAndTimePresenter {
  constructor(
    readonly groupId: string,
    private readonly sessionDetails: EditSessionDetails,
    private readonly rescheduleSessionStorageData: Partial<RescheduleSessionRequest> | null = null,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get backLinkUri() {
    return `/group/${this.groupId}/sessionId/${this.sessionDetails.sessionId}/${this.sessionDetails.sessionName}`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get text() {
    return {
      headingText: `Edit the session date and time`,
      headingCaptionText: `Edit ${this.sessionDetails.sessionName}`,
    }
  }

  get fields() {
    return {
      sessionDate: {
        value: this.utils.stringValue(
          this.rescheduleSessionStorageData?.sessionStartDate ?? this.sessionDetails.sessionDate,
          'session-details-date',
        ),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-details-date'),
      },
      startTime: this.utils.twelveHourTimeValue(
        {
          hour: this.rescheduleSessionStorageData?.sessionStartTime?.hour ?? this.sessionDetails.sessionStartTime.hour,
          minutes:
            this.rescheduleSessionStorageData?.sessionStartTime?.minutes ??
            this.sessionDetails.sessionStartTime.minutes,
          amOrPm:
            this.rescheduleSessionStorageData?.sessionStartTime?.amOrPm ?? this.sessionDetails.sessionStartTime.amOrPm,
        },
        'session-details-start-time',
        this.validationError,
      ),
      endTime: this.utils.twelveHourTimeValue(
        {
          hour: this.rescheduleSessionStorageData?.sessionEndTime?.hour ?? this.sessionDetails.sessionEndTime.hour,
          minutes:
            this.rescheduleSessionStorageData?.sessionEndTime?.minutes ?? this.sessionDetails.sessionEndTime.minutes,
          amOrPm:
            this.rescheduleSessionStorageData?.sessionEndTime?.amOrPm ?? this.sessionDetails.sessionEndTime.amOrPm,
        },
        'session-details-end-time',
        this.validationError,
      ),
    }
  }
}

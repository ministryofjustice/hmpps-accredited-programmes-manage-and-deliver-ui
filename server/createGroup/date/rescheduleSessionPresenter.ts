import { CreateGroupRequest, CreateGroupSessionSlot } from '@manage-and-deliver-api'
import PresenterUtils from '../../utils/presenterUtils'
import { FormValidationError } from '../../utils/formValidationError'
import { SummaryListItem } from '../../utils/summaryList'
import DateUtils from '../../utils/dateUtils'
import GroupDaysTimesUtils from '../../utils/groupDaysTimesUtils'

export default class RescheduleSessionsPresenter {
  constructor(
    readonly groupId: string,
    readonly updatedGroupDetails: Partial<CreateGroupRequest> & {
      previousDate?: string
      previousSessions?: CreateGroupSessionSlot[]
    },
    readonly isEditDate: boolean = false,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  get text() {
    return {
      headingText: 'Rescheduling sessions',
      headingCaptionText: `Edit group ${this.updatedGroupDetails.groupCode}`,
    }
  }

  get backLinkUri() {
    return this.isEditDate
      ? `/group/${this.groupId}/edit-group-start-date`
      : `/group/${this.groupId}/edit-group-days-and-times`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  private formatDateWithDayOfWeek(dateString: string | undefined): string {
    if (!dateString) {
      return ''
    }

    // Convert DD/MM/YYYY to Date object
    const [day, month, year] = dateString.split('/')
    const date = new Date(`${year}-${month}-${day}`)

    const dayOfWeek = DateUtils.formattedDayOfWeek(date)
    const formattedDate = DateUtils.formattedDate(date)

    return `${dayOfWeek} ${formattedDate}`
  }

  get sessionDateAndTimesSummary(): SummaryListItem[] {
    return this.isEditDate
      ? [
          {
            key: 'Previous start date',
            keyClass: 'session-reschedule-table-key-width',
            lines: [this.updatedGroupDetails.previousDate],
          },
          {
            key: 'New start date',
            keyClass: 'session-reschedule-table-key-width',
            lines: [this.formatDateWithDayOfWeek(this.updatedGroupDetails.earliestStartDate)],
          },
        ]
      : [
          {
            key: 'Previous days and times',
            keyClass: 'session-reschedule-table-key-width',
            lines: GroupDaysTimesUtils.formatStartDaysAndTimes(this.updatedGroupDetails.previousSessions),
          },
          {
            key: 'New days and times',
            keyClass: 'session-reschedule-table-key-width',
            lines: GroupDaysTimesUtils.formatStartDaysAndTimes(this.updatedGroupDetails.createGroupSessionSlot),
          },
        ]
  }
}

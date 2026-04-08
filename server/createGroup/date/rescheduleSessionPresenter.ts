import { CreateGroupRequest } from '@manage-and-deliver-api'
import PresenterUtils from '../../utils/presenterUtils'
import { FormValidationError } from '../../utils/formValidationError'
import { SummaryListItem } from '../../utils/summaryList'
import DateUtils from '../../utils/dateUtils'

export default class RescheduleSessionsPresenter {
  constructor(
    readonly groupId: string,
    readonly updatedGroupDetails: Partial<CreateGroupRequest> & {
      previousDate?: string
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
    return `/group/${this.groupId}/edit-group-start-date`
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
      : []
  }
}

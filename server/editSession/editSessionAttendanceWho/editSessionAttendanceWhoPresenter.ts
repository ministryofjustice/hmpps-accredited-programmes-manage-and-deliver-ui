import { Session, EditSessionAttendee, GroupItem } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'

type IndividualGroupMember = NonNullable<GroupItem['content']>[number]

export default class EditSessionAttendanceWhoPresenter {
  constructor(
    readonly groupId: string,
    readonly backUrl: string,
    readonly sessionDetails: Session,
    readonly currentlyAttending: EditSessionAttendee,
    readonly groupMembers: Array<IndividualGroupMember>,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `${this.sessionDetails.name}`,
      pageHeadingType: this.sessionDetails.isCatchup ? 'one-to-one catch-up' : 'one-to-one',
      pageCaption: `${this.currentlyAttending.name || ''}`,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.backUrl,
    }
  }

  generateAttendeeRadioOptions(): RadiosArgsItem[] {
    const selectedValue = this.userInputData?.['edit-session-attendance-who'] as string
    if (this.currentlyAttending.referralId && !selectedValue) {
      return this.groupMembers.map(member => ({
        text: `${member.personName} (${member.crn})`,
        value: member.referralId,
        checked: member.referralId === this.currentlyAttending.referralId,
      }))
    }
    return this.groupMembers.map(member => ({
      text: `${member.personName} (${member.crn})`,
      value: member.referralId,
      checked: selectedValue === member.referralId,
    }))
  }

  get fields() {
    return {
      'edit-session-attendance-who': {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'edit-session-attendance-who'),
      },
    }
  }
}

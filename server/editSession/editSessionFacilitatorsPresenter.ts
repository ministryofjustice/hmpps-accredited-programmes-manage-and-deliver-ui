import {
  EditSessionFacilitator,
  EditSessionFacilitatorsRequest,
  EditSessionFacilitatorsResponse,
} from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import { SelectArgsItem } from '../utils/govukFrontendTypes'
import PresenterUtils from '../utils/presenterUtils'

export default class EditSessionFacilitatorsPresenter {
  constructor(
    readonly linkUrl: string,
    readonly groupId: string,
    readonly editSessionFacilitatorsResponse: EditSessionFacilitatorsResponse,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly editSessionFacilitatorsRequest: Partial<EditSessionFacilitatorsRequest> | null = null,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `Edit the session facilitators`,
      pageCaption: this.editSessionFacilitatorsResponse.pageTitle,
      subHeading: 'Attendance and session notes',
    }
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.linkUrl,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  generateSelectOptions(selectedValue: string = ''): SelectArgsItem[] {
    const pduItems: SelectArgsItem[] = this.editSessionFacilitatorsResponse.facilitators.map(member => ({
      text: member.facilitator,
      value: `{"facilitator":"${member.facilitator}", "facilitatorCode":"${member.facilitatorCode}", "teamName":"${member.teamName}", "teamCode":"${member.teamCode}"}`,
      selected: selectedValue === member.facilitatorCode,
    }))

    const items: SelectArgsItem[] = [
      {
        text: '',
        value: '',
      },
    ]

    items.push(...pduItems)
    return items
  }

  generateSelectedUsers(): {
    facilitators: EditSessionFacilitator[] | []
  } {
    let parsedMembers: EditSessionFacilitator[]
    if (this.userInputData) {
      parsedMembers = this.getParsedMembers()
    } else {
      parsedMembers = this.editSessionFacilitatorsRequest?.teamMembers
    }
    if (!parsedMembers) {
      return {
        facilitators: [],
      }
    }
    return {
      facilitators: parsedMembers,
    }
  }

  private getParsedMembers(): EditSessionFacilitator[] {
    const { _csrf, ...formValues } = this.userInputData
    const membersToParse = Object.values(formValues) as string[]

    return membersToParse
      .filter(userAsJsonString => userAsJsonString !== '')
      .map(userAsJsonString => JSON.parse(userAsJsonString))
  }

  get fields() {
    const members = this.generateSelectedUsers()
    return {
      editSessionFacilitator: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'edit-session-facilitator'),
      },
    }
  }
}
